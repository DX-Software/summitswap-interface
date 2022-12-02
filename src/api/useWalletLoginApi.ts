import decode from 'jwt-decode'
import { useMutation } from 'react-query'
import { WalletLogin, WalletLoginResponse, WalletVerifyResponse } from 'types/walletLogin'
import Web3 from 'web3'
import httpClient from './http'

const URL = 'wallet'
const LOGIN_URL = `${URL}/login`
const VERIFY_URL = `${URL}/verify`

async function signAndGetToken(walletLogin: WalletLogin) {
  const loginResponse = await httpClient.post(`${LOGIN_URL}/${walletLogin.account}`)
  const wallet = loginResponse.data as WalletLoginResponse

  const web3 = new Web3(walletLogin.library.provider)
  const signature = await web3.eth.personal.sign(wallet.nonce, walletLogin.account, '')

  const verifyResponse = await httpClient.post(`${VERIFY_URL}/${walletLogin.account}`, {
    signature,
  })
  const accessToken = (verifyResponse.data as WalletVerifyResponse).access_token
  localStorage.setItem('summitWalletToken', accessToken)
}

export default function useWalletLogin() {
  return useMutation(async (walletLogin: WalletLogin) => {
    const summitWalletToken = localStorage.getItem('summitWalletToken')
    if (!summitWalletToken) {
      await signAndGetToken(walletLogin)
      return localStorage.getItem('summitWalletToken')
    }

    const { exp } = decode<any>(summitWalletToken)
    if (exp * 1000 <= Date.now()) {
      await signAndGetToken(walletLogin)
    }
    return localStorage.getItem('summitWalletToken')
  })
}
