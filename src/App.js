import React, { Component } from 'react'
import { Link } from '@reach/router'
import { Button, Icon, Label } from 'semantic-ui-react'
import logo from './contentful-logo-1.png'
import './App.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='my-tabs-link'>
          <Link to='/tabs'>
            <Label color='black'>
              <Icon name='linkify' />My Tabs
            </Label>
          </Link>
        </div>
        <header className='App-header'>

          <img src={logo} className='App-logo' alt='logo' />

          <br />

          <h1>
            <span className='tabify-logo'>Tabify</span> ➕ <span>Contentful</span> ≌ 😍
          </h1>

          <h4>Keep your browser tabs clean. Save tabs and check them out later.</h4>

          <br />

          <Link to='/save'>
            <Button content='Save Tab' icon='add' labelPosition='left' />
          </Link>
        </header>
      </div>
    )
  }
}

export default App
