import React, { Component } from 'react'
import { Label, Icon, Form, Message } from 'semantic-ui-react'

const options = [
  { key: 'm', text: 'Male', value: 'male' }
]

class SaveTab extends Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (ev, page) {
    ev.preventDefault()
    document.getElementById(page.current).style.display = 'none'
    document.getElementById(page.next).style.display = 'block'
  }

  render () {
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
          <Message
            attached
            header='Ready to save tab!'
            content='Fill out the fields below for the tab' />
          <Form className='attached fluid segment'>
            <Form.Group widths='equal'>
              <Form.Input fluid label='Tab Title' placeholder='Enter Tab Title' />
              <Form.Select fluid label='Tab Category' options={options} placeholder='Select Category' />
            </Form.Group>
            <Form.TextArea label='Note' placeholder='Leave a note regarding this tab...' />
            <Form.Button>Save</Form.Button>
          </Form>
          <Message attached='bottom'>
            <Icon name='linkify' />
            <a href='http://www.contentful.org' target='_blank' rel='noopener noreferrer'>http://www.contentful.org</a>
          </Message>
        </div>
      </div>
    )
  }
}

export default SaveTab
