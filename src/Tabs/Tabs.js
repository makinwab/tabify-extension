import React, { Component } from 'react'
import { Link } from '@reach/router'
import { Grid, Search, List, Label, Icon, Divider } from 'semantic-ui-react'
import './Tabs.css'

class Tabs extends Component {
  render () {
    return (
      <div className='Tabs'>
        <div className='tabs-header'>
          <div className='menu-links'>
            <Link to='tabs'>
              <Label color='black'>
                <Icon name='add' />Save Tab
              </Label>
            </Link>
          </div>

          <Link className='home' to='/'>
            <Icon name='home' size='large' />
          </Link>
        </div>

        <div className='tabs-main'>
          <center className='search-box'>
            <Search size='big' />
          </center>
          <List relaxed>
            <List.Item>
              <List.Icon className='list-icon' name='linkify' size='large' verticalAlign='middle' />

              <List.Content>
                <List.Header as='a'>Semantic-Org/SEmantic-UI</List.Header>
                <List.Description className='note'>Updated 10 mins ago</List.Description>
              </List.Content>
            </List.Item>

            <Divider />

            <List.Item>
              <List.Icon className='list-icon' name='linkify' size='large' verticalAlign='middle' />

              <List.Content>
                <List.Header as='a'>Semantic-Org/SEmantic-UI</List.Header>
                <List.Description className='note'>Updated 10 mins ago</List.Description>
              </List.Content>
            </List.Item>
          </List>
        </div>
      </div>
    )
  }
}

export default Tabs
