import React from "react"
import { Text } from "@koda-finance/summitswap-uikit"
import styled from "styled-components"
import { STATUSES } from "../types"

const StatusLabel = styled(Text)<{ status: STATUSES }>`
  height: fit-content;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 20px;
  background: ${({ status, theme }) => {
    if (status === STATUSES.COMPLETED) return theme.colors.dropdownBackground
    if (status === STATUSES.ONGOING) return theme.colors.primary
    return theme.colors.failure

  }};
  text-transform: uppercase;
`

export default StatusLabel
