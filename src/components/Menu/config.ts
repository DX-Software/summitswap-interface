import { MenuEntry } from '@koda-finance/summitswap-uikit'
import { BSC_CHAIN_ID, ETH_CHAIN_ID } from 'constants/index'

const config: MenuEntry[] = [
  // {
  //   label: "Home",
  //   icon: "HomeIcon",
  //   href: "/",
  // },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    href: '/swap',
    supportedChainId: BSC_CHAIN_ID,
  },
  {
    label: 'pool',
    icon: 'pool',
    href: '/pool',
    supportedChainId: BSC_CHAIN_ID,
    isHidden: true,
  },
  {
    label: 'add',
    icon: 'add',
    href: '/add',
    supportedChainId: BSC_CHAIN_ID,
    isHidden: true,
  },
  {
    label: 'find',
    icon: 'find',
    href: '/find',
    supportedChainId: BSC_CHAIN_ID,
    isHidden: true,
  },
  {
    label: 'Referral',
    icon: 'ReferralIcon',
    href: '/referral',
    supportedChainId: BSC_CHAIN_ID,
  },
  {
    label: 'Staking',
    icon: 'StakingIcon',
    href: '/staking/deposit',
    supportedChainId: BSC_CHAIN_ID,
  },
  {
    label: 'Staking',
    icon: 'StakingIcon',
    href: '/staking/claim',
    supportedChainId: BSC_CHAIN_ID,
    isHidden: true,
  },
  {
    label: 'Staking',
    icon: 'StakingIcon',
    href: '/staking/withdraw',
    supportedChainId: BSC_CHAIN_ID,
    isHidden: true,
  },
  {
    label: 'onboarding',
    icon: 'onboarding',
    href: '/onboarding',
    supportedChainId: BSC_CHAIN_ID,
    isHidden: true,
  },
  {
    label: 'remove',
    icon: 'remove',
    href: '/remove',
    supportedChainId: BSC_CHAIN_ID,
    isHidden: true,
  },
  {
    label: 'Cross-Chain',
    icon: 'RubicIcon',
    href: '/cross-chain-swap',
    showConnectButton: false,
  },
  {
    label: 'Info',
    icon: 'InfoIcon',
    href: '/info',
  },
  {
    label: 'Launchpad',
    icon: 'LaunchpadIcon',
    href: '/launchpad',
    supportedChainId: BSC_CHAIN_ID,
    isHidden: true,
  },
  {
    label: 'Presale-App',
    icon: 'CoinBagIcon',
    href: '/presale-application',
    supportedChainId: BSC_CHAIN_ID,
    isHidden: true,
  },
  {
    label: 'Kick Starter',
    icon: 'KickStarterIcon',
    href: '/kickstarter',
    supportedChainId: BSC_CHAIN_ID,
  },
  {
    label: 'Whitelabel NFT',
    icon: 'WhitelabelNftIcon',
    href: '/whitelabel-nft',
    supportedChainId: ETH_CHAIN_ID,
  },
  {
    label: 'summitcheck',
    icon: 'summitcheck',
    href: '/summitcheck',
    supportedChainId: BSC_CHAIN_ID,
    isHidden: true,
  },
  {
   label: 'Create Token',
    icon: 'SunIcon',
    href: '/create-token',
    supportedChainId: BSC_CHAIN_ID,
    isHidden: true,
  },
  // {
  // {
  //   label: "Onboarding",
  //   icon: "OnboardingIcon",
  //   href: "/onboarding",
  // },
  // {
  //   label: "Pools",
  //   icon: "PoolsIcon",
  //   href: "/pools",
  // },
  // {
  //   label: "Prediction",
  //   icon: "PredictionIcon",
  //   href: "/prediction",
  // },
  // {
  //   label: "Lottery",
  //   icon: "LotteryIcon",
  //   href: "/lottery",
  // },
  // {
  //   label: "Collectibles",
  //   icon: "CollectiblesIcon",
  //   href: "/nft",
  // },
  // {
  //   label: "Trust Scores",
  //   icon: "TrustScoresIcon",
  //   href: "/nft",
  // },
  // {
  //   label: "Games",
  //   icon: "GamesIcon",
  //   href: "/nft",
  // },
  // {
  //   label: "Team Battle",
  //   icon: "TeamBattleIcon",
  //   href: "/nft",
  // },
  // {
  //   label: "Team & Profile",
  //   icon: "TeamProfileIcon",
  //   href: "/nft",
  // },
  // {
  //   label: "IFO",
  //   icon: "IFOIcon",
  //   href: "/nft",
  // },
  // {
  //   label: "More",
  //   icon: "MoreIcon",
  //   href: "/nft",
  // },
]

export default config
