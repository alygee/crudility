import mockSchema from '@/static/mockData/schema'
import mockQuery from '~/static/mockData/query_response_data'

export default {
  fetchSchema: jest.fn(() => Promise.resolve(mockSchema)),
  fetchData: jest.fn(() => Promise.resolve(mockQuery))
}
