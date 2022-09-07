import { Flex, Heading } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useBackedKickstartersByContributionId } from 'api/useKickstarterApi'
import { PER_PAGE } from 'constants/kickstarter'
import { useKickstarterContext } from 'pages/KickStarter/contexts/kickstarter'
import React, { useMemo, useState } from 'react'
import KickstarterDetails from '../KickstarterDetails'
import ProjectDetails from '../ProjectDetails'
import ConnectWalletSection from '../shared/ConnectWalletSection'
import ProjectCards from '../shared/ProjectCards'
import EmptyBackedKickstarter from './EmptyBackedKickstarter'

type Props = {
  goToBrowseTab: () => void
}

function BackedProject({ goToBrowseTab }: Props) {
  const { kickstarterAccount } = useKickstarterContext()

  const { account } = useWeb3React()

  const [currentPage, setCurrentPage] = useState(1)
  const [showKickstarterId, setShowKickstarterId] = useState<string>("")
  const backedKickstarters = useBackedKickstartersByContributionId(account || "", currentPage)

  const maxPage = useMemo(() => {
    const totalItems = kickstarterAccount?.totalBackedKickstarter.toNumber() || 1;
    return Math.ceil(totalItems / PER_PAGE)
  }, [kickstarterAccount?.totalBackedKickstarter])

  if (!account) {
    return <ConnectWalletSection />
  }

  if (showKickstarterId) {
    return (
      <KickstarterDetails
        previousPage="Backed Project"
        kickstarterId={showKickstarterId}
        handleKickstarterId={setShowKickstarterId}
      />
    )
  }

  return (
    <Flex flexDirection="column">
      <Heading size="xl" marginBottom="24px">Backed Projects</Heading>
      <ProjectCards
        kickstarters={backedKickstarters}
        currentPage={currentPage}
        maxPage={maxPage}
        handlePageChanged={setCurrentPage}
        handleShowKickstarter={setShowKickstarterId}
        getEmptyKickstarterSection={() => <EmptyBackedKickstarter />}
      />
    </Flex>
  )
}

export default BackedProject;
