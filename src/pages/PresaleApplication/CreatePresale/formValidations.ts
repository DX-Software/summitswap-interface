import { differenceInDays } from 'date-fns'
import checkUrl from 'utils/checkUrl'
import checkEmail from 'utils/checkEmail'
import { PresaleDetails, PresaleDetailsErrors, ProjectDetails } from '../types'

export const validatePresaleDetails = (values: PresaleDetails) => {
  const errors: PresaleDetailsErrors = {}

  if (!values.presaleRate) {
    errors.presaleRate = 'Required*'
  } else if (values.presaleRate <= 0) {
    errors.presaleRate = 'Presale Rate should be a postive Number'
  }

  if (!values.softcap) {
    errors.softcap = 'Required*'
  } else if (values.softcap <= 0) {
    errors.softcap = 'Softcap should be a positive number'
  } else if (values.hardcap && values.softcap > values.hardcap) {
    errors.softcap = 'Softcap <= Hardcap'
  } else if (values.hardcap && values.softcap < values.hardcap * 0.5) {
    errors.softcap = 'Softcap >= 50% of hardcap'
  }

  if (!values.hardcap) {
    errors.hardcap = 'Required*'
  } else if (values.hardcap <= 0) {
    errors.hardcap = 'Hardcap should be a positive number'
  }

  if (!values.minBuy) {
    errors.minBuy = 'Required*'
  } else if (values.minBuy <= 0) {
    errors.minBuy = 'Min(BNB) should be a positive number'
  } else if (values.maxBuy && values.minBuy >= values.maxBuy) {
    errors.minBuy = 'Min(BNB) <= Max(BNB)'
  }

  if (!values.maxBuy) {
    errors.maxBuy = 'Required*'
  } else if (values.maxBuy <= 0) {
    errors.maxBuy = 'Max(Bnb) should be a positive number'
  } else if (values.hardcap && values.maxBuy > values.hardcap) {
    errors.maxBuy = 'Max(Bnb) <= hardcap'
  }

  if (!values.liquidity) {
    errors.liquidity = 'Required*'
  } else if (values.liquidity <= 0) {
    errors.liquidity = 'Liquidity% should be a positive number'
  } else if (values.liquidity < 24 || values.liquidity > 100) {
    errors.liquidity = 'Liquidity% should be between 25% & 100%'
  } else if (!Number.isInteger(values.liquidity)) {
    errors.liquidity = 'Liquidity should be an Integer'
  }

  if (!values.listingRate) {
    errors.listingRate = 'Required*'
  } else if (values.listingRate <= 0) {
    errors.listingRate = 'Listing Rate should be a postive Number'
  }

  const date1 = new Date()
  const dateUtc = new Date(Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()))

  if (!values.startPresaleDate) {
    errors.startPresaleDate = 'Start Presale Date is Required'
  } else if (values.startPresaleDate) {
    const date2 = new Date(values.startPresaleDate)
    const diff = differenceInDays(date2, dateUtc)
    if (diff < 0) {
      errors.startPresaleDate = 'Start Presale date >= current date'
    } else if (diff === 0) {
      if (!values.startPresaleTime) {
        errors.startPresaleTime = 'Start Presale Time is Required'
      } else {
        const [hours, mins] = values.startPresaleTime.split(':')
        const fullDate = new Date(
          Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), Number(hours), Number(mins))
        )
        if (fullDate <= new Date()) {
          errors.startPresaleTime = 'Start Presale time > current time'
        } else if (values.endPresaleTime && values.endPresaleDate) {
          const date3 = new Date(values.endPresaleDate)
          const [hours2, mins2] = values.endPresaleTime.split(':')

          const fullDate2 = new Date(
            Date.UTC(date3.getFullYear(), date3.getMonth(), date3.getDate(), Number(hours2), Number(mins2))
          )
          if (fullDate >= fullDate2) {
            errors.startPresaleDate = 'Start time < End time'
          }
        }
      }
    }
  }

  if (!values.endPresaleDate) {
    errors.endPresaleDate = 'End Presale Date is Required'
  } else if (values.endPresaleDate) {
    const date2 = new Date(values.endPresaleDate)
    const diff = differenceInDays(date2, dateUtc)
    if (diff < 0) {
      errors.endPresaleDate = 'End Presale date >= current date'
    } else if (diff === 0) {
      if (!values.endPresaleTime) {
        errors.endPresaleTime = 'End Presale Time is Required'
      } else {
        const [hours, mins] = values.endPresaleTime.split(':')
        const fullDate = new Date(
          Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), Number(hours), Number(mins))
        )
        if (fullDate <= new Date()) {
          errors.endPresaleTime = 'End Presale time > current time'
        }
      }
    }
  }

  if (!values.liquidyLockTimeInMins) {
    errors.liquidyLockTimeInMins = 'Required*'
  } else if (values.liquidyLockTimeInMins < 5) {
    errors.liquidyLockTimeInMins = 'Liquidity Lock time >= 5mins'
  }

  if (values.hardcap && values.presaleRate && values.listingRate && values.liquidity && values.accountBalance) {
    const presaleTokenAmount = values.presaleRate * values.hardcap
    const tokensForLiquidity = (values.liquidity / 100) * values.hardcap * values.listingRate
    const tokenAmount = presaleTokenAmount + tokensForLiquidity
    if (tokenAmount > values.accountBalance) {
      errors.tokenAmount = 'Token Amounts Exceeds Balance'
    }
  }

  if (values.isVestingEnabled) {
    if (!values.maxClaimPercentage) {
      errors.maxClaimPercentage = 'Required*'
    } else if (values.maxClaimPercentage <= 0) {
      errors.maxClaimPercentage = 'maxClaimPercentage% should be a positive number'
    } else if (values.maxClaimPercentage > 100) {
      errors.maxClaimPercentage = 'maxClaimPercentage% should be between 1% & 100%'
    } else if (!Number.isInteger(values.maxClaimPercentage)) {
      errors.maxClaimPercentage = 'maxClaimPercentage should be an Integer'
    }

    if (!values.claimIntervalDay) {
      errors.claimIntervalDay = 'Required*'
    } else if (values.claimIntervalDay <= 0) {
      errors.claimIntervalDay = 'claimIntervalDay should be a positive number'
    } else if (values.claimIntervalDay > 31) {
      errors.claimIntervalDay = 'claimIntervalDay should be between 1 & 31'
    } else if (!Number.isInteger(values.claimIntervalDay)) {
      errors.claimIntervalDay = 'claimIntervalDay should be an Integer'
    }

    if (!values.claimIntervalHour) {
      errors.claimIntervalHour = 'Required*'
    } else if (values.claimIntervalHour < 0) {
      errors.claimIntervalHour = 'claimIntervalHour should be a positive number'
    } else if (values.claimIntervalHour > 23) {
      errors.claimIntervalHour = 'claimIntervalHour should be between 0 & 23'
    } else if (!Number.isInteger(values.claimIntervalHour)) {
      errors.claimIntervalHour = 'claimIntervalHour should be an Integer'
    }
  }

  return errors
}

export const validateProjectDetails = (values: ProjectDetails) => {
  const errors: ProjectDetails = {}

  if (!values.projectName) {
    errors.projectName = 'Required*'
  }

  if (values.twitterId && !checkUrl(values.twitterId)) {
    errors.twitterId = 'Not a valid Url'
  }

  if (!values.telegramId) {
    errors.telegramId = 'Required*'
  } else if (!checkUrl(values.telegramId)) {
    errors.telegramId = 'Not a valid Url'
  }

  if (!values.logoUrl) {
    errors.logoUrl = 'Required*'
  } else if (!checkUrl(values.logoUrl)) {
    errors.logoUrl = 'Not a valid Url'
  } else if (values.logoHeight && values.logoHeight !== 100 && values.logoWidth !== 100) {
    errors.logoUrl = 'Size should be 100x100'
  } else if (values.logoUrl && !values.logoHeight) {
    errors.logoUrl = 'Enter valid url logo'
  }

  if (values.discordId && !checkUrl(values.discordId)) {
    errors.discordId = 'Not a valid Url'
  }

  if (values.email && !checkEmail(values.email)) {
    errors.email = 'Not a valid Email'
  }

  if (!values.contactName) {
    errors.contactName = 'Required*'
  }

  if (!values.contactPosition) {
    errors.contactPosition = 'Required*'
  }

  return errors
}
