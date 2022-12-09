import { WALLET_LOGIN_ACCESS_TOKEN_KEY } from 'constants/walletLogin'
import decode from 'jwt-decode'
import { useMutation } from 'react-query'
import { WalletLogin, WalletLoginResponse, WalletVerifyResponse } from 'types/walletLogin'
import Web3 from 'web3'
import httpClient from './http'

const URL = 'wallet'
const LOGIN_URL = `${URL}/login`
const VERIFY_URL = `${URL}/verify`

async function signAndGetToken(walletLogin: WalletLogin) {
  try {
    const loginResponse = await httpClient.post(`${LOGIN_URL}/${walletLogin.account}`)
    const wallet = loginResponse.data as WalletLoginResponse

    const web3 = new Web3(walletLogin.library.provider)
    const signature = await web3.eth.personal.sign(wallet.nonce, walletLogin.account, '')

    const verifyResponse = await httpClient.post(`${VERIFY_URL}/${walletLogin.account}`, {
      signature,
    })
    const accessToken = (verifyResponse.data as WalletVerifyResponse).access_token
    localStorage.setItem(WALLET_LOGIN_ACCESS_TOKEN_KEY, accessToken)
  } catch (error: any) {
    console.log('signAndGetToken', error)
  }
}

export default function useWalletLogin() {
  return useMutation(async (walletLogin: WalletLogin) => {
    const summitWalletToken = localStorage.getItem(WALLET_LOGIN_ACCESS_TOKEN_KEY)
    if (!summitWalletToken) {
      await signAndGetToken(walletLogin)
      return localStorage.getItem(WALLET_LOGIN_ACCESS_TOKEN_KEY)
    }

    const { exp } = decode<any>(summitWalletToken)
    if (exp * 1000 <= Date.now()) {
      localStorage.removeItem(WALLET_LOGIN_ACCESS_TOKEN_KEY)
      await signAndGetToken(walletLogin)
    }
    return localStorage.getItem(WALLET_LOGIN_ACCESS_TOKEN_KEY)
  })
}
