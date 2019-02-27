import React, { Component } from 'react'
import { Search, List, Label, Icon } from 'semantic-ui-react'
import TabsList from './TabsList'
import SaveTab from './SaveTab'
import App from '../App/App'

import './Tabs.css'

class Tabs extends Component {
  constructor (props) {
    super(props)

    this.state = {
      entries: [],
      page: 'Tabs'
    }

    this.handlePageChange = this.handlePageChange.bind(this)
  }

  componentDidMount () {
    this.invokeTabEntries()
  }

  invokeTabEntries () {
    this.props.getFilteredEntries().then(result => {
      this.setState({ entries: result })
    })
  }

  handlePageChange (ev, page) {
    ev.preventDefault()
    this.setState({ page: page.next })
  }

  render () {
    const { page } = this.state
    return (
      <React.Fragment>
        {(page === 'Tabs') ? <div id='Tabs' className='Tabs'>
          <div className='tabs-header'>
            <div className='menu-links'>
              <Label color='black' as='a' className='with-pointer' onClick={ev => this.handlePageChange(ev, { current: 'Tabs', next: 'SaveTab' })}>
                <Icon name='add' /> Save Tab
              </Label>
            </div>

            <Icon className='with-pointer' name='home' size='large' onClick={ev => this.handlePageChange(ev, { current: 'Tabs', next: 'App' })} />
          </div>

          <div className='tabs-main'>
            <center className='search-box'>
              <Search size='big' />
            </center>
            <List relaxed>
              {this.state.entries.map(value => {
                return (<TabsList key={value.sys.id} createdAt={value.sys.createdAt} fields={value.fields} />)
              })}
            </List>
          </div>
        </div>
          : (page === 'SaveTab')
            ? <SaveTab getFilteredEntries={this.props.getFilteredEntries} user={this.props.user} />
            : (page === 'App')
              ? <App />
              : ''
        }
      </React.Fragment>
    )
  }
}

export default Tabs
