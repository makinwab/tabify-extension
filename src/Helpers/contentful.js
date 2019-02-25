const contentful = require('contentful')

const client = contentful.createClient({
  space: process.env.REACT_APP_SPACE_ID,
  accessToken: process.env.REACT_APP_ACCESS_TOKEN
})

export const tabEntries = client.getEntries({ content_type: 'tab' })
export const categoryEntries = client.getEntries({ content_type: 'category' })

export default client
