import { Box, ButtonMenu, ButtonMenuItem, Flex } from '@koda-finance/summitswap-uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Search from 'pages/Info/components/InfoSearch'

const NavWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  justify-content: space-between;
  padding: 20px 16px;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 20px 40px;
    flex-direction: row;
  }
`

const InfoNav = () => {
  const { t } = useTranslation()
  const isPools = location.pathname === '/info/pools'
  const isTokens = location.pathname === '/info/tokens'
  let activeIndex = 0
  if (isPools) {
    activeIndex = 1
  }
  if (isTokens) {
    activeIndex = 2
  }
  return (
    <NavWrapper>
      <Box>
        <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
          <ButtonMenuItem as={Link} to="/info">
            {t('Overview')}
          </ButtonMenuItem>
          <ButtonMenuItem as={Link} to="/info/pools">
            {t('Pools')}
          </ButtonMenuItem>
          <ButtonMenuItem as={Link} to="/info/tokens">
            {t('Tokens')}
          </ButtonMenuItem>
        </ButtonMenu>
      </Box>
      <Box width={['100%', '100%', '250px']}>
        <Search />
      </Box>
    </NavWrapper>
  )
}

export default InfoNav
