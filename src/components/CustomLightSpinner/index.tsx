import styled from 'styled-components';
import { Spinner } from '../Shared'

const CustomLightSpinner = styled(Spinner) <{ size: string }>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  display: flex;
  margin: auto;
`

export default CustomLightSpinner