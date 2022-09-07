import { CloseIcon, Flex, Text } from '@koda-finance/summitswap-uikit'
import React, { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.inputColor};
  border-radius: 16px;
  overflow: hidden;
`

const InfoImage = styled.img`
  position: relative;
  flex-shrink: 0;
  rotate: 15deg;
  left: -32px;
  width: auto;
`

function InfoSection() {
  const [hide, setHide] = useState(false)

  if (hide) {
    return null
  }

  return (
    <Wrapper marginBottom="32px">
      <InfoImage src="/images/koda-mascot.png" />
      <Flex flexDirection="column" padding={24} paddingLeft={0}>
        <Flex justifyContent="between" marginBottom="8px">
          <Text bold color="linkColor">
            What is Whitelabel NFT?
          </Text>
          <CloseIcon color="failure" marginLeft="auto" onClick={() => setHide(true)} cursor="pointer" width="24px" />
        </Flex>
        <Text fontSize="14px">
          Ac in bibendum lectus eget maecenas quis dolor, sociis dignissim. Viverra a elementum vitae elementum, porta
          gravida elit eu. Tincidunt facilisis integer urna, quam faucibus faucibus. Neque, cursus nibh vitae
          vestibulum, pharetra justo, at venenatis euismod. Massa at adipiscing egestas auctor. Ac massa nisl nibh
          egestas sed.
        </Text>
      </Flex>
    </Wrapper>
  )
}

export default React.memo(InfoSection)
