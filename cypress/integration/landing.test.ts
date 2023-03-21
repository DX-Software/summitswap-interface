import { TEST_ADDRESS_NEVER_USE_SHORTENED } from '../support/commands'

describe('Landing Page', () => {
  beforeEach(() => cy.visit('/'))
  it('loads staking deposit page', () => {
    cy.get('#staking-deposit-page')
  })

  it('redirects to url /staking/deposit', () => {
    cy.url().should('include', '/staking/deposit')
  })

  // Wallet not connected - test will not pass.
  // it('is connected', () => {
  //   cy.get('#web3-status-connected').click()
  //   cy.get('#web3-account-identifier-row').contains(TEST_ADDRESS_NEVER_USE_SHORTENED)
  // })
})
