## Summitswap Interface

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

# Setup [Summitswap-SDK](https://github.com/Koda-Finance/summitswap-sdk)
1. Create a new branche
2. Build project
3. Push changes
4. In summitswap Interface package.json > make sure you change	`"@summitswap-libs": "git+https://github.com/Koda-Finance/summitswap-sdk.git# **YOUR_BRANCH_NAME"**`
    

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
