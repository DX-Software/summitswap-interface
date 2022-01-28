import React from 'react'
import styled from 'styled-components'
import { Text } from '@summitswap-uikit'
import { Spinner } from '../Shared'
import { AutoColumn } from '../Column'
import { Wrapper, Section, ConfirmedIcon, ContentHeader } from './helpers'

type LoadingContentProps = {    
    onDismiss: () => void
    title: string
    subtitle: string | undefined
    description: string | undefined

}

const CustomLightSpinner = styled(Spinner) <{ size: string }>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`

const LoadingContent = ({ onDismiss, title, subtitle = "", description = "" }: LoadingContentProps) => {
  return (
    <Wrapper>
      <Section>
        <ContentHeader onDismiss={onDismiss}>{title}</ContentHeader>
        <ConfirmedIcon>
          <CustomLightSpinner src="/images/blue-loader.svg" alt="loader" size="90px" />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify="center">
          <AutoColumn gap="12px" justify="center">
            <Text fontSize="14px">
              <strong>{subtitle}</strong>
            </Text>
          </AutoColumn>
          <Text fontSize="14px">{description}</Text>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export default LoadingContent
