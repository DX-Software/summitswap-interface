import axios from 'axios'
import { BACKEND_API } from 'constants/index'
import { WALLET_LOGIN_ACCESS_TOKEN_KEY } from 'constants/walletLogin'

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
    localStorage.removeItem(WALLET_LOGIN_ACCESS_TOKEN_KEY)
    return Promise.reject(error)
  }
)

export default httpClient
