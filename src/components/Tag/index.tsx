import styled from 'styled-components'

const Tag = styled.span<{ saleTypeTag?: boolean }>`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  background: ${(props) => (props.saleTypeTag ? '#2BA55D' : '#7645d9')};
  border-radius: 500px;
  color: #ffffff;
  padding: 3px 6px;
  margin-right: 8px;
  @media (max-width: 480px) {
    font-size: 7px;
  }
`

export default Tag
