import { ArrowBackIcon, Breadcrumbs, Flex, Text } from '@koda-finance/summitswap-uikit'
import React from 'react'

export type HeaderLevel = {
  label?: string
  onBack?: () => void
}

type HeaderProps = {
  levels: HeaderLevel[]
}

const Header = ({ levels }: HeaderProps) => {
  const secondLastIndex = levels.length - 2

  return (
    <>
      <Flex borderBottom="1px solid" borderBottomColor="inputColor" paddingBottom="8px" marginBottom="24px">
        <Breadcrumbs>
          {levels.map((level, index) =>
            index !== levels.length - 1 ? (
              <Text color="primaryDark" style={{ cursor: 'pointer' }} onClick={level.onBack} key={level.label}>
                {level.label}
              </Text>
            ) : (
              <Text color="borderColor" style={{ fontWeight: 700 }} key={level.label}>
                {level.label}
              </Text>
            )
          )}
        </Breadcrumbs>
      </Flex>
      <Flex style={{ columnGap: '8px', cursor: 'pointer' }} onClick={levels[secondLastIndex].onBack}>
        <ArrowBackIcon color="linkColor" />
        <Text color="linkColor" style={{ textDecoration: 'underline' }}>
          back to {levels[secondLastIndex].label}
        </Text>
      </Flex>
    </>
  )
}

export default React.memo(Header)