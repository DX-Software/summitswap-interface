/* eslint-disable import/prefer-default-export */
import { NULL_ADDRESS } from 'constants/index'
import { Project, ProjectFormField } from 'pages/KickStarter/types'
import { ContactMethod } from 'types/kickstarter'

export const KICKSTARTER_FACTORY_ADDRESS = `${process.env.REACT_APP_KICKSTARTER_FACTORY_ADDRESS}`
export const PER_PAGE = 6

export const INITIAL_PROJECT_CREATION: Project = {
  [ProjectFormField.title]: '',
  [ProjectFormField.creator]: '',
  [ProjectFormField.contactMethod]: ContactMethod.DISCORD,
  [ProjectFormField.contactMethodValue]: '',
  [ProjectFormField.projectDescription]: '',
  [ProjectFormField.rewardDescription]: '',
  [ProjectFormField.paymentToken]: NULL_ADDRESS,
  [ProjectFormField.projectGoals]: '0',
  [ProjectFormField.minContribution]: '0',
  [ProjectFormField.endTimestamp]: '',
  [ProjectFormField.rewardDistributionTimestamp]: '',
}

export const CONTACT_METHODS = [
  {
    label: 'Discord',
    value: ContactMethod.DISCORD,
  },
  {
    label: 'Email',
    value: ContactMethod.EMAIL,
  },
  {
    label: 'Telegram',
    value: ContactMethod.TELEGRAM,
  },
  {
    label: 'Twitter',
    value: ContactMethod.TWITTER,
  },
]
