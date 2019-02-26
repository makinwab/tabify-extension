import React, { Component } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react'
import Tabs from '../Tabs/Tabs'
import SaveTab from '../Tabs/SaveTab'
import logo from '../contentful-logo-1.png'
import { user } from '../Helpers/contentful'

import './App.css'
const localStorage = window.localStorage

const retrieveUser = () => {
  return user.then(entry => entry.items.filter(value => value.fields.email === localStorage.getItem('user')))
}

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      page: 'home',
      user: ''
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  componentDidMount () {
    retrieveUser().then(user => this.setState({ user: user[0].sys.id }))
  }

  handleClick (ev, page) {
    ev.preventDefault()
    document.getElementById(page.current).style.display = 'none'
    document.getElementById(page.next).style.display = 'block'
  }

  handleSave (ev, page) {
    this.handleClick(ev, page)
  }

  render () {
    const { user } = this.state

    return (
      <div>
        <div id='App' className='App'>
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
        <Tabs />
        <SaveTab user={user} />
      </div>
    )
  }
}

export default App
