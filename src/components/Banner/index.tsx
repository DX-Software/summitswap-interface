import styled from 'styled-components';
import KapexSmallBanner from '../../img/kapex_small.gif'
import KapexMediumBanner from '../../img/kapex_medium.gif'
import KapexLargeBanner from '../../img/kapex_large.gif'

const Banner = styled.div`
  background: url(${KapexLargeBanner}) center/100% 100%;
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
      background: url(${KapexMediumBanner}) center/100% 100%;
    }
  }

  @media (max-width: 440px) {
    & {
      max-width: 320px;
      height: 100px;
      background: url(${KapexSmallBanner}) center/100% 100%;
    }
  }
`

export default Banner;