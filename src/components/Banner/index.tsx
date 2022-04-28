import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import BANNERS, { BANNER_LINKS, BANNER_DELAY } from './banners'

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
  large: string
  medium?: string
  small?: string
}

const ImgBanner = styled.img<ImgBanner>`
  content: url(${({ large }) => large});
  border-radius: 10px;
  width: 100%;
  max-width: 970px;

  @media (max-width: 1230px) {
    content: url(${({ medium, large }) => medium || large});
  }

  @media (max-width: 440px) {
    content: url(${({ small, large }) => small || large});
  }
`

export default function Banner() {
  const [chosenBannerIndex, setChosenBannerIndex] = useState(Math.floor(Math.random() * BANNERS.length))

  useEffect(() => {
    const timer = setTimeout(() => {
      setChosenBannerIndex((index) => {
        return (index + 1) % BANNERS.length
      })
    }, BANNER_DELAY)
    return () => clearTimeout(timer)
  }, [chosenBannerIndex])

  return (
    <Link href={BANNER_LINKS[chosenBannerIndex]} rel="noopener noreferrer" target="_blank">
      <ImgBanner
        large={BANNERS[chosenBannerIndex][0]}
        medium={BANNERS[chosenBannerIndex][1]}
        small={BANNERS[chosenBannerIndex][2]}
      />
    </Link>
  )
}