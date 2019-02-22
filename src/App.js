import React, { Component } from 'react'
import logo from './contentful-logo-1.png'
import { Button } from 'semantic-ui-react'
import './App.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />

          <br />

          <h1>
            <span className='tabify-logo'>Tabify</span> ➕ <span>Contentful</span> ≌ 😍
          </h1>

          <h4>Keep your browser tabs clean. Save tabs and check them out later.</h4>

          <br />

          <Button content='Save Tab' />
        </header>
      </div>
    )
  }
}

export default App
