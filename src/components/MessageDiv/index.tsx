import styled from 'styled-components'
import { Box } from '@koda-finance/summitswap-uikit'
import { MESSAGE_ERROR } from 'constants/presale'

const MessageDiv = styled(Box)<{ type: string }>`
  height: 10px;
  font-size: 14px;
  margintop: 5px;
  marginbottom: 5px;
  font-weight: 600;
  color: ${(props) => (props.type === MESSAGE_ERROR ? '#ED4B9E' : '#31D0AA')};
`
export default MessageDiv
