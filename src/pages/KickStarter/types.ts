export enum STATUSES {
  ONGOING = "ongoing",
  END_SOON = "end_soon",
  COMPLETED = "completed",
}

export enum TABS {
  MY_PROJECT = "my_project",
  BROWSE_PROJECT = "browse_project",
  BACKED_PROJECT = "backed_project",
}

export type NavItem = {
  label: string
  code: TABS
  component: React.ReactNode
}

export type Project = {
  title: string;
  creator: string;
  description: string;
  goals: number;
  minimumBacking: number;
}

export type Donator = {
  name: string;
  email: string;
  walletAddress: string;
  amount: number;
}
