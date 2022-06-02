import { BigNumber } from "ethers";
import { FormikProps } from "formik";

export interface FieldProps {
  value: string;
  error: string;
}

export enum FieldNames {
  presaleRate = "presaleRate",
  isWhitelistEnabled = "isWhitelistEnabled",
  softcap = "softcap",
  hardcap = "hardcap",
  minBuyBnb = "minBuyBnb",
  maxBuyBnb = "maxBuyBnb",
  router ="router",
  liquidity = "liquidity",
  listingRate = "listingRate",
  startPresaleTime = "startPresaleTime",
  endPresaleTime = "endPresaleTime",
  liquidyLockTimeInMins = "liquidyLockTimeInMins",
  tokenAmount = "tokenAmount",
  feeType = "feeType",
  refundType = "refundType",
  owner = "owner",
  presaleToken = "presaleToken",
  totalBought = "totalBought",
  isClaimPhase = "isClaimPhase",
  isPresaleCancelled = "isPresaleCancelled",
  isWithdrawCancelledTokens = "isWithdrawCancelledTokens",
}

export const FEE_DECIMALS = 9;

export interface PresaleInfo {
  [FieldNames.owner]: string;
  [FieldNames.presaleToken]: string;
  [FieldNames.router]: string;
  [FieldNames.presaleRate]: BigNumber;
  [FieldNames.listingRate]: BigNumber;
  [FieldNames.liquidyLockTimeInMins]: BigNumber;
  [FieldNames.minBuyBnb]: BigNumber;
  [FieldNames.maxBuyBnb]: BigNumber;
  [FieldNames.softcap]: BigNumber;
  [FieldNames.hardcap]: BigNumber;
  [FieldNames.liquidity]: BigNumber;
  [FieldNames.startPresaleTime]: BigNumber;
  [FieldNames.endPresaleTime]: BigNumber;
  [FieldNames.feeType]: BigNumber;
  [FieldNames.refundType]: BigNumber;
  [FieldNames.totalBought]: BigNumber;
  [FieldNames.isWhitelistEnabled]: boolean;
  [FieldNames.isClaimPhase]: boolean;
  [FieldNames.isPresaleCancelled]: boolean;
  [FieldNames.isWithdrawCancelledTokens]: boolean;
}

export enum FieldValues {
  whitelistEnable = 'enable',
  whitelistDisable = "disable",
  refundTypeRefund = 'refund',
  refundTypeBurn = 'burn',
  feeTypeOnlyBnb = "feeTypeOnlyBnb",
  feeTypeBnbnToken = "feeTypeBnbnToken",
  RouterAddressPancakeswap = "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  RouterAddressSummitswap = "0xD7803eB47da0B1Cf569F5AFf169DA5373Ef3e41B"
}

export interface Values {
  [FieldNames.presaleRate]?: number;
  [FieldNames.isWhitelistEnabled]: string;
  [FieldNames.softcap]?: number;
  [FieldNames.hardcap]?: number;
  [FieldNames.minBuyBnb]?: number;
  [FieldNames.maxBuyBnb]?: number;
  [FieldNames.router]: string;
  [FieldNames.liquidity]?: number;
  [FieldNames.listingRate]?: number;
  [FieldNames.startPresaleTime]?: number;
  [FieldNames.endPresaleTime]?: number;
  [FieldNames.liquidyLockTimeInMins]?: number;
  [FieldNames.tokenAmount]?: number;
  [FieldNames.feeType]: string;
  [FieldNames.refundType]: string;
}


export interface ValueErrors {
  [FieldNames.tokenAmount]?: string;
  [FieldNames.presaleRate]?: string;
  [FieldNames.softcap]?: string;
  [FieldNames.hardcap]?: string;
  [FieldNames.minBuyBnb]?: string;
  [FieldNames.maxBuyBnb]?: string;
  [FieldNames.liquidity]?: string;
  [FieldNames.listingRate]?: string;
  [FieldNames.startPresaleTime]?: string;
  [FieldNames.endPresaleTime]?: string;
  [FieldNames.liquidyLockTimeInMins]?: string;
}

export enum PresalePhases {
  PresalePhase = "PRESALE PHASE",
  PresaleEnded = "PRESALE ENDED",
  PresaleNotStarted = "PRESALE NOT STARTED",
  PresaleCancelled = "PRESALE CANCELLED",
  ClaimPhase = "CLAIM PHASE",
}

export interface InputFieldProps {
  formik: FormikProps<Values>;
  name: string;
  label: string;
  type: string;
  message: string;
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