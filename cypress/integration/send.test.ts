describe('Send', () => {
  xit('should redirect', () => {
    cy.visit('/send')
    cy.url().should('include', '/swap')
  })

  xit('should redirect with url params', () => {
    cy.visit('/send?outputCurrency=ETH&recipient=bob.argent.xyz')
    cy.url().should('contain', '/swap?outputCurrency=ETH&recipient=bob.argent.xyz')
  })
})
