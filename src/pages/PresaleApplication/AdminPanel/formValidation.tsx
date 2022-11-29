import { checkEmail, checkUrl } from 'utils/validations'
import { differenceInDays } from 'date-fns'
import { formatUnits } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'
import { FEE_DECIMALS, CONTACT_METHOD_OPTIONS } from 'constants/presale'
import { AdminForm, AdminFormErrors } from '../types'

const validateAdminForm = (values: AdminForm) => {
  const errors: AdminFormErrors = {}

  if (!values.softcap) {
    errors.softcap = 'Required*'
  } else if (values.softcap <= 0) {
    errors.softcap = 'Softcap should be a positive number'
  } else if (values.softcap > Number(formatUnits(values.presaleInfo?.hardcap || 0, 18))) {
    errors.softcap = 'Softcap <= to hardcap'
  }

  if (!values.minBuy) {
    errors.minBuy = 'Required*'
  } else if (values.minBuy <= 0) {
    errors.minBuy = 'Min buy should be a positive number'
  } else if (values.minBuy >= (values.maxBuy || 0)) {
    errors.minBuy = 'Min buy <= Max buy'
  }

  if (!values.maxBuy) {
    errors.maxBuy = 'Required*'
  } else if (values.maxBuy <= 0) {
    errors.maxBuy = 'Max buy should be a positive number'
  } else if (values.maxBuy > Number(formatUnits(values.presaleInfo?.hardcap || 0, 18))) {
    errors.maxBuy = 'Max buy <= hardcap'
  }

  if (!values.startPresaleTime) {
    errors.startPresaleTime = 'Required*'
  } else if (values.startPresaleDate) {
    const date = new Date((values.presaleInfo?.startPresaleTime || BigNumber.from(0)).mul(1000).toNumber())
    const date2 = new Date(values.startPresaleDate)
    const diff = differenceInDays(date2, date)
    if (diff < 0) {
      errors.startPresaleDate = 'Start date >= start date set by owner'
    } else if (diff === 0) {
      if (!values.startPresaleTime) {
        errors.startPresaleTime = 'Start Presale Time is Required'
      } else {
        const [hours, mins] = values.startPresaleTime.split(':')
        const fullDate = new Date(
          Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), Number(hours), Number(mins))
        )
        if (fullDate < date) {
          errors.startPresaleTime = 'Start time >= start time set by owner'
        } else if (values.endPresaleTime && values.endPresaleDate) {
          const date3 = new Date(values.endPresaleDate)
          const [hours2, mins2] = values.endPresaleTime.split(':')

          const fullDate2 = new Date(
            Date.UTC(date3.getFullYear(), date3.getMonth(), date3.getDate(), Number(hours2), Number(mins2))
          )
          if (fullDate >= fullDate2) {
            errors.endPresaleDate = 'End time > Start time'
          }
        }
      }
    }
  }

  if (!values.liquidyLockTimeInMins) {
    errors.liquidyLockTimeInMins = 'Required*'
  } else if (values.liquidyLockTimeInMins < 5) {
    errors.liquidyLockTimeInMins = 'Liquidity Lock time >= 5mins'
  }

  if (`${values.isVestingEnabled}` === 'true') {
    if (!values.maxClaimPercentage) {
      errors.maxClaimPercentage = 'Required*'
    } else if (values.maxClaimPercentage <= 0) {
      errors.maxClaimPercentage = 'maxClaimPercentage% should be a positive number'
    } else if (values.maxClaimPercentage > 100) {
      errors.maxClaimPercentage = 'maxClaimPercentage% should be between 1% & 100%'
    } else if (!Number.isInteger(values.maxClaimPercentage)) {
      errors.maxClaimPercentage = 'maxClaimPercentage should be an Integer'
    }
  }

  if (values.feePresaleToken) {
    if (values.feePresaleToken < 0) {
      errors.feePresaleToken = 'PresaleToken fee should be a positive number'
    } else if (!Number.isInteger(values.feePresaleToken)) {
      errors.feePresaleToken = 'PresaleToken fee should be an Integer'
    } else if (
      values.presaleInfo &&
      values.feePresaleToken >=
        values.presaleInfo.liquidity
          .mul(100)
          .div(10 ** FEE_DECIMALS)
          .toNumber()
    ) {
      errors.feePresaleToken = 'PresaleToken fee should be less than liquidity%'
    }
  }

  if (values.feePaymentToken) {
    if (values.feePaymentToken < 0) {
      errors.feePaymentToken = 'PaymentToken fee should be a positive number'
    } else if (!Number.isInteger(values.feePaymentToken)) {
      errors.feePaymentToken = 'PaymentToken should be an Integer'
    } else if (
      values.presaleInfo &&
      values.feePaymentToken >=
        values.presaleInfo.liquidity
          .mul(100)
          .div(10 ** FEE_DECIMALS)
          .toNumber()
    ) {
      errors.feePaymentToken = 'PaymentToken fee should be less than liquidity%'
    }
  }

  if (!values.projectName) {
    errors.projectName = 'Required*'
  }

  if (values.twitterId && !checkUrl(values.twitterId)) {
    errors.twitterId = 'Not a valid Url'
  }

  if (!values.telegramId && values.contactMethod === CONTACT_METHOD_OPTIONS[0].value) {
    errors.telegramId = 'Required*'
  } else if (values.telegramId && !checkUrl(values.telegramId || '')) {
    errors.telegramId = 'Not a valid Url'
  }

  if (!values.discordId && values.contactMethod === CONTACT_METHOD_OPTIONS[1].value) {
    errors.discordId = 'Required*'
  } else if (values.discordId && !checkUrl(values.discordId || '')) {
    errors.discordId = 'Not a valid Url'
  }

  if (!values.email && values.contactMethod === CONTACT_METHOD_OPTIONS[2].value) {
    errors.email = 'Required*'
  } else if (values.email && !checkEmail(values.email || '')) {
    errors.email = 'Not a valid Url'
  }

  if (!values.contactName) {
    errors.contactName = 'Required*'
  }

  if (!values.contactPosition) {
    errors.contactPosition = 'Required*'
  }

  return errors
}

export default validateAdminForm
