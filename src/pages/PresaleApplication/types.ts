import { BigNumber } from "ethers";

export interface FieldProps {
  value: string;
  error: string;
}

export enum FieldNames {
  presaleRate = "presaleRate",
  router0 = 'router0',
  router1 = 'router1',
  isWhitelistEnabled = "isWhitelistEnabled",
  softcap = "softcap",
  hardcap = "hardcap",
  minBuy = "minBuy",
  maxBuy = "maxBuy",
  listingChoice ="listingChoice",
  liquidity = "liquidity",
  listingRate = "listingRate",
  startPresaleDate = "startPresaleDate",
  startPresaleTime = "startPresaleTime",
  endPresaleDate = "endPresaleDate",
  endPresaleTime = "endPresaleTime",
  liquidyLockTimeInMins = "liquidyLockTimeInMins",
  tokenAmount = "tokenAmount",
  paymentToken = "paymentToken",
  listingToken = "listingToken",
  refundType = "refundType",
  owner = "owner",
  presaleToken = "presaleToken",
  totalBought = "totalBought",
  isClaimPhase = "isClaimPhase",
  isPresaleCancelled = "isPresaleCancelled",
  isWithdrawCancelledTokens = "isWithdrawCancelledTokens",
  maxClaimPercentage = 'maxClaimPercentage',
  claimIntervalDay = 'claimIntervalDay',
  claimIntervalHour = 'claimIntervalHour',
  projectName = 'projectName',
  websiteUrl = 'websiteUrl',
  logoUrl = 'logoUrl',
  contactName = 'contactName',
  contactPosition = 'contactPosition',
  telegramId = 'telegramId',
  discordId = 'discordId',
  twitterId ='twitterId',
  email = 'email',
  description = 'description',
  isVestingEnabled = 'isVestingEnabled',
  logoHeight = 'logoHeight',
  logoWidth = 'logoWidth',
  accountBalance = 'accountBalance',
  isApproved = 'isApproved',
  feePaymentToken = 'feePaymentToken',
  feePresaleToken = 'feePresaleToken',
  emergencyWithdrawFee = 'emergencyWithdrawFee',
  presaleInfo = 'presaleInfo'
}

export interface ProjectDetails {
  [FieldNames.projectName]?: string
  [FieldNames.websiteUrl]?: string
  [FieldNames.logoUrl]?: string
  [FieldNames.contactName]?: string
  [FieldNames.contactPosition]?: string
  [FieldNames.telegramId]?: string
  [FieldNames.discordId]?: string
  [FieldNames.twitterId]?: string
  [FieldNames.email]?: string
  [FieldNames.description]?: string
  [FieldNames.logoHeight]?: number
  [FieldNames.logoWidth]?: number
}

export interface FeeInfo {
  [FieldNames.paymentToken]: string;
  [FieldNames.feePaymentToken]: BigNumber;
  [FieldNames.feePresaleToken]: BigNumber;
  [FieldNames.emergencyWithdrawFee]: BigNumber;
}


export interface PresaleInfo {
  [FieldNames.owner]: string;
  [FieldNames.router0]: string;
  [FieldNames.router1]: string;
  [FieldNames.isVestingEnabled]: boolean;
  [FieldNames.presaleToken]: string;
  [FieldNames.listingChoice]: number;
  [FieldNames.presaleRate]: BigNumber;
  [FieldNames.listingRate]: BigNumber;
  [FieldNames.liquidyLockTimeInMins]: BigNumber;
  [FieldNames.minBuy]: BigNumber;
  [FieldNames.maxBuy]: BigNumber;
  [FieldNames.softcap]: BigNumber;
  [FieldNames.hardcap]: BigNumber;
  [FieldNames.liquidity]: BigNumber;
  [FieldNames.startPresaleTime]: BigNumber;
  [FieldNames.endPresaleTime]: BigNumber;
  [FieldNames.paymentToken]: string;
  [FieldNames.listingToken]: string;
  [FieldNames.refundType]: number;
  [FieldNames.totalBought]: BigNumber;
  [FieldNames.isWhitelistEnabled]: boolean;
  [FieldNames.isClaimPhase]: boolean;
  [FieldNames.isPresaleCancelled]: boolean;
  [FieldNames.isWithdrawCancelledTokens]: boolean;
  [FieldNames.maxClaimPercentage]: BigNumber;
  [FieldNames.claimIntervalDay]: BigNumber;
  [FieldNames.claimIntervalHour]: BigNumber;
  [FieldNames.isApproved]: boolean;
}

export interface PresaleDetails {
  [FieldNames.presaleRate]?: number;
  [FieldNames.isWhitelistEnabled]: boolean;
  [FieldNames.softcap]?: number;
  [FieldNames.hardcap]?: number;
  [FieldNames.minBuy]?: number;
  [FieldNames.maxBuy]?: number;
  [FieldNames.listingChoice]: number;
  [FieldNames.liquidity]?: number;
  [FieldNames.listingRate]?: number;
  [FieldNames.startPresaleDate]?: string;
  [FieldNames.startPresaleTime]?: string;
  [FieldNames.endPresaleDate]?: string;
  [FieldNames.endPresaleTime]?: string;
  [FieldNames.liquidyLockTimeInMins]?: number;
  [FieldNames.tokenAmount]?: number;
  [FieldNames.paymentToken]: string;
  [FieldNames.listingToken]: string;
  [FieldNames.refundType]: number;
  [FieldNames.maxClaimPercentage]?: number;
  [FieldNames.claimIntervalDay]?: number;
  [FieldNames.claimIntervalHour]?: number;
  [FieldNames.isVestingEnabled]: boolean;
  [FieldNames.accountBalance]?: number;
  [FieldNames.feePaymentToken]?: number;
  [FieldNames.feePresaleToken]?: number;
  [FieldNames.emergencyWithdrawFee]?: number;
  [FieldNames.presaleInfo]?: PresaleInfo;
}

export interface PresaleDetailsErrors {
  [FieldNames.tokenAmount]?: string;
  [FieldNames.presaleRate]?: string;
  [FieldNames.softcap]?: string;
  [FieldNames.hardcap]?: string;
  [FieldNames.minBuy]?: string;
  [FieldNames.maxBuy]?: string;
  [FieldNames.liquidity]?: string;
  [FieldNames.listingRate]?: string;
  [FieldNames.startPresaleDate]?: string;
  [FieldNames.startPresaleTime]?: string;
  [FieldNames.endPresaleDate]?: string;
  [FieldNames.endPresaleTime]?: string;
  [FieldNames.liquidyLockTimeInMins]?: string;
  [FieldNames.maxClaimPercentage]?: string;
  [FieldNames.claimIntervalDay]?: string;
  [FieldNames.claimIntervalHour]?: string;
  [FieldNames.feePaymentToken]?: string;
  [FieldNames.feePresaleToken]?: string;
  [FieldNames.emergencyWithdrawFee]?: string;
}

export enum PresalePhases {
  PresalePhase = "PRESALE PHASE",
  PresaleEnded = "PRESALE ENDED",
  PresaleNotStarted = "PRESALE NOT STARTED",
  PresaleCancelled = "PRESALE CANCELLED",
  ClaimPhase = "CLAIM PHASE",
}

export enum LoadingButtonTypes {
  NotSelected,
  Withdraw,
  EmergencyWithdraw,
  Claim,
  ChangeSaleType,
  Finalize,
  CancelPool,
  WithdrawCancelledTokens,
}

export interface LoadingForButton {
  type: LoadingButtonTypes;
  error: string;
  isClicked: boolean;
}

export interface ModalProps {
  title: string
  value: FieldProps
  buttonText: string
  isLoading: boolean
  onChangeHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onDismiss: (_, reason) => void
  onSubmit: () => void
}