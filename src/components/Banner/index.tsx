import React from 'react'
import styled from 'styled-components'
import KapexSmallBanner from '../../img/kapex_small_v2.gif'
import KapexMediumBanner from '../../img/kapex_medium_v2.gif'
import KapexLargeBanner from '../../img/kapex_large_v2.gif'

const Link = styled.a`
  padding: 0;
  margin: auto;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  @media (max-width: 1230px) {
    width: 94%;
  }
`

const ImgBanner = styled.img`
  content:url(${KapexLargeBanner});
  border-radius: 10px;
  width: 100%;
  max-width: 970px;

  @media (max-width: 1230px) {
    content:url(${KapexMediumBanner});
  }

  @media (max-width: 968px) {
    content:url(${KapexMediumBanner});
  }

  @media (max-width: 440px) {
    content:url(${KapexSmallBanner});
  }
`

export default function Banner() {
  return (
    <Link href="https://kapex.me/" rel="noopener noreferrer" target="_blank">
      <ImgBanner />
    </Link>
  )
}