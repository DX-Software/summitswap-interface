import { useWeb3React } from "@web3-react/core"
import React from "react"
import ConnectWalletSection from "../shared/ConnectWalletSection"

function AdminPanel() {
  const { account } = useWeb3React()

  if (!account) {
    return <ConnectWalletSection />
  }

  return (
    <div>This is Admin Panel</div>
  )
}

export default AdminPanel

