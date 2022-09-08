import { ContactMethod, WithdrawalFeeMethod } from "types/kickstarter"

export enum Statuses {
  ONGOING = 'ongoing',
  END_SOON = 'end_soon',
  COMPLETED = 'completed',
}

export enum Tabs {
  MY_PROJECT = 'my_project',
  BROWSE_PROJECT = 'browse_project',
  BACKED_PROJECT = 'backed_project',
  ADMIN_PANEL = 'admin_panel',
}

export enum AdminTabs {
  WAITING_FOR_APPROVAL = 'waiting_for_approval',
  APPROVAL_HISTORY = 'approval_history',
  PROJECT_SETTINGS = 'project_settings',
}

export type NavItem = {
  label: string
  code: Tabs | AdminTabs
  component: React.ReactNode
}

export enum ProjectFormField {
  title = 'title',
  creator = 'creator',
  image = 'image',
  imageUrl = 'imageUrl',
  contactMethod = 'contactMethod',
  contactMethodValue = 'contactMethodValue',
  projectDescription = 'projectDescription',
  rewardDescription = 'rewardDescription',
  paymentToken = 'paymentToken',
  projectGoals = 'projectGoals',
  minContribution = 'minContribution',
  endTimestamp = 'endTimestamp',
  rewardDistributionTimestamp = 'rewardDistributionTimestamp',
  withdrawalFeeMethod = 'withdrawalFeeMethod',
  withdrawalFeeAmount = 'withdrawalFeeAmount',
}

export type Project = {
  [ProjectFormField.title]: string
  [ProjectFormField.creator]: string
  [ProjectFormField.image]?: File
  [ProjectFormField.imageUrl]?: string
  [ProjectFormField.contactMethod]?: ContactMethod
  [ProjectFormField.contactMethodValue]?: string
  [ProjectFormField.projectDescription]: string
  [ProjectFormField.rewardDescription]: string
  [ProjectFormField.paymentToken]: string
  [ProjectFormField.projectGoals]: string
  [ProjectFormField.minContribution]: string
  [ProjectFormField.endTimestamp]: string
  [ProjectFormField.rewardDistributionTimestamp]: string
  [ProjectFormField.withdrawalFeeMethod]?: WithdrawalFeeMethod
  [ProjectFormField.withdrawalFeeAmount]?: string
}
