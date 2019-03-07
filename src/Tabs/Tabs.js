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
      page: 'Tabs',
      searchTerm: '',
      searchResults: []
    }

    this.handlePageChange = this.handlePageChange.bind(this)
  }

  componentDidMount () {
    this.invokeTabEntries()
  }

  invokeTabEntries () {
    this.props.getFilteredEntries().then(result => {
      this.setState({ entries: result, searchResults: result })
    })
  }

  handleSearch = (ev, { name, value }) => {
    const {entries} = this.state

    this.setState({
      searchResults: this.performSearch(entries, value.toLowerCase()),
      [name]: value
    })
  }

  performSearch (entries, value) {
    return entries.filter(entry => {
      return entry.fields.title.toLowerCase().includes(value) || entry.fields.tag.fields.name.toLowerCase().includes(value)
    })
  }

  handlePageChange (ev, page) {
    ev.preventDefault()
    this.setState({ page: page.next })
  }

  render () {
    const { page, searchTerm, entries, searchResults } = this.state
    let result = entries

    if (searchTerm.trim()) {
      result = searchResults
    }

    return (
      <React.Fragment>
        {(page === 'Tabs') ? <div id='Tabs' className='Tabs'>
          <div className='page-header'>
            <div className='menu-links'>
              <Label color='black' as='a' className='with-pointer' onClick={ev => this.handlePageChange(ev, { current: 'Tabs', next: 'SaveTab' })}>
                <Icon name='add' /> Save Tab
              </Label>
            </div>

            <Icon className='with-pointer' name='home' size='large' onClick={ev => this.handlePageChange(ev, { current: 'Tabs', next: 'App' })} />
          </div>

          <div className='tabs-main'>
            <center className='search-box'>
              <Search name='searchTerm' value={searchTerm} onSearchChange={this.handleSearch} size='big' />
            </center>
            <List relaxed>
              {result.length > 0 ? result.map(value => {
                return (<TabsList key={value.sys.id} createdAt={value.sys.createdAt} fields={value.fields} />)
              }): <h3 className='no-result'>Sorry! No Tabs Found <span role="img" aria-label='sad'>😢</span></h3>}
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
