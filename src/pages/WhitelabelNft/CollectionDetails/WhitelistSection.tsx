import {
  AddIcon,
  Button,
  CloseIcon,
  Flex,
  Heading,
  Radio,
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
import styled from 'styled-components'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import RemoveAllWhitelistModal from './RemoveAllWhitelistModal'
import RemoveSelectedWhitelistModal from './RemoveSelectedWhitelistModal'
import SelectedWhitelistModal from './SelectedWhitelistModal'

const ContentWrapper = styled.div`
  max-width: 570px;
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
  column-gap: 4px;
`

const ClearSelectionButton = styled(Text)`
  cursor: pointer;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const PER_PAGE = 5

function WhitelistSection() {
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

  const handleRemoveAll = async () => {
    if (!whitelabelNftId || !account) return

    await whitelabelNftApiDeleteAllSignatures.mutateAsync({
      contractAddress: whitelabelNftId,
      ownerAddress: account,
    })

    setSelectedWhitelistAddress([])

    await whitelist.refetch()
  }

  const handleRemoveWhitelist = async (whitelistAddresses: string[]) => {
    if (!whitelabelNftId || !account || whitelistAddresses.length === 0) return

    await whitelabelNftApiDeleteSignatures.mutateAsync({
      contractAddress: whitelabelNftId,
      ownerAddress: account,
      whitelistAddresses,
    })

    setSelectedWhitelistAddress((prev) => prev.filter((value) => !selectedWhitelistAddress.includes(value)))

    await whitelist.refetch()
    setPage(1)
  }

  const handleSelectAddress = (whitelistAddress: string) => {
    const isSelected = selectedWhitelistAddress.includes(whitelistAddress)
    if (isSelected) {
      setSelectedWhitelistAddress((prev) => prev.filter((value) => value !== whitelistAddress))
    } else {
      setSelectedWhitelistAddress((prev) => [...prev, whitelistAddress])
    }
  }

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
      <Button variant="awesome" scale="sm" startIcon={<AddIcon color="default" width={14} />} marginBottom="24px">
        Add or Import Whitelist
      </Button>
      <ContentWrapper>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="8px">
          <WhitelistCaption>Whitelist Participants ({whitelist.data?.totalSignature || 0})</WhitelistCaption>
          {selectedWhitelistAddress.length === 0 && (whitelist.data?.signatures.length || 0) > 0 && (
            <RemoveSelectedButton onClick={onPresentModalDeleteAll}>
              <TrashIcon width={16} color="failure" />
              <Text color="failure">Remove All</Text>
            </RemoveSelectedButton>
          )}
          {selectedWhitelistAddress.length > 0 && (
            <ClearSelectionButton onClick={() => setSelectedWhitelistAddress([])}>
              Cancel Selection
            </ClearSelectionButton>
          )}
        </Flex>
        <WhitelistAddressWrapper>
          {whitelist.data?.signatures.map((item) => (
            <WhitelistAddressItemWrapper key={item._id}>
              <label htmlFor={item._id}>
                <Flex alignItems="center" style={{ columnGap: '16px' }}>
                  <Radio
                    id={item._id}
                    scale="sm"
                    checked={selectedWhitelistAddress.includes(item.whitelistAddress)}
                    onClick={() => handleSelectAddress(item.whitelistAddress)}
                  />
                  <WhitelistAddress>{item.whitelistAddress}</WhitelistAddress>
                </Flex>
              </label>
              <CloseIcon
                width={24}
                color="default"
                style={{ cursor: 'pointer' }}
                onClick={() => handleRemoveWhitelist([item.whitelistAddress])}
              />
            </WhitelistAddressItemWrapper>
          ))}
          {selectedWhitelistAddress.length > 0 && (
            <Flex marginTop="12px" justifyContent="flex-end" style={{ columnGap: '8px' }}>
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
            </Flex>
          )}
        </WhitelistAddressWrapper>
        {maxPage > 1 && <Pagination maxPage={maxPage} page={page} onPageChange={setPage} />}
      </ContentWrapper>
    </>
  )
}

export default React.memo(WhitelistSection)
