import styled from 'styled-components'
import { Box } from '@koda-finance/summitswap-uikit'

const ProgressBox = styled(Box)<{ isProgressBnb?: boolean }>`
  & :first-child {
    height: 10px;
    background: #fff;
    box-shadow: 0px 0px 8.36765px rgba(255, 255, 255, 0.75);
    & :first-child {
      background: ${(props) => (props.isProgressBnb ? '#00d5a5' : '#7645d9')};
    }
  }
`
export default ProgressBox
