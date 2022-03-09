import React from 'react'
import { Heading } from "@koda-finance/summitswap-uikit"
import { useTranslation } from 'react-i18next'

const PoolsOverview: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Heading size="lg" mb="16px">
        {t('Your Watchlist')}
      </Heading>
    </>
  )
}

export default PoolsOverview
