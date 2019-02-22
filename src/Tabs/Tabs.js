import React, { Component } from 'react'
import { Link } from '@reach/router'
import { Search, List, Label, Icon } from 'semantic-ui-react'
import TabsList from './TabsList'
import './Tabs.css'

class Tabs extends Component {
  constructor (props) {
    super(props)

    this.state = {
      entries: []
    }
  }

  componentDidMount () {
    this.props.entries.then(result => {
      this.setState({ entries: result.items })
    })
  }

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
            {this.state.entries.map(value => {
              console.log(value)
              return (<TabsList key={value.sys.id} fields={value.fields} />)
            })}

          </List>
        </div>
      </div>
    )
  }
}

export default Tabs
