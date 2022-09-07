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
  projectDescription = 'projectDescription',
  rewardDescription = 'rewardDescription',
  currency = 'currency',
  goals = 'goals',
  minimumBacking = 'minimumBacking',
  projectDueDate = 'projectDueDate',
  rewardDistribution = 'rewardDistribution',
  withdrawalFeeMethod = 'withdrawalFeeMethod',
  withdrawalFeeAmount = 'withdrawalFeeAmount',
}

export type Project = {
  [ProjectFormField.title]: string
  [ProjectFormField.creator]: string
  [ProjectFormField.image]?: File
  [ProjectFormField.imageUrl]?: string
  [ProjectFormField.projectDescription]: string
  [ProjectFormField.rewardDescription]: string
  [ProjectFormField.currency]: string
  [ProjectFormField.goals]: string
  [ProjectFormField.minimumBacking]: string
  [ProjectFormField.projectDueDate]: string
  [ProjectFormField.rewardDistribution]: string
  [ProjectFormField.withdrawalFeeMethod]?: string
  [ProjectFormField.withdrawalFeeAmount]?: string
}
