import React, { Component } from 'react'
import { Label, Icon, Form, Message } from 'semantic-ui-react'
import { categoryEntries } from '../Helpers/contentful'
import { getCurrentTab } from '../Helpers/extensionUtils'
import {environment as contentfulClient} from '../Helpers/contentful'
import { user } from '../Helpers/contentful'

const localStorage = window.localStorage

const retrieveUser = () => {
  return user.then(entry => entry.items.filter(value => value.fields.email === localStorage.getItem('user')))
}

class SaveTab extends Component {
  constructor (props) {
    super(props)

    this.state = {
      options: [],
      tab: '',
      category: '',
      note: '',
      createdBy: '',
      loading: false,
      errors: {}
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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

  handleClick (ev, page) {
    ev.preventDefault()
    document.getElementById(page.current).style.display = 'none'
    document.getElementById(page.next).style.display = 'block'
  }

  handleChange = (ev, { name, value }) => {
    console.log(name, value)
    this.setState({ [name]: value })
  }

  handleSubmit (ev) {
    ev.preventDefault()

    const { note, category, tab, createdBy } = this.state

    this.setState({ loading: true })
    
    retrieveUser().then(user => this.setState({ user: user[0].sys.id }))

    const payload = {
      title: {
        'en-US': tab.title || 'Google Home',
      },
      note: {
        'en-US': note
      },
      url: {
        'en-US': tab.url || 'http://google.com'
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
    const { note, category, tab, options, loading, errors } = this.state
    console.log(loading)
    return (
      <div id='SaveTab' className='save-tab'>
        <div className='tabs-header'>
          <div className='menu-links'>
            <Label color='black' as='a' onClick={ev => this.handleClick(ev, { current: 'SaveTab', next: 'Tabs' })}>
              <Icon name='linkify' />My Tabs
            </Label>
          </div>

          <Icon className='with-pointer' name='home' size='large' onClick={ev => this.handleClick(ev, { current: 'Tabs', next: 'App' })} />
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

          <Form className='attached fluid segment' onSubmit={ev => this.handleSubmit(ev)}>
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
    )
  }
}

export default SaveTab
