const ReferralSegmentInitial = {
    userDashboard: {
        isActive: true,
        title: "User Dashboard"
    },
    coinManager: {
        isActive: false,
        title: "Coin Manager Dashboard"
    },
    leadInfluencer: {
        isActive: false,
        title: "Lead Influencer Dashboard"
    },
    subInfluencer: {
        isActive: true,
        title: "Sub Influencer Dashboard"
    },
    history: {
        isActive: true,
        title: "Transaction History"
    },
}

export type ReferralSements = typeof ReferralSegmentInitial

export default ReferralSegmentInitial