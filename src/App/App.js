import React, { Component } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react'
import Tabs from '../Tabs/Tabs'
import { tabEntries } from '../Helpers/contentful'
import logo from '../contentful-logo-1.png'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      page: 'home'
    }
  }

  handleClick = page => ev => {
    ev.preventDefault()
  
    document.getElementById(page.current).style.display = 'none'
    document.getElementById(page.next).style.display = 'block'
  }
  render () {
    return (
      <div>
        <div id="App" className='App'>
          <div className='menu-links'>
            <Label color='black' as='a' onClick={this.handleClick({current: 'App', next: 'Tabs'})}>
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

              <Button content='Save Tab'/>
            </header>
          </div>
        </div>
        <Tabs entries={tabEntries} />
      </div>
    )
}
}

export default App
