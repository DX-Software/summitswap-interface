export enum STATUSES {
  ONGOING = "ongoing",
  END_SOON = "end_soon",
  COMPLETED = "completed",
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
