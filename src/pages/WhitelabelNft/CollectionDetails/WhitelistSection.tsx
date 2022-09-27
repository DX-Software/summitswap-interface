import {
  AddIcon,
  Button,
  CloseIcon,
  Flex,
  Heading,
  Radio,
  Skeleton,
  Text,
  TrashIcon,
  useModal,
} from '@koda-finance/summitswap-uikit'
import { useMediaQuery } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import {
  useWhitelabelNftApiDeleteAllSignatures,
  useWhitelabelNftApiDeleteSignatures,
  useWhitelabelNftApiSignatures,
} from 'api/useWhitelabelNftApi'
import Pagination from 'components/Pagination/Pagination'
import React, { useMemo, useState } from 'react'
import { UseQueryResult } from 'react-query'
import styled from 'styled-components'
import { WhitelabelSignatureResult } from 'types/whitelabelNft'
import { shortenAddress } from 'utils'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import { HelperText } from '../shared/Text'
import AddWhitelistModal from './AddWhitelistModal'
import RemoveAllWhitelistModal from './RemoveAllWhitelistModal'
import RemoveSelectedWhitelistModal from './RemoveSelectedWhitelistModal'
import SelectedWhitelistModal from './SelectedWhitelistModal'

const ContentWrapper = styled.div`
  max-width: 570px;
`

const WhitelistHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    row-gap: 16px;
  }
`

const WhitelistCaption = styled(Text)`
  color: ${({ theme }) => theme.colors.primaryDark};
  border-left: 4px solid ${({ theme }) => theme.colors.primaryDark};
  font-weight: 700;
  padding-left: 8px;
`

const RemoveSelectedButton = styled(Flex)`
  cursor: pointer;
  align-items: center;
  align-self: flex-end;
  column-gap: 4px;
`

const ClearSelectionButton = styled(Text)`
  cursor: pointer;
  align-self: flex-end;
`

const WhitelistAddressWrapper = styled(Flex)`
  flex-direction: column;
  row-gap: 8px;
  margin-bottom: 24px;
`

const WhitelistAddressItemWrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.inputColor};
  padding: 12px;
  justify-content: space-between;
  align-items: center;
`

const WhitelistAddress = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const ActionWrapper = styled(Flex)`
  margin-top: 12px;
  justify-content: flex-end;
  column-gap: 8px;

  @media (max-width: 576px) {
    flex-direction: column;
    row-gap: 8px;
  }
`

const PER_PAGE = 5

function WhitelistLoadingSection() {
  const skeletons = Array.from(Array(PER_PAGE).keys())

  return (
    <>
      {skeletons.map((skeleton) => (
        <Skeleton width="100%" height={48} key={skeleton} />
      ))}
    </>
  )
}

type WhitelistSectionProps = {
  whitelabelNftApiSignature: UseQueryResult<WhitelabelSignatureResult | undefined>
}

function WhitelistSection({ whitelabelNftApiSignature }: WhitelistSectionProps) {
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const { account } = useWeb3React()
  const { whitelabelNftId } = useWhitelabelNftContext()
  const [page, setPage] = useState(1)
  const [selectedWhitelistAddress, setSelectedWhitelistAddress] = useState<string[]>([])

  const whitelist = useWhitelabelNftApiSignatures(account || '', whitelabelNftId, page, PER_PAGE)
  const whitelabelNftApiDeleteSignatures = useWhitelabelNftApiDeleteSignatures()
  const whitelabelNftApiDeleteAllSignatures = useWhitelabelNftApiDeleteAllSignatures()

  const maxPage = useMemo(() => {
    return Math.ceil((whitelist.data?.totalSignature || 0) / PER_PAGE)
  }, [whitelist])

  const handleRefreshData = () => {
    whitelist.refetch()
    whitelabelNftApiSignature.refetch()
    setPage(1)
  }

  const handleRemoveAll = async () => {
    if (!whitelabelNftId || !account) return

    await whitelabelNftApiDeleteAllSignatures.mutateAsync({
      contractAddress: whitelabelNftId,
      ownerAddress: account,
    })

    setSelectedWhitelistAddress([])
    handleRefreshData()
  }

  const handleRemoveWhitelist = async (whitelistAddresses: string[]) => {
    if (!whitelabelNftId || !account || whitelistAddresses.length === 0) return

    await whitelabelNftApiDeleteSignatures.mutateAsync({
      contractAddress: whitelabelNftId,
      ownerAddress: account,
      whitelistAddresses,
    })

    setSelectedWhitelistAddress((prev) => prev.filter((value) => !selectedWhitelistAddress.includes(value)))
    handleRefreshData()
  }

  const handleSelectAddress = (whitelistAddress: string) => {
    const isSelected = selectedWhitelistAddress.includes(whitelistAddress)
    if (isSelected) {
      setSelectedWhitelistAddress((prev) => prev.filter((value) => value !== whitelistAddress))
    } else {
      setSelectedWhitelistAddress((prev) => [...prev, whitelistAddress])
    }
  }

  const [onPresentModalAddWhitelist] = useModal(
    <AddWhitelistModal whitelabelNftId={whitelabelNftId} onRefresh={handleRefreshData} />
  )
  const [onPresentModalDeleteAll] = useModal(<RemoveAllWhitelistModal onDelete={handleRemoveAll} />)
  const [onPresentModalDeleteSelected] = useModal(
    <RemoveSelectedWhitelistModal
      selectedCount={selectedWhitelistAddress.length}
      onDelete={() => handleRemoveWhitelist(selectedWhitelistAddress)}
    />
  )
  const [onPresentModalSelected] = useModal(
    <SelectedWhitelistModal
      selectedAddress={selectedWhitelistAddress}
      onDelete={() => handleRemoveWhitelist(selectedWhitelistAddress)}
    />
  )

  return (
    <>
      <Heading color="linkColor" marginBottom={isMobileView ? '8px' : '16px'}>
        Whitelist
      </Heading>
      <Button
        variant="awesome"
        scale="sm"
        startIcon={<AddIcon color="default" width={14} />}
        marginBottom="24px"
        onClick={onPresentModalAddWhitelist}
      >
        Add Whitelist
      </Button>
      <ContentWrapper>
        <WhitelistHeader>
          <WhitelistCaption>Whitelist Participants ({whitelist.data?.totalSignature || 0})</WhitelistCaption>
          {selectedWhitelistAddress.length === 0 && (whitelist.data?.signatures.length || 0) > 0 && (
            <RemoveSelectedButton onClick={onPresentModalDeleteAll}>
              <TrashIcon width={16} color="failure" />
              <Text color="failure" fontSize={isMobileView ? '14px' : '16px'}>
                Remove All
              </Text>
            </RemoveSelectedButton>
          )}
          {selectedWhitelistAddress.length > 0 && (
            <ClearSelectionButton onClick={() => setSelectedWhitelistAddress([])}>
              Cancel Selection
            </ClearSelectionButton>
          )}
        </WhitelistHeader>
        <WhitelistAddressWrapper>
          {whitelist.isLoading ? (
            <WhitelistLoadingSection />
          ) : whitelist.isFetched && whitelist.data?.signatures.length === 0 ? (
            <HelperText>You haven’t added any whitelist participants</HelperText>
          ) : (
            whitelist.data?.signatures.map((item) => (
              <WhitelistAddressItemWrapper key={item._id}>
                <label htmlFor={item._id}>
                  <Flex alignItems="center" style={{ columnGap: '16px' }}>
                    <Radio
                      id={item._id}
                      scale="sm"
                      onChange={() => null}
                      checked={selectedWhitelistAddress.includes(item.whitelistAddress)}
                      onClick={() => handleSelectAddress(item.whitelistAddress)}
                    />
                    <WhitelistAddress>
                      {isMobileView ? shortenAddress(item.whitelistAddress, 8) : item.whitelistAddress}
                    </WhitelistAddress>
                  </Flex>
                </label>
                <CloseIcon
                  width={24}
                  color="default"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRemoveWhitelist([item.whitelistAddress])}
                />
              </WhitelistAddressItemWrapper>
            ))
          )}
          {selectedWhitelistAddress.length > 0 && (
            <ActionWrapper>
              <Button scale="sm" variant="tertiary" onClick={onPresentModalSelected}>
                View Selected ({selectedWhitelistAddress.length})
              </Button>
              <Button
                scale="sm"
                variant="danger"
                startIcon={<TrashIcon width={16} color="default" />}
                onClick={onPresentModalDeleteSelected}
              >
                Remove ({selectedWhitelistAddress.length})
              </Button>
            </ActionWrapper>
          )}
        </WhitelistAddressWrapper>
        {maxPage > 1 && <Pagination maxPage={maxPage} page={page} onPageChange={setPage} />}
      </ContentWrapper>
    </>
  )
}

export default React.memo(WhitelistSection)
