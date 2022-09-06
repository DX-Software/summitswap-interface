import { AddIcon, Button, Flex, Heading } from '@koda-finance/summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useKickstarterAccountById, useKickstarterByAccountId } from 'api/useKickstarterApi'
import { PER_PAGE } from 'constants/kickstarter'
import React, { useMemo, useState } from 'react'
import EmptyMyKickstarterSection from '../BrowseProject/EmptyMyKickstarterSection'
import ConnectWalletSection from '../shared/ConnectWalletSection'
import ProjectCards from '../shared/ProjectCards'

function MyProject() {
  const { account } = useWeb3React()

  const [currentPage, setCurrentPage] = useState(1)
  const [showKickstarterId, setShowKickstarterId] = useState<string>()

  const kickstarterAccount = useKickstarterAccountById(account || '')
  const kickstarters = useKickstarterByAccountId(account || '', currentPage, PER_PAGE)

  const maxPage = useMemo(() => {
    const totalItems = kickstarterAccount?.data?.totalKickstarter?.toNumber() || 1
    return Math.ceil(totalItems / PER_PAGE)
  }, [kickstarterAccount?.data])

  if (!account) {
    return <ConnectWalletSection />
  }

  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between" marginBottom="24px">
        <Heading size="xl">My Projects</Heading>
        <Button
          scale="sm"
          startIcon={<AddIcon width="12px" color="text" />}
          style={{ fontFamily: 'Poppins' }}
          // onClick={toggleIsCreate}
          onClick={() => null}
        >
          Create New Project
        </Button>
      </Flex>

      <ProjectCards
        kickstarters={kickstarters}
        currentPage={currentPage}
        maxPage={maxPage}
        handlePageChanged={setCurrentPage}
        handleShowKickstarter={setShowKickstarterId}
        getEmptyKickstarterSection={() => <EmptyMyKickstarterSection />}
      />
    </Flex>
  )
}

export default React.memo(MyProject)
