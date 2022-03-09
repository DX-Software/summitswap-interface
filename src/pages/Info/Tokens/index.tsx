import { Heading } from '@koda-finance/summitswap-uikit'
import { useTranslation } from 'react-i18next'
import React from 'react'

const TokensOverview: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Heading size="lg" mb="16px">
        {t('Your Watchlist')}
      </Heading>
      Watch List
    </>
  )
}

export default TokensOverview
