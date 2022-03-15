import styled from 'styled-components';

const Banner = styled.div`
  background-color: gray;
  border-radius: 10px;
  margin-top: 20px;   
  width: 970px;
  height: 90px;

  @media (max-width: 1230px) {
    & {
      width: 94%;
    }
  }

  @media (max-width: 968px) {
    & {
      max-width: 780px;
    }
  }

  @media (max-width: 440px) {
    & {
      max-width: 320px;
      height: 100px
    }
  }
`

export default Banner;