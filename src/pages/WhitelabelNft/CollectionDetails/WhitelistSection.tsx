import { AddIcon, Button, CloseIcon, Flex, Heading, Radio, Text, TrashIcon } from '@koda-finance/summitswap-uikit'
import { useMediaQuery } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useWhitelabelNftApiDeleteSignatures, useWhitelabelNftApiSignatures } from 'api/useWhitelabelNftApi'
import Pagination from 'components/Pagination/Pagination'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useWhitelabelNftContext } from '../contexts/whitelabel'
import { HelperText } from '../shared/Text'

const ContentWrapper = styled.div`
  max-width: 570px;
`

const WhitelistCaption = styled(Text)`
  color: ${({ theme }) => theme.colors.primaryDark};
  border-left: 4px solid ${({ theme }) => theme.colors.primaryDark};
  font-weight: 700;
  padding-left: 8px;
  margin-bottom: 8px;
`

const RemoveSelectedButton = styled(Flex)`
  cursor: pointer;
  align-items: center;
  column-gap: 4px;
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

  const maxPage = useMemo(() => {
    return Math.ceil((whitelist.data?.totalSignature || 0) / PER_PAGE)
  }, [whitelist])

  const handleRemoveWhitelist = async (whitelistAddresses: string[]) => {
    if (!whitelabelNftId || !account || whitelistAddresses.length === 0) return

    await whitelabelNftApiDeleteSignatures.mutateAsync({
      contractAddress: whitelabelNftId,
      ownerAddress: account,
      whitelistAddresses,
    })

    setSelectedWhitelistAddress((prev) => prev.filter((value) => !selectedWhitelistAddress.includes(value)))

    await whitelist.refetch()
  }

  const handleSelectAddress = (whitelistAddress: string) => {
    const isSelected = selectedWhitelistAddress.includes(whitelistAddress)
    if (isSelected) {
      setSelectedWhitelistAddress((prev) => prev.filter((value) => value !== whitelistAddress))
    } else {
      setSelectedWhitelistAddress((prev) => [...prev, whitelistAddress])
    }
  }

  return (
    <>
      <Heading color="linkColor" marginBottom={isMobileView ? '8px' : '16px'}>
        Whitelist
      </Heading>
      <Button variant="awesome" scale="sm" startIcon={<AddIcon color="default" width={14} />} marginBottom="24px">
        Add or Import Whitelist
      </Button>
      <ContentWrapper>
        <Flex justifyContent="space-between">
          <WhitelistCaption>Whitelist Participants ({whitelist.data?.totalSignature || 0})</WhitelistCaption>
          {selectedWhitelistAddress.length > 0 && (
            <RemoveSelectedButton onClick={() => handleRemoveWhitelist(selectedWhitelistAddress)}>
              <TrashIcon width={16} color="failure" />
              <Text color="failure">Remove Selected</Text>
            </RemoveSelectedButton>
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
            <HelperText fontSize="12px">
              Selected {selectedWhitelistAddress.length} address{selectedWhitelistAddress.length > 1 && 'es'}
            </HelperText>
          )}
        </WhitelistAddressWrapper>
        {maxPage > 1 && <Pagination maxPage={maxPage} page={page} onPageChange={setPage} />}
      </ContentWrapper>
    </>
  )
}

export default React.memo(WhitelistSection)
