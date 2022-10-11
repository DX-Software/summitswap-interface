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
    supportedChainIds: [BSC_CHAIN_ID],
  },
  {
    label: 'pool',
    icon: 'pool',
    href: '/pool',
    supportedChainIds: [BSC_CHAIN_ID],
    isHidden: true,
  },
  {
    label: 'add',
    icon: 'add',
    href: '/add',
    supportedChainIds: [BSC_CHAIN_ID],
    isHidden: true,
  },
  {
    label: 'find',
    icon: 'find',
    href: '/find',
    supportedChainIds: [BSC_CHAIN_ID],
    isHidden: true,
  },
  {
    label: 'Referral',
    icon: 'ReferralIcon',
    href: '/referral',
    supportedChainIds: [BSC_CHAIN_ID],
  },
  {
    label: 'Staking',
    icon: 'StakingIcon',
    href: '/staking/deposit',
    supportedChainIds: [BSC_CHAIN_ID],
  },
  {
    label: 'Staking',
    icon: 'StakingIcon',
    href: '/staking/claim',
    supportedChainIds: [BSC_CHAIN_ID],
    isHidden: true,
  },
  {
    label: 'Staking',
    icon: 'StakingIcon',
    href: '/staking/withdraw',
    supportedChainIds: [BSC_CHAIN_ID],
    isHidden: true,
  },
  {
    label: 'onboarding',
    icon: 'onboarding',
    href: '/onboarding',
    supportedChainIds: [BSC_CHAIN_ID],
    isHidden: true,
  },
  {
    label: 'remove',
    icon: 'remove',
    href: '/remove',
    supportedChainIds: [BSC_CHAIN_ID],
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
    supportedChainIds: [BSC_CHAIN_ID],
    isHidden: true,
  },
  {
    label: 'Presale-App',
    icon: 'CoinBagIcon',
    href: '/presale-application',
    supportedChainIds: [BSC_CHAIN_ID],
    isHidden: true,
  },
  {
    label: 'Kick Starter',
    icon: 'KickStarterIcon',
    href: '/kickstarter',
    supportedChainIds: [BSC_CHAIN_ID],
  },
  {
    label: 'Whitelabel NFT',
    icon: 'WhitelabelNftIcon',
    href: '/whitelabel-nft',
    supportedChainIds: [ETH_CHAIN_ID],
  },
  {
    label: 'summitcheck',
    icon: 'summitcheck',
    href: '/summitcheck',
    supportedChainIds: [BSC_CHAIN_ID],
    isHidden: true,
  },
  {
   label: 'Create Token',
    icon: 'SunIcon',
    href: '/create-token',
    supportedChainIds: [BSC_CHAIN_ID],
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
