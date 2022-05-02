import React, { useState, useEffect } from 'react'
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
  const banners = Object.keys(BANNERS)
  const t = Date.now()

  const [chosenBanner, setChosenBanner] = useState(banners[Math.floor(Math.random() * banners.length)])
  const [banner, setBanner] = useState(
    <ImgBanner
      large={`${BANNERS[chosenBanner].gifs[0]}?${t}`}
      medium={`${BANNERS[chosenBanner].gifs[1]}?${t}`}
      small={`${BANNERS[chosenBanner].gifs[2]}?${t}`}
    />
  )

  useEffect(() => {
    const t2 = Date.now()
    let updatedBanner;
    const timer = setTimeout(
      () => {
        setChosenBanner((bn) => {
          updatedBanner = banners[(banners.indexOf(bn) + 1) % banners.length]
          return updatedBanner
        })
        setBanner(
          <ImgBanner
            large={`${BANNERS[updatedBanner].gifs[0]}?${t2}`}
            medium={`${BANNERS[updatedBanner].gifs[1]}?${t2}`}
            small={`${BANNERS[updatedBanner].gifs[2]}?${t2}`}
          />
        )
      },
      chosenBanner === 'koda' ? BANNERS.koda.delay : BANNERS.kapex.delay
    )
    return () => clearTimeout(timer)
  }, [chosenBanner, banners])

  return (
    <Link href={BANNERS[chosenBanner].link} rel="noopener noreferrer" target="_blank">
      {banner}
    </Link>
  )
}
