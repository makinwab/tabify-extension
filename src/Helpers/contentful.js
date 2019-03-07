const CDA = require('contentful')
const CMA = require('contentful-management')

const CDAClient = CDA.createClient({
  space: process.env.REACT_APP_SPACE_ID,
  accessToken: process.env.REACT_APP_ACCESS_TOKEN
})

const CMAClient = CMA.createClient({
  accessToken: process.env.REACT_APP_CMA_ACCESS_TOKEN
})

export const CMASpace = CMAClient.getSpace(process.env.REACT_APP_SPACE_ID)

export const environment = CMASpace.then(space => space.getEnvironment('master'))

export const user = CDAClient.getEntries({ content_type: 'user' })
export const getEntries = CDAClient.getEntries
export const categoryEntries = CDAClient.getEntries({ content_type: 'category' })

export default { CDAClient, CMAClient }
