import React from 'react'
import { List, Divider, Button, Icon } from 'semantic-ui-react'

const TabsList = (props) => (
  <React.Fragment>
    <List.Item>
      <List.Icon className='list-icon' name='linkify' size='large' verticalAlign='middle' />

      <List.Content>
        <List.Header>
          <a href={props.fields.url} target='_blank' rel='noopener noreferrer'>{props.fields.title}</a>
          <span className='tabs-tag'> ( #{props.fields.tag.fields.name} )</span>
        </List.Header>
        <List.Description className='note'>{props.fields.note}</List.Description>
        <List.Description className='tab-meta'>Saved at {props.createdAt}</List.Description>
        <br />
        <List.Item>
          <Button basic size='tiny' animated='vertical' color='teal'>
            <Button.Content hidden>Edit</Button.Content>
            <Button.Content visible>
              <Icon name='edit' />
            </Button.Content>
          </Button>

          &nbsp;

          <Button basic size='tiny' animated='vertical' color='red'>
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

export default TabsList
