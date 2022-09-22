import styled from 'styled-components'

const ButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 50px;
  margin-bottom: 15px;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 550px) {
    flex-direction: column-reverse;
    > button {
      width: 100%;
    }
  }
`
export default ButtonsWrapper
