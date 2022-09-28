import { CloseIcon, Flex, Text } from '@koda-finance/summitswap-uikit'
import React, { useEffect, useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import { useWhitelabelNftContext } from '../contexts/whitelabel'

const Wrapper = styled(Flex)`
  position: relative;
  background-color: ${({ theme }) => theme.colors.inputColor};
  border-radius: 16px;
  overflow: hidden;
  padding: 24px;
  padding-left: 20%;
  z-index: 0;

  @media (max-width: 1200px) {
    padding: 12px 16px;
  }
`

const InfoImage = styled.img`
  position: absolute;
  top: 0px;
  left: -28px;
  z-index: -30;
  rotate: 15deg;

  @media (max-width: 1200px) {
    opacity: 0.2;
  }
`

const InfoWrapper = styled(Flex)`
  flex-direction: column;
`

const Info = styled(Text)`
  font-size: 14px;
  display: inline-block;

  @media (max-width: 576px) {
    font-size: 12px;
  }
`

function InfoSection() {
  const { hideBrowseInfoSection, setHideBrowseInfoSection } = useWhitelabelNftContext()
  const [isExpanded, setIsExpanded] = useState(false)

  const infoRaw = `Ac in bibendum lectus eget maecenas quis dolor, sociis dignissim. Viverra a elementum vitae elementum, porta
  gravida elit eu. Tincidunt facilisis integer urna, quam faucibus faucibus. Neque, cursus nibh vitae
  vestibulum, pharetra justo, at venenatis euismod. Massa at adipiscing egestas auctor. Ac massa nisl nibh
  egestas sed.`

  const infoTruncated = useMemo(() => {
    if (infoRaw.length > 160) {
      return `${infoRaw.slice(0, 161)}...`
    }
    return infoRaw
  }, [infoRaw])

  const isTruncated = useMemo(() => {
    if (isMobile && !isExpanded) {
      return true
    }
    return false
  }, [isExpanded])

  const info = useMemo(() => {
    if (isTruncated) {
      return infoTruncated
    }
    return infoRaw
  }, [isTruncated, infoTruncated, infoRaw])

  useEffect(() => {
    if (!isMobile) {
      setIsExpanded(true)
    }
  }, [])

  if (hideBrowseInfoSection) {
    return null
  }

  return (
    <Wrapper marginBottom="32px">
      <InfoImage src="/images/whitelabel-nfts/koda-mascot.png" />
      <InfoWrapper>
        <Flex justifyContent="between" marginBottom="8px">
          <Text bold color="linkColor">
            What is Whitelabel NFT?
          </Text>
          <CloseIcon
            color="failure"
            marginLeft="auto"
            onClick={() => setHideBrowseInfoSection(true)}
            cursor="pointer"
            width="24px"
          />
        </Flex>
        <Info>
          {info}
          {isTruncated && (
            <Info color="linkColor" onClick={() => setIsExpanded(true)}>
              read more
            </Info>
          )}
        </Info>
      </InfoWrapper>
    </Wrapper>
  )
}

export default React.memo(InfoSection)
