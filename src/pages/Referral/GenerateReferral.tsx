import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Box, Button, Checkbox, useModal } from '@summitswap-uikit'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import * as CryptoJS from 'crypto-js'
import EarnModal from 'components/EarnModal/EarnModal'

declare let window: any

interface Props {
    setHashValue: any
}

const GenerateReferral: React.FC<Props> = ({ setHashValue }) => {
    const [onPresentEarnModal] = useModal(<EarnModal />)

    const [note, setNote] = useState('')
    const [percent, setPercent] = useState('')
    const [defaultInvitation, setDefaultInvitation] = useState(false)
    const { account } = useWeb3React()
    const handleCreateLink = async () => {
        if (account) {
            await window.ethereum.enable()
            const web3 = new Web3(process.env.REACT_APP_NETWORK_URL ?? '')
            const msg = {
                action: 'create-referral-link',
                address: account,
                note,
                percent: parseInt(percent),
                setDefault: defaultInvitation ? 'true' : 'false'
            }
            const privateKey = 'b1b0dc7b10cb9f891976c2475b001317ff59a105780e950c4920f9d83130b689'

            const param = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(msg)))
            alert(param)
            const sign = await web3.eth.accounts.sign(param ?? '', privateKey)
            window.localStorage.setItem('refAddress', param)
            // console.log('decrypt', CryptoJS.AES.decrypt(param, key).toString(CryptoJS.enc.Utf8))
            setHashValue(param)
        }
    }
    return (
        <StyledContainer>
            <InputPanel>
                <input type='text' placeholder='% you get' value={percent} onChange={(e) => setPercent(e.target.value)} />
            </InputPanel>
            <InputPanel mt={2}>
                <input type='text' placeholder='Note' value={note} onChange={(e) => setNote(e.target.value)} />
            </InputPanel>
            <Flex justifyContent='flex-end' alignItems='center' mt={2}>
                <Checkbox scale='sm' checked={defaultInvitation} onClick={() => setDefaultInvitation(!defaultInvitation)} />
                <Box ml={1}>Set as default invitation</Box>
            </Flex>
            <Flex justifyContent='flex-end' mt={2}>
                <Button style={{ fontFamily: 'Poppins' }} onClick={handleCreateLink}>
                    New link
                </Button>
                <Button style={{ fontFamily: 'Poppins' }} onClick={onPresentEarnModal}>
                    Settings
                </Button>
            </Flex>
        </StyledContainer>
    )
}

const InputPanel = styled(Box)`
    padding: 16px;
    border-radius: 16px;
    background: ${({ theme }) => theme.colors.sidebarBackground};
    >input {
        border: none;
        outline: none;
        background: transparent;
        color: white;
        width: 100%;
        &::placeholder {
            color: white;
        }
    }
`

const StyledContainer = styled(Box)`
    >div:last-of-type {
        grid-column-gap: 16px;
    }
`

export default GenerateReferral