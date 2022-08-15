import { Box, ButtonMenu, ButtonMenuItem } from '@koda-finance/summitswap-uikit'
import { KickstarterProvider } from 'contexts/kickstarter'
import React, { useCallback, useState } from 'react'
import BackedProject from './BackedProject'
import BrowseProject from './BrowseProject'
import MyProject from './MyProject'
import { NavItem, Project, Tabs } from './types'

function KickStarter() {
  const [buttonIndex, setButtonIndex] = useState(0)
  const [isCreate, setIsCreate] = useState(false)
  const [currentCreationStep, setCurrentCreationStep] = useState(1)
  const [projectCreation, setProjectCreation] = useState<Project>({
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

  const navItems: NavItem[] = [
    {
      label: 'My Project',
      code: Tabs.MY_PROJECT,
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
      code: Tabs.BROWSE_PROJECT,
      component: <BrowseProject />,
    },
    {
      label: 'Backed Project',
      code: Tabs.BACKED_PROJECT,
      component: <BackedProject goToBrowseTab={() => setButtonIndex(1)} />,
    },
  ]

  return (
    <KickstarterProvider>
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
    </KickstarterProvider>
  )
}

export default React.memo(KickStarter)
