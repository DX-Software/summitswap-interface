import React from "react"
import { ProjectCreation } from "./types"

type Props = {
  setCurrentCreationStep: (step: number) => void
  projectCreation: ProjectCreation
  handleOnProjectCreationChanged: (newUpdate: { [key: string]: number }) => void
}

function CreationStep02({setCurrentCreationStep, projectCreation, handleOnProjectCreationChanged}: Props) {
  return (
    <div>123</div>
  )
}

export default CreationStep02
