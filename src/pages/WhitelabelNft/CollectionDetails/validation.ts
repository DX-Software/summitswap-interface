import { isAddress } from 'ethers/lib/utils'
import * as yup from 'yup'

// eslint-disable-next-line import/prefer-default-export
export const whitelistValidationSchema = yup.object().shape({
  whitelistAddresses: yup
    .array()
    .min(1)
    .transform((values, originalValue: string) => {
      return originalValue
        .split('\n')
        .filter((v: any) => v)
        .map((v) => v.trim())
    })
    .test('isAddress', 'Invalid addresses', (addresses) => {
      if (!addresses) return false
      return addresses?.every((address) => isAddress(address)) || false
    })
    .required(),
})
