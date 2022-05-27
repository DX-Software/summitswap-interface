import { BigNumber } from "ethers";
import { FormikProps } from "formik";

export interface PresaleInfo {
  owner: string;
  presaleToken: string;
  router: string;
  presalePrice: BigNumber;
  listingPrice: BigNumber;
  liquidityLockTime: BigNumber;
  minBuyBnb: BigNumber;
  maxBuyBnb: BigNumber;
  softcap: BigNumber;
  hardcap: BigNumber;
  liquidityPercentage: BigNumber;
  startPresaleTime: BigNumber;
  endPresaleTime: BigNumber;
  feeType: BigNumber;
  refundType: BigNumber;
  totalBought: BigNumber;
  isWhiteListPhase: boolean;
  isClaimPhase: boolean;
  isPresaleCancelled: boolean;
  isWithdrawCancelledTokens: boolean;
}
// used on presale page
export interface FieldProps {
  value: string;
  error: string;
  isLoading: boolean;
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
  refundType = "refundType"
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

export interface InputFieldProps {
  formik: FormikProps<Values>;
  name: string;
  label: string;
  type: string;
  message: string;
}
