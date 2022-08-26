export enum Statuses {
  ONGOING = "ongoing",
  END_SOON = "end_soon",
  COMPLETED = "completed",
}

export enum Tabs {
  MY_PROJECT = "my_project",
  BROWSE_PROJECT = "browse_project",
  BACKED_PROJECT = "backed_project",
}

export type NavItem = {
  label: string
  code: Tabs
  component: React.ReactNode
}

export type Project = {
  title: string;
  creator: string;
  description: string;
  goals: string;
  minimumBacking: string;
}

export type Donator = {
  name: string;
  email: string;
  walletAddress: string;
  amount: number;
}
