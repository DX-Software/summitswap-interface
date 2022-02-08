/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const fs = require('fs')

const filePath = './package.json'

const packageJson = JSON.parse(fs.readFileSync(filePath).toString())
packageJson.buildDate = new Date().getTime()

fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2))

const jsonData = {
  buildDate: packageJson.buildDate,
}

const jsonContent = JSON.stringify(jsonData)

fs.writeFile('./public/meta.json', jsonContent, 'utf8', (error) => {
  if (error) {
    console.log('An error occured while saving build date and time to meta.json')
    console.log(error)
    return
  }

  console.log('Latest build date and time updated in meta.json file')
})
