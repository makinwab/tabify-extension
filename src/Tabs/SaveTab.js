import React, { Component } from 'react'
import { Label, Icon, Form, Message } from 'semantic-ui-react'
import { categoryEntries } from '../Helpers/contentful'
import { getCurrentTab } from '../Helpers/extensionUtils'
import { getEntries, user, environment as contentfulClient } from '../Helpers/contentful'
import Tabs from '../Tabs/Tabs'
import App from '../App/App'

const localStorage = window.localStorage

const retrieveUser = () => {
  return user.then(entry => entry.items.filter(value => value.fields.email === localStorage.getItem('user')))
}

class SaveTab extends Component {
  constructor (props) {
    super(props)

    this.state = {
      page: 'SaveTab',
      options: [],
      tab: { url: 'http://labc.com' },
      category: '',
      selected: '',
      note: '',
      createdBy: '',
      loading: false,
      error: null,
      success: null
    }
  }

  componentDidMount () {
    if (this.props.editableTab) {
      getEntries({ content_type: 'tab', 'sys.id': this.props.editableTab })
        .then(result => {
          const tab = result.items[0].fields

          this.setState({
            tab: {
              url: tab.url,
              title: tab.title
            },
            category: tab.tag.fields.name,
            selected: tab.tag.sys.id,
            note: tab.note
          })
        })
    } else {
      getCurrentTab(tab => {
        this.setState({ tab })
      })
    }

    retrieveUser().then(user => this.setState({ createdBy: user[0].sys.id }))

    categoryEntries.then(result => {
      let options = result.items.map((value, index) => {
        return {
          key: value.sys.id,
          text: value.fields.name,
          value: value.sys.id
        }
      })

      this.setState({ options })
    })
  }

  handlePageChange = page => ev => {
    ev.preventDefault()
    this.setState({ page: page.next })
  }

  handleFormChange = (ev, { name, value }) => {
    let selected = this.state.selected
    if (name === 'category') {
      selected = value
    }
    this.setState({ [name]: value, selected })
  }

  handleSubmit = ev => {
    ev.preventDefault()

    const { category, tab } = this.state

    this.setState({ loading: true })

    if (!category) {
      this.handleFeedbackState({
        message: 'Category is missing',
        details: "Please select a category",
        value: '👇🏽'
      }, 'error')

      return
    }

    this.validateTab(tab.url || tab.href)
    .then(result => {
      if (result) {
        this.handleFeedbackState({
          message: 'Tab already exists',
          details: "You've previously saved this tab",
          value: tab.url || tab.href
        }, 'error')

        return
      }

      retrieveUser().then(user => this.setState({ user: user[0].sys.id }))
      this.saveTab()
    })
  }

  handleFeedbackState (feedback, type) {
    this.setState({
      loading: false,
      [type]: feedback
    })

    setTimeout(() => this.setState({[type]: null}), 5000)
  }

  validateTab (tabUrl) {
    return this.props.getFilteredEntries().then(result => {
      if (this.props.editableTab) {
        return false
      }
      return result.some(value => {
        return value.fields.url === tabUrl
      })
    })
  }

  saveTab ({ tab, note, selected, createdBy } = this.state) {
    const payload = {
      title: {
        'en-US': tab.title || 'Test Success'
      },
      note: {
        'en-US': note
      },
      url: {
        'en-US': tab.url || tab.href
      },
      tag: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: selected
          }
        }
      },
      createdBy: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: createdBy
          }
        }
      }
    }

    const tabToEdit = this.props.editableTab
    let result

    if (tabToEdit) {
      result = this.updateTab(payload, tabToEdit)
    } else {
      result = this.createTab(payload)
    }

    result.then(() => {
      this.setState({ category: '', note: '' })
      return this.handleFeedbackState(true, 'success')
    })
      .catch(e => {
        let error = JSON.parse(e.message)

        this.handleFeedbackState({
          message: error.message.message,
          details: error.message.details.errors[0].details,
          value: error.message.details.errors[0].value
        }, 'error')
      })
  }

  createTab (payload) {
    return contentfulClient
      .then(environment => environment.createEntry('tab', { fields: payload }))
      .then(entry => entry.publish())
  }

  updateTab (data, tabId) {
    return contentfulClient
      .then((environment) => environment.getEntry(tabId))
      .then((entry) => {
        entry.fields = data
        return entry.update()
      })
      .then(entry => entry.publish())
  }

  render () {
    const { page, note, category, tab, options, loading, error, success, selected } = this.state

    return (
      <React.Fragment>
        {(page === 'SaveTab')
          ? <div id='SaveTab' className='save-tab'>
            <div className='page-header'>
              <div className='menu-links'>
                <Label color='black' as='a' onClick={this.handlePageChange({ current: 'SaveTab', next: 'Tabs' })}>
                  <Icon name='linkify' />My Tabs
                </Label>
              </div>

              <Icon className='with-pointer' name='home' size='large' onClick={this.handlePageChange({ current: 'Tabs', next: 'App' })} />
            </div>

            <div className='save-tab-form'>
              {error
                ? <Message
                  error
                  header={error.message}
                  content={error.details + ' - ' + error.value}
                /> : ''
              }
              {success
                ? <Message
                  success
                  header='Tab Saved 🎉'
                  content="You've successfully saved a tab" />
                : ''
              }
              <Message
                attached
                header='Ready to save tab!'
                content='Fill out the fields below for the tab' />

              <Form id='saveTabForm' className='attached fluid segment' onSubmit={this.handleSubmit}>
                <Form.Group widths='equal'>
                  <Form.Input fluid className='disabled-field' label='Tab Title' placeholder='Enter Tab Title' value={tab.title} disabled />
                  <Form.Select
                    name='category'
                    onChange={this.handleFormChange}
                    value={selected || category}
                    fluid
                    label='Tab Category'
                    options={options}
                    placeholder='Select Category' />
                </Form.Group>

                <Form.TextArea name='note' value={note} onChange={this.handleFormChange} label='Note' placeholder='Leave a note regarding this tab...' />

                {loading ? <Form.Button loading>Loading</Form.Button> : <Form.Button>Save</Form.Button>}
              </Form>

              <Message attached='bottom'>
                <div className='truncate-text'>
                  <Icon name='linkify' />
                  <a className='with-pointer' href={tab.url} target='_blank' rel='noopener noreferrer'>{tab.url}</a>
                </div>
              </Message>
            </div>
          </div>
          : (page === 'App') ? <App />
            : (page === 'Tabs') ? <Tabs getFilteredEntries={this.props.getFilteredEntries} />
              : ''
        }
      </React.Fragment>
    )
  }
}

export default SaveTab
