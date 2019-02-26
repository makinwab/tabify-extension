import React, { Component } from 'react'
import { Label, Icon, Form, Message } from 'semantic-ui-react'
import { categoryEntries } from '../Helpers/contentful'
import { getCurrentTab } from '../Helpers/extensionUtils'

class SaveTab extends Component {
  constructor (props) {
    super(props)

    this.state = {
      options: [],
      tab: ''
    }
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount () {
    getCurrentTab(tab => {
      this.setState({ tab })
    })
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

  render () {
    console.log(this.state.tab)
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
              <Form.Input fluid className='disabled-field' label='Tab Title' placeholder='Enter Tab Title' value={this.state.tab.title} disabled />
              <Form.Select fluid label='Tab Category' options={this.state.options} placeholder='Select Category' />
            </Form.Group>
            <Form.TextArea label='Note' placeholder='Leave a note regarding this tab...' />
            <Form.Button>Save</Form.Button>
          </Form>

          <Message attached='bottom'>
            <div className='truncate-text'>
              <Icon name='linkify' />
              <a className='with-pointer' href={this.state.tab.url} target='_blank' rel='noopener noreferrer'>{this.state.tab.url}</a>
            </div>
          </Message>
        </div>
      </div>
    )
  }
}

export default SaveTab
