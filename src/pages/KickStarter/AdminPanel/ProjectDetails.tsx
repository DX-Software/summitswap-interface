import React from "react"

type Props = {
  kickstarterId: string
}

function ProjectDetails({ kickstarterId }: Props) {
  return (
    <div>Project Details: {kickstarterId}</div>
  )
}

export default ProjectDetails
