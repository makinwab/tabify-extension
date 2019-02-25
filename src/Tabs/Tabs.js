import React, { Component } from 'react'
import { Search, List, Label, Icon } from 'semantic-ui-react'
import TabsList from './TabsList'
import { tabEntries } from '../Helpers/contentful'
import './Tabs.css'

class Tabs extends Component {
  constructor (props) {
    super(props)

    this.state = {
      entries: [],
      page: 'tabs'
    }

    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount () {
    tabEntries.then(result => {
      this.setState({ entries: result.items })
    })
  }

  handleClick (ev, page) {
    ev.preventDefault()

    document.getElementById(page.current).style.display = 'none'
    document.getElementById(page.next).style.display = 'block'
  }

  render () {
    return (
      <div id='Tabs' className='Tabs'>
        <div className='tabs-header'>
          <div className='menu-links'>
            <Label color='black' as='a' className='with-pointer' onClick={ev => this.handleClick(ev, { current: 'Tabs', next: 'SaveTab' })}>
              <Icon name='add' /> Save Tab
            </Label>
          </div>

          <Icon className='with-pointer' name='home' size='large' onClick={ev => this.handleClick(ev, { current: 'Tabs', next: 'App' })} />
        </div>

        <div className='tabs-main'>
          <center className='search-box'>
            <Search size='big' />
          </center>
          <List relaxed>
            {this.state.entries.map(value => {
              return (<TabsList key={value.sys.id} fields={value.fields} />)
            })}
          </List>
        </div>
      </div>
    )
  }
}

export default Tabs
