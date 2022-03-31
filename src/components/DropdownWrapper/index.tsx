import React from 'react';
import Dropdown, { ReactDropdownProps } from 'react-dropdown';
import 'react-dropdown/style.css';
import './styles.css'

const DropdownWrapper: React.FC<ReactDropdownProps> = (props) => <Dropdown {...props}/>

export default DropdownWrapper