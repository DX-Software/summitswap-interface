/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Radio, Input, Progress } from '@koda-finance/summitswap-uikit'
import NavBar from './Navbar'

export default function Withdraw() {
  return (
    <div className="main-content">
      <NavBar activeIndex={3} />
    </div>
  )
}
