import React, { Component } from 'react'
import { Button, Icon, Label, Form } from 'semantic-ui-react'
import Tabs from '../Tabs/Tabs'
import SaveTab from '../Tabs/SaveTab'
import logo from '../contentful-logo-1.png'
import { getEntries, environment as contentfulClient } from '../Helpers/contentful'

import './App.css'
const localStorage = window.localStorage

const retrieveUser = (email = localStorage.user) => {
  return getEntries({ content_type: 'user', 'fields.email': email })
}

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      page: 'App',
      user: '',
      email: '',
      messageTimeout: ''
    }

    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  componentDidMount () {
    if (document.querySelector('div.all-good')) {
      document.querySelector('div.all-good').style.display = 'none'
    }
    if (document.querySelector('div.menu-links')) {
      document.querySelector('div.menu-links').style.display = 'none'
    }
    if (document.querySelector('.save-tab-btn')) {
      document.querySelector('.save-tab-btn').style.display = 'none'
    }

    this.updateUserData()

    if (localStorage.user) {
      this.setState({ email: localStorage.user })

      document.querySelector('Form.user-form button').textContent = 'Switch User'
      document.querySelector('.save-tab-btn').style.display = 'block'
      document.querySelector('div.menu-links').style.display = 'block'
    }
  }

  async getFilteredEntries () {
    return getEntries({ content_type: 'tab', order: '-sys.createdAt' }).then(result => {
      const filteredResult = result.items.filter(value => {
        return value.fields.createdBy.fields.email === window.localStorage.getItem('user')
      })

      return filteredResult
    })
  }

  updateUserData () {
    retrieveUser().then(user => {
      if (user.items.length > 0) {
        this.setState({ user: user.items[0].sys.id })
      }
    })
  }

  handlePageChange (ev, page) {
    ev.preventDefault()
    this.setState({ page: page.next })
  }

  handleSave (ev, page) {
    this.handlePageChange(ev, page)
  }

  handleInputChange = (ev, { name, value }) => {
    this.setState({ [name]: value })
  }

  handleUserSwitch = (ev) => {
    ev.preventDefault()
    const { email } = this.state

    if (!this.isValidEmail(email)) {
      alert('Please enter a valid email')
      return
    }
    // find or create user
    retrieveUser(email)
      .then(result => {
        if (result.items.length === 0) {
          contentfulClient.then(environment => environment.createEntry('user', {
            fields: {
              email: {
                'en-US': email,
              }
            }
          }))
          .then(entry => entry.publish())
          .then(result => {
            this.setState({user: result.sys.id})
          })
          .catch(console.error)
        } else {
          this.setState({ user: result.items[0].sys.id })
        }
      })
      .then(() => {
        localStorage.setItem('user', email)

        document.querySelector('Form.user-form button').textContent = 'Switch User'
        document.querySelector('.save-tab-btn').style.display = 'block'
        document.querySelector('div.menu-links').style.display = 'block'
        document.querySelector('div.all-good').style.display = 'block'
        
        this.setState({messageTimeout: setTimeout(() => document.querySelector('div.all-good').style.display = 'none', 5000)})
      })
      .catch(console.error)
  }

  handleInputClick () {
    const element = document.getElementById('account-form')
    element.scrollIntoView({ behavior: 'smooth' })
  }

  isValidEmail (email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return regex.test(email)
  }

  render () {
    const { user, page, email, messageTimeout } = this.state

    return (
      <div>
        {(page === 'App')
          ? <div id='App' className='App'>
            <div className='menu-links'>
              <Label className='save-tab-btn' color='black' as='a' onClick={ev => this.handleSave(ev, { current: 'App', next: 'SaveTab' })}>
                <Icon name='add' />Save Tab
              </Label>
              <Label className='my-tabs-btn' as='a' onClick={ev => this.handlePageChange(ev, { current: 'App', next: 'Tabs' })}>
                <Icon name='linkify' />My Tabs
              </Label>
            </div>

            <div className='app-main'>
              <div className='App-header'>

                <img src={logo} className='App-logo' alt='logo' />
                <h1>
                  <span className='tabify-logo'>Tabify</span> ❣️ <span>Contentful</span>
                </h1>

                <small>Keep your browser tabs clean. Save tabs and check them out later.</small>
                <br />
                <br />
                <Form id='account-form' onSubmit={this.handleUserSwitch} className='user-form'>
                  <Form.Group widths='equal'>
                    <Form.Input name='email' value={email} onClick={this.handleInputClick} onChange={this.handleInputChange} fluid label='Enter an email to work with' placeholder='Email' />

                    <Label className='my-tabs-btn all-good'>
                      <Icon name='check' />Success
                    </Label>
                  </Form.Group>

                  <Button color='orange' basic type='submit'>Add Account</Button>
                </Form>
              </div>
            </div>
          </div>
          : (page === 'Tabs') ? <Tabs messageTimeout = {messageTimeout} getFilteredEntries={this.getFilteredEntries} user={user} />
            : (page === 'SaveTab') ? <SaveTab messageTimeout = {messageTimeout} getFilteredEntries={this.getFilteredEntries} user={user} /> : ''
        }
      </div>
    )
  }
}

export default App
