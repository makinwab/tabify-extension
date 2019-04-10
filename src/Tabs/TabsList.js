import React from 'react'
import { List, Divider, Button, Icon } from 'semantic-ui-react'
import { environment as ContentfulClient } from '../Helpers/contentful'

class TabsList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.handleRemove = this.handleRemove.bind(this)
  }

  handleRemove = (ev) => {
    this.props.handleLoader(true)
    ev.preventDefault()
    let entryId = ev.currentTarget.dataset.entryId

    ContentfulClient
      .then(environment => environment.getEntry(entryId))
      .then(entry => entry.unpublish())
      .then(entry => entry.delete())
      .then(() => {
        let tabElement = document.getElementById(entryId)

        tabElement.nextElementSibling.remove()
        tabElement.remove()

        this.props.handleRemovedTab()
        this.props.handleLoader(false)
        
      })
      .catch(console.error)
  }

  render () {
    return (
      <React.Fragment>
        <List.Item id={this.props.entry.sys.id}>
          <List.Icon className='list-icon' name='linkify' size='large' verticalAlign='middle' />

          <List.Content>
            <List.Header>
              <a href={this.props.entry.fields.url} target='_blank' rel='noopener noreferrer'>{this.props.entry.fields.title}</a>
              <span className='tabs-tag'> ( #{this.props.entry.fields.tag.fields.name} )</span>
            </List.Header>
            <List.Description className='note'>{this.props.entry.fields.note}</List.Description>
            <List.Description className='tab-meta'>Saved at {this.props.entry.sys.createdAt}</List.Description>
            <br />
            <List.Item>
              <Button basic size='tiny' animated='vertical' color='teal' onClick={ev => this.props.handlePageChange(ev, { current: 'Tabs', next: 'SaveTab' }, this.props.entry.sys.id)}>
                <Button.Content hidden>Edit</Button.Content>
                <Button.Content visible>
                  <Icon name='edit' />
                </Button.Content>
              </Button>

          &nbsp;

              <Button data-entry-id={this.props.entry.sys.id} onClick={this.handleRemove} basic size='tiny' animated='vertical' color='red'>
                <Button.Content hidden>Remove</Button.Content>
                <Button.Content visible>
                  <Icon name='remove' />
                </Button.Content>
              </Button>
            </List.Item>
          </List.Content>
        </List.Item>

        <Divider />
      </React.Fragment>
    )
  }
}

export default TabsList
