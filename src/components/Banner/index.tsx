import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import BANNERS, { BANNER_LINKS, KAPEX_BANNER_DELAY, KODA_BANNER_DELAY } from './banners'

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
  height: 90px;

  @media (max-width: 967px) {
    content: url(${({ medium, large }) => medium || large});
    height: calc(100vw * 0.11642);
  }

  @media (max-width: 440px) {
    content: url(${({ small, large }) => small || large});
    height: calc(100vw * 0.2944);
  }
`

export default function Banner() {
  const [chosenBannerIndex, setChosenBannerIndex] = useState(Math.floor(Math.random() * BANNERS.length))

  const t = Date.now()

  const [banner, setBanner] = useState(
    <ImgBanner
      large={`${BANNERS[chosenBannerIndex][0]}?${t}`}
      medium={`${BANNERS[chosenBannerIndex][1]}?${t}`}
      small={`${BANNERS[chosenBannerIndex][2]}?${t}`}
    />
  )

  useEffect(() => {
    const t2 = Date.now()
    let updatedIndex
    const timer = setTimeout(
      () => {
        setChosenBannerIndex((index) => {
          updatedIndex = (index + 1) % BANNERS.length
          return updatedIndex
        })
        setBanner(
          <ImgBanner
            large={`${BANNERS[updatedIndex][0]}?${t2}`}
            medium={`${BANNERS[updatedIndex][1]}?${t2}`}
            small={`${BANNERS[updatedIndex][2]}?${t2}`}
          />
        )
      },
      chosenBannerIndex ? KODA_BANNER_DELAY : KAPEX_BANNER_DELAY
    )
    return () => clearTimeout(timer)
  }, [chosenBannerIndex])

  return (
    <Link href={BANNER_LINKS[chosenBannerIndex]} rel="noopener noreferrer" target="_blank">
      {banner}
    </Link>
  )
}
