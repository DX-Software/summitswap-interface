import { Text } from '@koda-finance/summitswap-uikit'
import styled from 'styled-components'
import { KickstarterProgressStatus } from 'types/kickstarter'

const StatusLabel = styled(Text)<{ status?: KickstarterProgressStatus }>`
  height: fit-content;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 20px;
  background: ${({ status, theme }) => {
    if (status === KickstarterProgressStatus.COMPLETED) return theme.colors.dropdownBackground
    if (status === KickstarterProgressStatus.ONGOING) return theme.colors.primary
    if (status === KickstarterProgressStatus.END_SOON) return theme.colors.failure
    if (status === KickstarterProgressStatus.WAITING_FOR_APPROVAL) return theme.colors.info
    if (status === KickstarterProgressStatus.REJECTED) return theme.colors.textDisabled
    return theme.colors.default
  }};
  ${({ status, theme }) => !status && `color: ${theme.colors.dropdownBackground};`}
  text-transform: uppercase;
`

export default StatusLabel
