import { Phase, SUPPORTED_IMAGE_FORMAT } from 'constants/whitelabel'
import * as yup from 'yup'

const name = yup.string().trim().required()
const symbol = yup.string().trim().required()
const previewImage = yup
  .mixed()
  .test('fileType', 'Unsupported file format', (value) => value && SUPPORTED_IMAGE_FORMAT.includes(value.type))
const concealImage = yup
  .mixed()
  .test('fileType', 'Unsupported file format', (value) => value && SUPPORTED_IMAGE_FORMAT.includes(value.type))
const whitelistMintPrice = yup.number().min(0).required()
const publicMintPrice = yup.number().moreThan(0).required()
const phase = yup.mixed().oneOf(Object.values(Phase))
const nftImages = yup.array().required().min(1)
const spreadsheet = yup.mixed().required()

const validationSchema = yup.object().shape({
  name,
  symbol,
  previewImage,
  concealImage,
  whitelistMintPrice,
  publicMintPrice,
  phase,
  nftImages,
  spreadsheet,
})

export default validationSchema
