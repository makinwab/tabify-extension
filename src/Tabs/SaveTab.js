import React, { Component } from 'react'
import { Label, Icon, Form, Message, Checkbox } from 'semantic-ui-react'
import { getCurrentTab, removeCurrentTab } from '../Helpers/extensionUtils'
import client, { getEntries, categoryEntries, environment as contentfulClient } from '../Helpers/contentful'
import Tabs from '../Tabs/Tabs'
import App from '../App/App'

const retrieveUser = () => {
  return client.CDAClient.getEntries({ content_type: 'user', 'fields.email': localStorage.user })
}

class SaveTab extends Component {
  constructor (props) {
    super(props)

    this.state = {
      page: 'SaveTab',
      options: [],
      tab: {},
      title: '',
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
    // Clear timeout from App component
    clearTimeout(this.props.messageTimeout)

    // If action is to edit, use already saved tab information
    // else get the browser's current tab
    if (this.props.editableTab) {
      getEntries({ content_type: 'tab', 'sys.id': this.props.editableTab })
        .then(result => {
          const tab = result.items[0].fields

          this.setState({
            tab: {
              url: tab.url
            },
            title: tab.title,
            category: tab.tag.fields.name,
            selected: tab.tag.sys.id,
            note: tab.note
          })
        })
    } else {
      getCurrentTab(tab => {
        this.setState({ tab, title: tab.title || tab.hostname })
      })
    }

    // Get current user and set state accordingly
    retrieveUser().then(result => {
      return this.setState({
        createdBy: result.items[0].sys.id ,
        closeTab: result.items[0].fields.closeTabOnSave
      })
    })

    // Get all categories for the dropdown
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

    const { category, tab, title } = this.state

    this.setState({ loading: true })

    if (!title) {
      this.handleFeedbackState({
        message: 'Title is missing',
        details: "Please add a title",
        value: '👇🏽'
      }, 'error')

      return
    }

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

      retrieveUser().then(result => this.setState({ user: result.items[0].sys.id }))
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

  saveTab ({ tab, note, selected, createdBy, title } = this.state) {
    const payload = {
      title: {
        'en-US': title
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

    result
      .then(() => {
        this.updateOnSaveTabStatus(this.state)
          .then((result) => {
            this.setState({ category: '', note: '' })
            return this.handleFeedbackState(true, 'success')
          })
          .then(() => {
            if (this.state.closeTab && !this.props.editableTab) {
              removeCurrentTab()
            }
          })
      })
      .catch(e => {
        let error = JSON.parse(e.message)

        if (error.status === 500) {
          this.handleFeedbackState({
            message: 'Internal Server Error',
            details: 'Please try this action again later',
            value: ''
          }, 'error')
        } else {
          this.handleFeedbackState({
            message: error.message.message,
            details: error.message.details.errors[0].details,
            value: error.message.details.errors[0].value
          }, 'error')
        }
      })
  }

  createTab (payload) {
    return contentfulClient
      .then(environment => environment.createEntry('tab', { fields: payload }))
      .then(entry => entry.publish())
  }

  updateTab (data, tabId) {
    return contentfulClient
      .then(environment => environment.getEntry(tabId))
      .then(entry => {
        entry.fields = data
        return entry.update()
      })
      .then(entry => entry.publish())
  }

  updateOnSaveTabStatus({ closeTab, user: userId}) {
    const data = {
      email: {
        'en-US': localStorage.user
      },
      closeTabOnSave: {
        'en-US': closeTab
      }
    }
    
    return contentfulClient
      .then(environment => environment.getEntry(userId))
      .then(entry => {
        entry.fields = data
        return entry.update()
      })
      .then(entry => entry.publish())
  }

  toggleCheck = () => {
    this.setState({closeTab: !this.state.closeTab})
  }

  render () {
    const { page, note, category, tab, options, loading, error, success, selected, closeTab, title } = this.state

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
                  <Form.Input fluid className='disabled-field' label='Tab Title' onChange={this.handleFormChange} placeholder='Enter Tab Title' name='title' value={title} />
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

                {this.props.editableTab ? '' : 
                  <Form.Field>
                    <Checkbox className='close-tab' toggle label='CLOSE TAB ON SAVE' checked={closeTab} onChange={this.toggleCheck}/>
                  </Form.Field>
                }

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
