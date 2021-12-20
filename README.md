# summitswap-interface

For the developers we have deployed summitswap's 2 branches on 2 seperate networks.

# Deploy
Just make a commit to `main` or `develop` and changes will get automatically deployed on both `BSC` and `BSC testnet` network.

PRs to `develop` are deployed as well, but only on `BSC testnet`

# Setup
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
            - yarn install
        build:
          commands:
            - yarn run build
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


##Run localy
1. Make sure you are connected to `github` on terminal using Personal access tokens
2. Install [node lts](https://tecadmin.net/install-nvm-macos-with-homebrew/) 
3. Run `nvm install --lts`
4. Run `nvm use --lts`
5. Run `yarn install`
6. Run `yarn start`

## Summitswap-uikit
1. Create a new branche
2. Build project
3. Push changes
4. In summitswap Interface package.json > make sure you change	`"@summitswap-uikit": "git+https://github.com/Koda-Finance/summitswap-uikit.git#  ** YOUR_BRANCH_NAME** `

## Summitswap-SDK
1. Create a new branche
2. Build project
3. Push changes
4. In summitswap Interface package.json > make sure you change	`"@summitswap-libs": "git+https://github.com/Koda-Finance/summitswap-sdk.git# **YOUR_BRANCH_NAME"**`

## Summitswap interface
1. Run yarn install
2. Run yarn start
