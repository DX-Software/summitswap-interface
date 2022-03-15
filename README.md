# Summitswap Interface
This project contains the interface of the [summitswap](https://summitswap.finance/) application.

# Setup local app
1. Make sure you are connected to `github` on terminal using Personal access tokens
2. Install [node lts](https://tecadmin.net/install-nvm-macos-with-homebrew/) 
3. Run `nvm install 14`
4. Run `nvm use 14`
5. Run `yarn install`
6. Run `yarn start`

# Setup [summitswap-uikit](https://github.com/Koda-Finance/summitswap-uikit)
1. Choose the version of [summitswap-uikit](https://www.npmjs.com/package/@koda-finance/summitswap-uikit)
2. In summitswap Interface package.json > make sure you update `"@koda-finance/summitswap-uikit": " ** YOUR_VERSION_NUMBER ** `
3. `yarn install`
4. Run on every change in UIKIT `yarn upgrade @koda-finance/summitswap-uikit && yarn install`

# Setup [summitswap-sdk](https://github.com/Koda-Finance/summitswap-sdk)
1. Choose the version of [summitswap-sdk](https://www.npmjs.com/package/@koda-finance/summitswap-sdk)
2. In summitswap Interface package.json > make sure you update `"@koda-finance/summitswap-sdk": " ** YOUR_VERSION_NUMBER ** `
3. `yarn install`
4. Run on every change in SDK `yarn upgrade @koda-finance/summitswap-sdk && yarn install`

# Start [summitswap-interface](https://github.com/Koda-Finance/summitswap-interface)
1. Run `yarn install`
2. Run `yarn build-test` for testnet or `yarn build-mainnet` for mainnet
3. Run `yarn start` for testnet or `yarn start-mainnet` for mainnet

