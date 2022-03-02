describe('Add Liquidity', () => {
  it('loads the two correct tokens', () => {
    cy.visit('#/add/0x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5-0xe9e7cea3dedca5984780bafc599bd69add087d56')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'KODA')
    cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'BUSD')
  })

  it('does not crash if KODA is duplicated', () => {
    cy.visit('#/add/0x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5-0x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'KODA')
    cy.get('#add-liquidity-input-tokenb #pair').should('not.contain.text', 'KODA')
  })

  it('token not in storage is loaded', () => {
    cy.visit('#/add/0xe9e7cea3dedca5984780bafc599bd69add087d56-0x7083609fce4d1d8dc0c979aab8c869ea2c873402')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'BUSD')
    cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'DOT')
  })

  it('single token can be selected', () => {
    cy.visit('#/add/0x7083609fce4d1d8dc0c979aab8c869ea2c873402')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'DOT')
    cy.visit('#/add/0xe9e7cea3dedca5984780bafc599bd69add087d56')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'BUSD')
  })

  it('redirects /add/token-token to add/token/token', () => {
    cy.visit('#/add/0xb290b2f9f8f108d03ff2af3ac5c8de6de31cdf6d-0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85')
    cy.url().should(
      'contain',
      '/add/0xb290b2f9f8f108d03ff2af3ac5c8de6de31cdf6d/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85'
    )
  })

  it('redirects /add/WETH-token to /add/WETH-address/token', () => {
    cy.visit('#/add/0xc778417E063141139Fce010982780140Aa0cD5Ab-0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85')
    cy.url().should(
      'contain',
      '/add/0xc778417E063141139Fce010982780140Aa0cD5Ab/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85'
    )
  })

  it('redirects /add/token-WETH to /add/token/WETH-address', () => {
    cy.visit('#/add/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85-0xc778417E063141139Fce010982780140Aa0cD5Ab')
    cy.url().should(
      'contain',
      '/add/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85/0xc778417E063141139Fce010982780140Aa0cD5Ab'
    )
  })
})
