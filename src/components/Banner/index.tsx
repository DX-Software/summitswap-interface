import styled from 'styled-components';
import KapexSmallBanner from '../../img/kapex_small.gif'
import KapexMediumBanner from '../../img/kapex_medium.gif'
import KapexLargeBanner from '../../img/kapex_large.gif'

const Banner = styled.img`
  content:url(${KapexLargeBanner});
  border-radius: 10px;
  margin-top: 20px;
  width: 100%;
  max-width: 970px;

  @media (max-width: 1230px) {
    width: 94%;
    content:url(${KapexMediumBanner});
  }

  @media (max-width: 968px) {
    content:url(${KapexMediumBanner});
  }

  @media (max-width: 440px) {
    content:url(${KapexSmallBanner});
  }
`

export default Banner;