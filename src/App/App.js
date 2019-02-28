import React, { Component } from 'react'
import { Button, Icon, Label, Form } from 'semantic-ui-react'
import Tabs from '../Tabs/Tabs'
import SaveTab from '../Tabs/SaveTab'
import logo from '../contentful-logo-1.png'
import { user, getEntries, environment as contentfulClient } from '../Helpers/contentful'

import './App.css'
const localStorage = window.localStorage

const retrieveUser = () => {
  return user.then(entry => entry.items.filter(value => value.fields.email === localStorage.getItem('user')))
}

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      page: 'App',
      user: '',
      email: ''
    }

    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  componentDidMount () {
    this.updateUserData()

    if (localStorage.user) {
      document.querySelector('.save-tab-btn').disabled = false
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
    retrieveUser().then(user => this.setState({ user: user[0].sys.id }))
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

  handleEmailForm = (ev) => {
    ev.preventDefault()
    const { email } = this.state

    contentfulClient.then(environment => environment.createEntry('user', {
      fields: {
        email: {
          'en-US': email,
        }
      }
    }))
    .then(entry => entry.publish())
    .then(() => { 
      localStorage.setItem('user', email)
      document.querySelector('Form.user-form button').disabled = true
      document.querySelector('Button.save-tab-btn').disabled = false
    })
    .catch(e => console.error)
  }

  render () {
    const { user, page, email } = this.state

    return (
      <div>
        {(page === 'App')
          ? <div id='App' className='App'>
            <div className='menu-links'>
              <Label color='black' as='a' onClick={ev => this.handlePageChange(ev, { current: 'App', next: 'Tabs' })}>
                <Icon name='linkify' />My Tabs
              </Label>
            </div>

            <div className='app-main'>
              <header className='App-header'>

                <Form onSubmit={this.handleEmailForm} className='user-form'>
                  <Form.Group widths='equal'>
                    <Form.Input name='email' value={email} onChange={this.handleInputChange} fluid label='Enter an email to work with' placeholder='Email'/>
                  </Form.Group>

                  <Button type='submit'>Use Email</Button>
                </Form>

                <img src={logo} className='App-logo' alt='logo' />

                <br />

                <h1>
                  <span className='tabify-logo'>Tabify</span> ❣️ <span>Contentful</span>
                </h1>

                <h4>Keep your browser tabs clean. Save tabs and check them out later.</h4>

                <br />

                <Button className='save-tab-btn' content='Save Tab' onClick={ev => this.handleSave(ev, { current: 'App', next: 'SaveTab' })} />
              </header>
            </div>
          </div>
          : (page === 'Tabs') ? <Tabs getFilteredEntries={this.getFilteredEntries} user={user} />
            : (page === 'SaveTab') ? <SaveTab getFilteredEntries={this.getFilteredEntries} user={user} /> : ''
        }
      </div>
    )
  }
}

export default App
