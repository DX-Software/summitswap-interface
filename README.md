# summitswap-interface

For the developers we have deployed summitswap's 2 branches on 2 seperate networks.

[main Mainnet](main.d3cj974y5wyhbr.amplifyapp.com)
[staging Mainnet](testnet.d3cj974y5wyhbr.amplifyapp.com)

[main Testnet](main.d1apfotwvb2yrn.amplifyapp.com)
[staging Testnet](staging.d1apfotwvb2yrn.amplifyapp.com)
[develop Testnet](develop.d1apfotwvb2yrn.amplifyapp.com)

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
