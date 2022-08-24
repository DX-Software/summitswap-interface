import axios from 'axios'
import { BACKEND_API } from 'constants/index'

const httpClient = axios.create({
  baseURL: `${BACKEND_API}`,
  headers: {
    'Content-type': 'application/json',
  },
})

httpClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.log(error)
    return Promise.reject(error)
  }
)

export default httpClient
