import React, { useState, useCallback } from 'react'

const presaleAddress = '0x78d719b65CF91f387217C7A45df0c964B843eB6e'

function MessageDiv({ msg, type }: { msg: string; type: string }) {
  return <div style={{ fontSize: '10px', color: type === 'MESSAGE_FAILED' ? '#FF0000' : 'green' }}>{msg}</div>
}

export default function Presale() {
  return <div>Presale</div>
}
