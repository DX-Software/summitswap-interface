import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  REACT_APP_TELEGRAM_API_HASH,
  REACT_APP_TELEGRAM_API_ID,
  REACT_APP_TELEGRAM_STRING_SESSION,
  REACT_APP_TELEGRAM_SUPPORT_MEMBERS
} from 'constants/telegram'
import ChatIcon from '../../img/chat.svg'
import CloseIcon from '../../img/close.svg'
import ProfileImage from '../../img/pp.png'
import TelegramIcon from '../../img/telegram-logo.svg'
import MessengerIcon from '../../img/messenger-logo.svg'
import DiscordIcon from '../../img/discord-logo.svg'
import SpinnerIcon from '../../img/spinner.svg'

const ChatButton = styled.div`
  z-index: 10;
	user-select: none;
	position: fixed;
	right: 0;
	bottom: 0;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background: white url(${ChatIcon}) center/50% no-repeat;
	margin: 30px;
	cursor: pointer;
	box-shadow: 0 0 10px;
  transition: background-color 0.3s ease-in;

  &:hover {
    background-color: rgb(0, 212, 164);
    transition: background-color 0.3s ease-in;
  }

  @media (max-width: 320px) {
    & {
      transform: scale(0.85);
      margin: 15px;
    }
  }
`

const ChatBox = styled.div`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  z-index: 10;
  font-size: 14px;
  position: fixed;
  width: 340px;
  height: 340px;
  bottom: 80px;
  right: 0;
  border-radius: 3%;
  padding: 20px;
  background-color: white;
  margin: 20px;
  cursor: default;
  box-shadow: 0 0 10px;
  animation: fadeIn 0.3s ease-in-out;

  @media (max-width: 415px) {
    & {
      width: 90%;
    }
  }

  @media (max-width: 260px) {
    & {
      width: 88%;
    }
  }
`

const CloseButton = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  margin: 5px;
  width: 20px;
  height: 20px;
  background: url(${CloseIcon}) center/80% no-repeat;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 0.2s ease-in;

  &:hover {
    opacity: 1;
    transition: opacity 0.2s ease-in;
  }
`

const Info = styled.div`
  display: flex;
  align-items: center;
  line-height: 2;
  border-bottom: #ddd solid 1px;
`

const ProfilePhoto = styled.div`
  margin: 5px;
  width: 56px;
  height: 56px;
  border: rgb(0, 212, 164) solid 3px;
  border-radius: 50%;
  background: black url(${ProfileImage}) center/80% no-repeat;

  @media (max-width: 320px) {
    & {
      display: none;
    }
  }
`

const LittleProfilePhoto = styled.div`
  margin: 5px;
  width: 36px;
	height: 36px;
  border: rgb(0, 212, 164) solid 3px;
  border-radius: 50%;
  background: black url(${ProfileImage}) center/80% no-repeat;
`

const Description = styled.div`
  & h4, & p {
    color: black;
    text-indent: 10px;
  }

  @media (max-width: 260px) {
    & {
      text-indent: 0;
      line-height: 1.2;
    }
  }
`

const MessageContainer = styled.div`
  padding-bottom: 10px;
  border-bottom: #ddd solid 1px;
`

const Time = styled.h5`
  font-size: 12px;
  margin: 12px 0;
  text-align: center;
`

const Message = styled.div`
  display: flex;
`

const MessageContent = styled.div`
  width: 170px;
	display: flex;
	flex-direction: column;
	background-color: #ddd;
	line-height: 10px;
	text-indent: 10px;
	border-radius: 0 10px 10px 10px;
	margin-top: 5px;

  & p {
    font-size: 14px;
    margin: 5px 0;
    color: black;
  }
`

const Buttons = styled.div`
  text-align: center;
  margin-top: 30px;

  & h4 {
    margin-bottom: 30px;
  }

  & a {
    cursor: pointer;
    text-decoration: none;
    border-radius: 5px;
    padding: 10px 45px;
    margin: 0 5px;
    transition: all 0.2s;
  }

  & a:hover {
    transition: all 0.2s;
  }

  @media (max-width: 415px) {
    & a {
      padding: 10px 40px;
    }
  }

  @media (max-width: 320px) {
    & a {
      padding: 10px 30px;
    }
  }

  @media (max-width: 260px) {
    & a {
      padding: 10px 24px;
    }
  }
`

const Spinner = styled.a`
  background: #0088cc url(${SpinnerIcon}) center/50% no-repeat;

  &:hover {
    background-color: #0088cce0;
  }
`

const TelegramButton = styled.a`
  background: #0088cc url(${TelegramIcon}) center/30% no-repeat;

  &:hover {
    background-color: #0088cce0;
  }
`

const MessengerButton = styled.a`
  background: #0084ff url(${MessengerIcon}) center/30% no-repeat;

  &:hover {
    background-color: #0084ffe0;
  }
`

const DiscordButton = styled.a`
  background: #5865f2 url(${DiscordIcon}) center/30% no-repeat;

  &:hover {
    background-color: #5865f2e0;
  }
`

const SupportChatWidget = () => {
  const [showDate, setShowDate] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [showChatBox, setShowChatBox] = useState('none')

  function closeButtonClickHandler() {
    setShowChatBox("none")
    setIsOpened(false)
  }

  function chatButtonClickHandler() {
    if (showDate === false) {
      const today = new Date()
      const time = today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      setCurrentTime(time)
      setShowDate(true)
    }

    if (isOpened === false) {
      setShowChatBox("block")
      setIsOpened(true)
    } else {
      closeButtonClickHandler()
    }
  }

  const [isTgClicked, setIsTgClicked] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  const { TelegramClient, Api } = window.telegram
  const { StringSession } = window.telegram.sessions

  const apiId = Number(REACT_APP_TELEGRAM_API_ID)
  const apiHash = REACT_APP_TELEGRAM_API_HASH
  const stringSession = new StringSession(REACT_APP_TELEGRAM_STRING_SESSION)

  const [directionLink, setDirectionLink] = useState('')

  useEffect(() => {
    if (directionLink) {
      window.open(directionLink, '_blank')
    }
  }, [directionLink])

  const init = async () => {
    setIsTgClicked(true)

    if (!isTgClicked) {
      setShowLoader(true)

      try {
        const client = new TelegramClient(stringSession, apiId, apiHash, {useWSS: true})

        const validDC = await client.getDC(client.session.dcId) 

        client.session.setDC(validDC.id, validDC.ipAddress, validDC.port)

        await client.connect()

        const result = await client.invoke(
          new Api.messages.CreateChat({
            users: REACT_APP_TELEGRAM_SUPPORT_MEMBERS,
            title: "SummitSwap Support",
          })
        )

        const result2 = await client.invoke(
          new Api.messages.ExportChatInvite({
            peer: result.chats[0],
            legacyRevokePermanent: true,
          })
        )

        setDirectionLink(result2.link)
        setShowLoader(false)

        } catch(err) {
          // eslint-disable-next-line no-console
          console.log(err)
        }
      } else if (directionLink) {
          window.open(directionLink, '_blank')
      }
    }

    return (
      <div>
        <ChatButton onClick={chatButtonClickHandler}/>
        <ChatBox style={{display: `${showChatBox}`}}>
          <CloseButton onClick={closeButtonClickHandler}/>
          <Info>
            <ProfilePhoto/>
            <Description>
              <h4>SummitSwap Support</h4>
              <p>7/24 help</p>
            </Description>
          </Info>
          <MessageContainer>
            <Time>{currentTime}</Time>
            <Message>
              <LittleProfilePhoto/>
              <MessageContent>
                <p>Hi there 👋</p>
                <p>How can I help you?</p>
              </MessageContent>
            </Message>
          </MessageContainer>
          <Buttons>
            <h4>Start Chat with:</h4>
            {showLoader ? <Spinner/> : <TelegramButton onClick={init}/>}
            <MessengerButton target="_blank" rel="nofollow" href="https://m.me/103580315623378"/>
            <DiscordButton target="_blank" rel="nofollow" href="https://discord.gg/wEwrCyxte7"/>
          </Buttons>
        </ChatBox>
      </div>
    )
}

export default SupportChatWidget