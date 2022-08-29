import { Flex, Image, Text, CloseIcon } from '@koda-finance/summitswap-uikit'
import React, { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  padding: 24px;
  border-radius: 16px;
`

const InfoImage = styled(Image)`
  margin-right: 24px;
  flex-shrink: 0;
`

function InfoSection() {
  const [hide, setHide] = useState(false)

  if (hide) {
    return null
  }

  return (
    <Wrapper marginBottom="32px">
      <InfoImage src="https://picsum.photos/seed/picsum/200/300" width={210} height={137} />
      <Flex flexDirection="column">
        <Flex justifyContent="between" marginBottom="8px">
          <Text bold>What is Whitelabel NFT?</Text>
          <CloseIcon color="white" marginLeft="auto" onClick={() => setHide(true)} cursor="pointer" />
        </Flex>
        <Text fontSize="14px">
          Ac in bibendum lectus eget maecenas quis dolor, sociis dignissim. Viverra a elementum vitae elementum, porta
          gravida elit eu. Tincidunt facilisis integer urna, quam faucibus faucibus. Neque, cursus nibh vitae
          vestibulum, pharetra justo, at venenatis euismod. Massa at adipiscing egestas auctor. Ac massa nisl nibh
          egestas sed. Viverra malesuada vitae sit ut. Pharetra consequat semper imperdiet placerat dictum integer.
        </Text>
      </Flex>
    </Wrapper>
  )
}

export default React.memo(InfoSection)
