import React, { Component } from 'react'
import { Label, Icon, Form, Message } from 'semantic-ui-react'
import { categoryEntries } from '../Helpers/contentful'
import { getCurrentTab } from '../Helpers/extensionUtils'
import {environment as contentfulClient} from '../Helpers/contentful'
import { user } from '../Helpers/contentful'
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
      tab: '',
      category: '',
      note: '',
      createdBy: '',
      loading: false,
      errors: {}
    }
  }

  componentDidMount () {
    getCurrentTab(tab => {
      this.setState({ tab })
    })

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

  handleClick = page => ev => {
    ev.preventDefault()
    this.setState({ page: page.next })
  }

  handleChange = (ev, { name, value }) => {
    this.setState({ [name]: value })
  }

  handleSubmit = ev => {
    ev.preventDefault()

    const { note, category, tab, createdBy } = this.state

    this.setState({ loading: true })

    // TODO validation for if user has saved tab previously
    // client.CDAClient.getEntry('tab')
    // .then(console.log)
    // .catch(console.error)
    
    retrieveUser().then(user => this.setState({ user: user[0].sys.id }))

    const payload = {
      title: {
        'en-US': tab.title || 'Abc',
      },
      note: {
        'en-US': note
      },
      url: {
        'en-US': tab.url || 'http://abc.com'
      },
      tag: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: category
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

    contentfulClient.then(environment => environment.createEntry('tab', {
      fields: payload
    }))
    .then(entry => entry.publish())
    .then(result => this.setState({loading: false}))
    .catch(error => {
      this.setState({loading: false, errors: JSON.parse(error.message)})
    })
  }

  render () {
    const { page, note, category, tab, options, loading, errors } = this.state
  
    return (
      <React.Fragment>
        {(page === 'SaveTab') ? 
        <div id='SaveTab' className='save-tab'>
          <div className='tabs-header'>
            <div className='menu-links'>
              <Label color='black' as='a' onClick={this.handleClick({ current: 'SaveTab', next: 'Tabs' })}>
                <Icon name='linkify' />My Tabs
              </Label>
            </div>

            <Icon className='with-pointer' name='home' size='large' onClick={this.handleClick({ current: 'Tabs', next: 'App' })} />
          </div>

          <div className='save-tab-form'>
            {errors.status ? 
              <Message
                error
                header={errors.message}
                content={errors.details.errors[0].details + ' - "' + errors.details.errors[0].value + 'å"'}
              />:''
            }
            <Message
              attached
              header='Ready to save tab!'
              content='Fill out the fields below for the tab' />

            <Form className='attached fluid segment' onSubmit={this.handleSubmit}>
              <Form.Group widths='equal'>
                <Form.Input fluid className='disabled-field' label='Tab Title' placeholder='Enter Tab Title' value={tab.title} disabled />
                <Form.Select name='category' value={category} onChange={this.handleChange} fluid label='Tab Category' options={options} placeholder='Select Category' />
              </Form.Group>
              
              <Form.TextArea name='note' value={note} onChange={this.handleChange} label='Note' placeholder='Leave a note regarding this tab...' />
              
              {loading ? <Form.Button loading>Loading</Form.Button> :  <Form.Button>Save</Form.Button>}
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
          : (page === 'Tabs') ? <Tabs updateTabEntries={this.props.updateTabEntries} />
            :''
        }
      </React.Fragment>
    )
  }
}

export default SaveTab
