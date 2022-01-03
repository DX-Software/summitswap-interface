## Summitswap Interface

- project description

For the developers we have deployed summitswap's branches on these seperate networks.

Mainnet:

[`main` Mainnet](https://main.d3cj974y5wyhbr.amplifyapp.com)

[`staging` Mainnet](https://staging.d3cj974y5wyhbr.amplifyapp.com)

Testnet:

[`main` Testnet](https://main.d1apfotwvb2yrn.amplifyapp.com)

[`staging` Testnet](https://staging.d1apfotwvb2yrn.amplifyapp.com)

[`develop` Testnet](https://develop.d1apfotwvb2yrn.amplifyapp.com)

# Setup local app
1. Make sure you are connected to `github` on terminal using Personal access tokens
2. Install [node lts](https://tecadmin.net/install-nvm-macos-with-homebrew/) 
3. Run `nvm install --lts`
4. Run `nvm use --lts`
5. Run `yarn install`
6. Run `yarn start`

# Setup [Summitswap-uikit](https://github.com/Koda-Finance/summitswap-uikit)
1. Create a new branche
2. Build project
3. Push changes
4. In summitswap Interface package.json > make sure you change	`"@summitswap-uikit": "git+https://github.com/Koda-Finance/summitswap-uikit.git#  ** YOUR_BRANCH_NAME** `
5. `yarn install`
6. Run on every change in UIKIT `yarn upgrade @summitswap-uikit && yarn install`

# Setup [Summitswap-SDK](https://github.com/Koda-Finance/summitswap-sdk)
1. Create a new branche
2. Build project
3. Push changes
4. In summitswap Interface package.json > make sure you change	`"@summitswap-libs": "git+https://github.com/Koda-Finance/summitswap-sdk.git# **YOUR_BRANCH_NAME"**`
5. `yarn install`
6. Run on every change in SDK `yarn upgrade @summitswap-sdk && yarn install`

# Deploy on AWS

Any commit to `main` or `staging` will get changes automatically deployed on both `BSC` and `BSC testnet` network.

Commits to `develop` and other branches are deployed as well, but only on `BSC testnet`

Don't forget to commit `yarn.lock` as well otherwise deploy will fail


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
6. (Optional - Add previews to PRs) Go to Previews section in `Amplify` console and choose branch on which opened PRs will be deployed and will get this result:

Note: 
  On our repo we use private github dependencies, so to give `Amplify` access to that, we had to make custom docker environment in which Gitub bot would be signed in with access to those repos.
  This environment first made as a docker image, then pushed to `ECR` and then specified on `Amplify` in Build settings

## Running tests

### Add Liquidity

1. Deploy 2 tokens on `binance smatchain testnet`
2. Mint some ballance of the 2 tokens to creat a pair
  - Or you can ask Ahmed to give you some ballance of DXT1 and DXT2 tokens.
    - DXT1 - `0xaa618B9347794845d17a168dd02C9078906AC2Ff`
    - DXT2 - `0x0F17BD856D147730E58c0fb63cfBcf4116E539Ae`

## Contracts

1. [DXT1](https://testnet.bscscan.com/address/0xaa618B9347794845d17a168dd02C9078906AC2Ff)
2. [DXT2](https://testnet.bscscan.com/address/0x0F17BD856D147730E58c0fb63cfBcf4116E539Ae)
3. [Router](https://testnet.bscscan.com/address/0xfF2dD86bc6016F3e666ac4733C65B36f5acff10a)

## Troubleshooting

### What if the modifications from the summitswampuikit are not taken into account by summitswapinterface

1. Run `yarn build`
2. Commit (In order to make modifications of the new created branch visible to the `summmitswap-interface` project (or any other project) one has to make sure that after the build is done the modifications are the same in both `src` folder and `dist` folder of `summitswap-uikit` project. Check that `summitswap-uikit/dist/index.cjs.js` and `summitswap-uikit/dist/index.esm.js` are also updated). 

### Update uikit

If summitswap-uikit main branch has updated after you first ran the app you need to run `yarn upgrade @summitswap-uikit`


