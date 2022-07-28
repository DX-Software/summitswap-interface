import InfoNav from 'components/InfoNav'
import React from 'react'
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters'

const InfoPageLayout: React.FC = ({ children }) => {
  return (
    <div className="main-content">
      <ProtocolUpdater />
      <PoolUpdater />
      <TokenUpdater />
      <InfoNav />
      {children}
    </div>
  )
}

export default InfoPageLayout
