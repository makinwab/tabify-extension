import React, { Component } from 'react'
import { Search, List, Label, Icon, Header, Message, Loader } from 'semantic-ui-react'
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
      searchResults: [],
      editableTab: null,
      tabRemoved: false,
      loader: false
    }

    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleRemovedTab = this.handleRemovedTab.bind(this)
    this.handleLoader = this.handleLoader.bind(this)
  }

  componentDidMount () {
    // Clear timeout from App component
    clearTimeout(this.props.messageTimeout)
  
    // Get all saved tabs
    this.invokeTabEntries()
  }

  invokeTabEntries () {
    this.props.getFilteredEntries().then(result => {
      this.setState({ entries: result, searchResults: result, count: result.length })
    })
  }

  handleSearch = (ev, { name, value }) => {
    const {entries} = this.state
    const result = this.performSearch(entries, value.toLowerCase())

    this.setState({
      searchResults: result,
      count: result.length,
      [name]: value
    })
  }

  performSearch (entries, value) {
    return entries.filter(entry => {
      return entry.fields.title.toLowerCase().includes(value) || entry.fields.tag.fields.name.toLowerCase().includes(value)
    })
  }

  handlePageChange (ev, page, id = null) {
    ev.preventDefault()
    if (id) {
      this.setState({ page: page.next, editableTab: id })
    } else {
      this.setState({ page: page.next })
    }
  }

  handleRemovedTab = () => {
    let {count} = this.state
    this.setState({count: count - 1, action: 'remove'})

    setTimeout(() => {
      this.setState({action: null})
    }, 5000)
  }

  handleLoader = (loader) => {
    this.setState({ loader })
  }

  render () {
    const { page, searchTerm, entries, searchResults, editableTab, count, action, loader } = this.state
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

            {action ? <Message
              success
              header='Successful Action!'
              content='Tab has been successfully removed'
            /> : ''}

            <Header as='h5' color='grey' inverted textAlign='right'>{count} Tab{count > 1 ? 's' : ''} Saved</Header>

            {loader ? <Loader inverted active inline='centered' size='small'>Removing Tab...</Loader> : ''}

            <List relaxed>
                {result.length > 0 ? result.map(value => {
                  return (
                    <TabsList
                      key={value.sys.id}
                      entry={value}
                      handlePageChange={this.handlePageChange}
                      handleRemovedTab={this.handleRemovedTab} 
                      handleLoader={this.handleLoader}
                    />)
                }) : <h3 className='no-result'>Sorry! No Tabs Found <span role='img' aria-label='sad'>😢</span></h3>}
              </List>
          </div>
        </div>
          : (page === 'SaveTab')
            ? <SaveTab getFilteredEntries={this.props.getFilteredEntries} user={this.props.user} editableTab={editableTab} />
            : (page === 'App')
              ? <App />
              : ''
        }
      </React.Fragment>
    )
  }
}

export default Tabs
