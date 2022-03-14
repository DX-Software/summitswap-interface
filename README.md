## Summitswap Interface
For the developers, we have deployed summitswap's branches on these seperate networks.

Mainnet:

[`main` Mainnet](https://main.d3cj974y5wyhbr.amplifyapp.com)

[`develop` Mainnet](https://develop.d3cj974y5wyhbr.amplifyapp.com)

Testnet:

[`main` Testnet](https://main.d1apfotwvb2yrn.amplifyapp.com)

[`develop` Testnet](https://develop.d1apfotwvb2yrn.amplifyapp.com)

# Setup local app
1. Make sure you are connected to `github` on terminal using Personal access tokens
2. Install [node lts](https://tecadmin.net/install-nvm-macos-with-homebrew/) 
3. Run `nvm install 14`
4. Run `nvm use 14`
5. Run `yarn install`
6. Run `yarn start`

# Setup [summitswap-uikit](https://github.com/Koda-Finance/summitswap-uikit)
## Development
1. Create a new branch
2. Add `dist` to `.gitignore`
3. Build project
4. Push changes
5. In summitswap Interface package.json > make sure you change	`"@koda-finance/summitswap-uikit": "git+https://github.com/Koda-Finance/summitswap-uikit.git# ** YOUR_BRANCH_NAME** "`
6. `yarn install`
7. Run on every change in UIKIT `yarn upgrade @koda-finance/summitswap-uikit && yarn install`

## Production
1. Choose the version of [summitswap-uikit](https://www.npmjs.com/package/@koda-finance/summitswap-uikit)
2. In summitswap Interface package.json > make sure you update `"@koda-finance/summitswap-uikit": " ** YOUR_VERSION_NUMBER ** `
3. `yarn install`
4. Run on every change in UIKIT `yarn upgrade @koda-finance/summitswap-uikit && yarn install`

# Setup [summitswap-sdk](https://github.com/Koda-Finance/summitswap-sdk)
## Development
1. Create a new branch
2. Add `dist` to `.gitignore`
3. Build project
4. Push changes
5. In summitswap Interface package.json > make sure you change	`"@koda-finance/summitswap-sdk": "git+https://github.com/Koda-Finance/summitswap-sdk.git# **YOUR_BRANCH_NAME"**`
6. `yarn install`
7. Run on every change in SDK `yarn upgrade @summitswap-sdk && yarn install`
## Production
1. Choose the version of [summitswap-sdk](https://www.npmjs.com/package/@koda-finance/summitswap-sdk)
2. In summitswap Interface package.json > make sure you update `"@koda-finance/summitswap-sdk": " ** YOUR_VERSION_NUMBER ** `
3. `yarn install`
4. Run on every change in SDK `yarn upgrade @koda-finance/summitswap-sdk && yarn install`

# Deploy on AWS

Any commit to `main` or `develop` will get changes automatically deployed on both `BSC` and `BSC testnet` network.

Commits to other branches are deployed as well, but only on `BSC testnet`

Don't forget to commit `yarn.lock` as well otherwise deploy will fail

# Deployment on live server
1. Use the latest version of [summitswap-sdk](https://www.npmjs.com/package/@koda-finance/summitswap-sdk)
2. Use the latest version of [summitswap-uikit](https://www.npmjs.com/package/@koda-finance/summitswap-uikit)
3. We need to make a pull request for [summitswap-data](https://github.com/Koda-Finance/summitswap-data), from `develop` branch to the `main` branch. (the pull request will be merged after the interface is deployed)
4. Make pull request from `develop` branch to the `main` branch
5. Have approval for the pull request
6. After the pull request is approved and merged to the `main` branch, the deployment will start automatically.
7. After the interface is deployed, we can deploy [summitswap-data](https://github.com/Koda-Finance/summitswap-data) by merging the `develop` branch to the `main` branch

# Setup automated Deployment (one time, admin only)

Here are the steps on how to deploy your React app from scrach on `AWS Amplify`:

1. Go to Amplify Console
2. Click Host your web app
3. Connect your source location (In our case Github, make sure you have `admin` permissions on the repo you are trying to deploy)
4. Choose repo & branch
5. Edit the build yaml file (In our case we used this one for main)

    ``` YML
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - yarn install --frozen-lockfile
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: build
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
    ```

    In the case of raw HTML, you won't have a build proccess
6. (Optional - Add previews to PRs) Go to Previews section in `Amplify` console and choose branch on which opened PRs will be deployed and will get the preview.

## Running tests

### Add Liquidity

1. Deploy 2 tokens on `binance smatchain testnet`
2. Mint some balance of the 2 tokens to create a pair
  - Or you can ask a developer to give you some balance of DXT1 and DXT2 tokens.
    - DXT1 - `0xaa618B9347794845d17a168dd02C9078906AC2Ff`
    - DXT2 - `0x0F17BD856D147730E58c0fb63cfBcf4116E539Ae`

## Contracts

1. [DXT1](https://testnet.bscscan.com/address/0xaa618B9347794845d17a168dd02C9078906AC2Ff)
2. [DXT2](https://testnet.bscscan.com/address/0x0F17BD856D147730E58c0fb63cfBcf4116E539Ae)
3. [Router](https://testnet.bscscan.com/address/0xD7803eB47da0B1Cf569F5AFf169DA5373Ef3e41B)

## Troubleshooting for Development

### What if the modifications from the [summitswap-uikit](https://github.com/Koda-Finance/summitswap-uikit) are not taken into account by summitswap-interface

1. Run `yarn build`
2. Commit (In order to make modifications of the new created branch visible to the `summmitswap-interface` project (or any other project) one has to make sure that after the build is done the modifications are the same in both `src` folder and `dist` folder of [summitswap-uikit](https://github.com/Koda-Finance/summitswap-uikit) project. Check that `summitswap-uikit/dist/index.cjs.js` and `summitswap-uikit/dist/index.esm.js` are also updated). 
### What if the modifications from the [summitswap-sdk](https://github.com/Koda-Finance/summitswap-sdk) are not taken into account by summitswap-interface

1. Run `yarn build`
2. Commit (In order to make modifications of the new created branch visible to the `summmitswap-interface` project (or any other project) one has to make sure that after the build is done the modifications are the same in both `src` folder and `dist` folder of [summitswap-sdk](https://github.com/Koda-Finance/summitswap-sdk) project). 

### Update uikit or sdk

If summitswap-uikit main branch has updated after you first ran the app you need to run `yarn upgrade @koda-finance/summitswap-uikit` or `yarn upgrade @koda-finance/summitswap-sdk`
