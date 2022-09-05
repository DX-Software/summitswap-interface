export enum Statuses {
  ONGOING = "ongoing",
  END_SOON = "end_soon",
  COMPLETED = "completed",
}

export enum Tabs {
  MY_PROJECT = "my_project",
  BROWSE_PROJECT = "browse_project",
  BACKED_PROJECT = "backed_project",
  ADMIN_PANEL = "admin_panel",
}

export enum AdminTabs {
  WAITING_FOR_APPROVAL = "waiting_for_approval",
  APPROVAL_HISTORY = "approval_history",
  PROJECT_SETTINGS = "project_settings",
}

export type NavItem = {
  label: string
  code: Tabs | AdminTabs
  component: React.ReactNode
}

export type Project = {
  title: string;
  creator: string;
  image?: File;
  imageUrl?: string;
  projectDescription: string;
  rewardDescription: string;
  goals: string;
  minimumBacking: string;
  projectDueDate: string;
  rewardDistribution: string;
}
