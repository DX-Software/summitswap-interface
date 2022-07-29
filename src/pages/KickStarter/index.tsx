import { Box, ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'
import React, { useCallback, useState } from 'react'
import BackedProject from './BackedProject'
import BrowseProject from './BrowseProject'
import MyProject from './MyProject'
import { ProjectCreation } from './types'

type navItem = {
  label: string
  code: 'my_project' | 'browse_project' | 'backed_project'
  component: React.ReactNode
}

function KickStarter() {
  const [buttonIndex, setButtonIndex] = useState(0)
  const [isCreate, setIsCreate] = useState(false)
  const [currentCreationStep, setCurrentCreationStep] = useState(1)
  const [projectCreation, setProjectCreation] = useState<ProjectCreation>({
    title: '',
    creator: '',
    description: '',
    goals: 0,
    minimumBacking: 0,
  });

  const handleOnProjectCreationChanged = useCallback((newUpdate: { [key: string]: number }) => {
    setProjectCreation({ ...projectCreation, ...newUpdate })
  }, [projectCreation]);

  const toggleCreate = () => {
    setCurrentCreationStep(1)
    setIsCreate((prevValue) => !prevValue)
  }

  const navItems: navItem[] = [
    {
      label: 'My Project',
      code: 'my_project',
      component:
        <MyProject
          isCreate={isCreate}
          toggleCreate={toggleCreate}
          currentCreationStep={currentCreationStep}
          setCurrentCreationStep={setCurrentCreationStep}
          projectCreation={projectCreation}
          handleOnProjectCreationChanged={handleOnProjectCreationChanged}
        />,
    },
    {
      label: 'Browse Project',
      code: 'browse_project',
      component: <BrowseProject />,
    },
    {
      label: 'Backed Project',
      code: 'backed_project',
      component: <BackedProject />,
    },
  ]

  return (
    <>
      <Box marginTop="30px">
        <ButtonMenu activeIndex={buttonIndex} onItemClick={(index) => setButtonIndex(index)}>
          {navItems.map((item) => (
            <ButtonMenuItem key={item.code}>{item.label}</ButtonMenuItem>
          ))}
        </ButtonMenu>
      </Box>
      <div className="main-content">
        {navItems[buttonIndex]?.component}
      </div>
    </>
  )
}

export default React.memo(KickStarter)
