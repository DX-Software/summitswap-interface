import styled from 'styled-components'
import DropdownWrapper from '.'

const StyledDropdownWrapper = styled(DropdownWrapper)`
  font-size: 20px;
  width: 100%;
  & .Dropdown-control {
    padding-left: 26px;
    margin: 0;
  }
  & .Dropdown-option {
    color: #fff;
    margin-top: 10px;
    transition: 0.3s all ease-out;
    border-radius: 10px;
  }
  & .Dropdown-option:hover {
    background-color: #00d5a5;
    border-radius: 10px;
    font-weight: 700;
    color: #333;
    margin-left: 10px;
  }
  & .Dropdown-option.is-selected {
    background-color: #00d5a5;
    color: #fff !important;
    border-radius: 10px;
  }
`

export default StyledDropdownWrapper
