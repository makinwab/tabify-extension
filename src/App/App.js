import React, { Component } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react'
import Tabs from '../Tabs/Tabs'
import SaveTab from '../Tabs/SaveTab'
import logo from '../contentful-logo-1.png'
import { user, getEntries } from '../Helpers/contentful'

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
      user: ''
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  componentDidMount () {
    this.updateUserData()
  }

  getFilteredEntries () {
    return getEntries({ content_type: 'tab' }).then(result => {
      const filteredResult = result.items.filter(value => {
        return value.fields.createdBy.fields.email === window.localStorage.getItem('user')
      })

      return filteredResult
    })
  }

  updateUserData () {
    retrieveUser().then(user => this.setState({ user: user[0].sys.id }))
  }

  handleClick (ev, page) {
    ev.preventDefault()
    this.setState({ page: page.next })
  }

  handleSave (ev, page) {
    this.handleClick(ev, page)
  }

  render () {
    const { user, page } = this.state

    return (
      <div>
        {(page === 'App')
          ? <div id='App' className='App'>
            <div className='menu-links'>
              <Label color='black' as='a' onClick={ev => this.handleClick(ev, { current: 'App', next: 'Tabs' })}>
                <Icon name='linkify' />My Tabs
              </Label>
            </div>
            <div className='app-main'>
              <header className='App-header'>

                <img src={logo} className='App-logo' alt='logo' />

                <br />

                <h1>
                  <span className='tabify-logo'>Tabify</span> ➕ <span>Contentful</span> ≌ 😍
                </h1>

                <h4>Keep your browser tabs clean. Save tabs and check them out later.</h4>

                <br />

                <Button content='Save Tab' onClick={ev => this.handleSave(ev, { current: 'App', next: 'SaveTab' })} />
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
