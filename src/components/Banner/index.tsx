import React from 'react'
import styled from 'styled-components'
import BANNERS from './banners'

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

interface ImgBanner { 
  // Might be provided only one type of size.
  large: string,
  medium?: string,
  small?: string,
}

const ImgBanner = styled.img<ImgBanner>`
  content:url(${({ large }) => large});
  border-radius: 10px;
  width: 100%;
  max-width: 970px;

  @media (max-width: 1230px) {
    content:url(${({ medium, large }) => medium || large});
  }

  @media (max-width: 440px) {
    content:url(${({ small, large }) => small || large});
  }
`

export default function Banner() {
  const chosenBanner = BANNERS[Math.floor(Math.random() * BANNERS.length)]

  return (
    <Link href="https://kapex.me/" rel="noopener noreferrer" target="_blank">
      <ImgBanner 
        large={chosenBanner[0]} 
        medium={chosenBanner[1]} 
        small={chosenBanner[2]} 
      />
    </Link>
  )
}