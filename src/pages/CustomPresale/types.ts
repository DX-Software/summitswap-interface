import { InputHTMLAttributes } from 'react'
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
  [FieldNames.feeType]: number;
  [FieldNames.refundType]: number;
  [FieldNames.totalBought]: BigNumber;
  [FieldNames.isWhitelistEnabled]: boolean;
  [FieldNames.isClaimPhase]: boolean;
  [FieldNames.isPresaleCancelled]: boolean;
  [FieldNames.isWithdrawCancelledTokens]: boolean;
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
  [FieldNames.feeType]: number;
  [FieldNames.refundType]: number;
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

export interface InputFieldPropsFormik {
  formik: FormikProps<Values>
  message: string
  label: string
  inputAttributes: InputHTMLAttributes<HTMLInputElement>
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