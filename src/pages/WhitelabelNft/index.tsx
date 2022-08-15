import { Field, FormikProps, FormikProvider, useFormik } from 'formik'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { convertFileToBase64 } from 'utils/convertFileToBase64'
import * as XLSX from 'xlsx'

const NftImagePreview = styled.img`
  width: 200px;
  height: auto;
`

export function getTotalNft(sheet: XLSX.WorkSheet) {
  const totalNft = XLSX.utils.sheet_to_json(sheet) as TotalNftSheet[]
  return totalNft[0].totalNft
}

export function getTraits(sheet: XLSX.WorkSheet) {
  const traits = XLSX.utils.sheet_to_json(sheet) as TraitSheet[]
  return traits
}

export function getMetadata(sheet: XLSX.WorkSheet, traits: TraitSheet[], totalNft: number) {
  const traitValues = traits.map((trait) => trait.trait_type)
  const header = ['tokenId', 'name', 'description', ...traitValues]
  const columnUpperBound = String.fromCharCode(65 + 3 + traits.length)
  const metadata = XLSX.utils.sheet_to_json(sheet, {
    header,
    range: `A2:${columnUpperBound}${totalNft + 1}`,
    defval: null,
  }) as any[]
  return metadata
}

export default function WhitelabelNft({ children }) {
  const [nftImages, setNftImages] = useState<NftImage[]>([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (evt) => {
        const bstr = evt?.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const { traits: traitsSheet, metadata: metadataSheet, totalNft: totalNftSheet } = wb.Sheets

        const totalNft = getTotalNft(totalNftSheet)
        const traits = getTraits(traitsSheet)
        const metadata = getMetadata(metadataSheet, traits, totalNft)
        // console.log(traits);
        // console.log(traits);
        console.log(metadata)
      }
      reader.readAsBinaryString(file)
    }
  }

  const handleImageOnChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const base64images = await Promise.all(files.map((file) => convertFileToBase64(file)))
      const nftImagesTemp = files.map((file, index) => {
        return {
          id: Number(file.name.split('.')[0]),
          base64: String(base64images[index]),
        }
      })
      setNftImages(nftImagesTemp)
    }
  }, [])

  const formik: FormikProps<WhitelabelFormValues> = useFormik<WhitelabelFormValues>({
    initialValues: {
      spreadsheet: undefined,
      images: [],
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setSubmitting(false)
    },
  })

  return (
    <div className="main-content">
      <FormikProvider value={formik}>
        <Field name="images" type="file" accept="image/*" multiple onChange={handleImageOnChange} />

        {nftImages.map((image) => (
          <NftImagePreview src={image.base64} key={image.id} />
        ))}
      </FormikProvider>
    </div>
  )
}
