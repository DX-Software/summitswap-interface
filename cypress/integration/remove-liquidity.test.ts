describe('Remove Liquidity', () => {
  it('redirects', () => {
    cy.visit('/remove/0xc778417E063141139Fce010982780140Aa0cD5Ab-0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85')
    cy.url().should(
      'contain',
      '/remove/0xc778417E063141139Fce010982780140Aa0cD5Ab/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85'
    )
  })

  it('bnb remove', () => {
    cy.visit('/remove/ETH/0x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'BNB')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'KODA')
  })

  it('bnb remove swap order', () => {
    cy.visit('/remove/0x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5/ETH')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'KODA')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'BNB')
  })

  it('loads the two correct tokens', () => {
    cy.visit('/remove/0x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5-0xe9e7cea3dedca5984780bafc599bd69add087d56')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'KODA')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'BUSD')
  })

  it('does not crash if KODA is duplicated', () => {
    cy.visit('/remove/0x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5-0x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'KODA')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'KODA')
  })

  it('token not in storage is loaded', () => {
    cy.visit('/remove/0x7083609fce4d1d8dc0c979aab8c869ea2c873402-0x2170ed0880ac9a755fd29b2688956bd959f933f8')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'DOT')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'ETH')
  })
})
