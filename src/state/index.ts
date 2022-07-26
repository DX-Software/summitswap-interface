import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { load, save } from 'redux-localstorage-simple'

import { getThemeCache } from '../utils/theme'
import application from './application/reducer'
import burn from './burn/reducer'
import { updateVersion } from './global/actions'
import info from './info'
import lists from './lists/reducer'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'

type MergedState = {
  user: {
    [key: string]: any
  }
  transactions: {
    [key: string]: any
  }
}
const PERSISTED_KEYS: string[] = ['user', 'transactions']
const loadedState = load({ states: PERSISTED_KEYS }) as MergedState
if (loadedState.user) {
  loadedState.user.userDarkMode = getThemeCache()
}

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    lists,
    info,
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: loadedState,
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
