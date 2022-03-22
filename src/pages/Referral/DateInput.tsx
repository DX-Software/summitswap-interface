import React, { InputHTMLAttributes } from 'react'
import styled from 'styled-components'

import StyledInput from './StyledInput'

import styles from './DateInput.module.css'

const DateInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {

	const {value} = props

	const InputForDates = styled(StyledInput)`
		-webkit-appearance: none;
		&::-webkit-calendar-picker-indicator {
				filter: invert(1);
		}
	`

	return <InputForDates {...props} className={!value ? styles.dateInput : undefined}/>
}

export default DateInput