import { Token } from '@koda-finance/summitswap-sdk'

export interface SegmentsProps {
    outputToken?: Token
    openModel: (pendingMess: string) => void
    transactionSubmitted: (hashText: string, summary: string) => void
    transactionFailed: (messFromError: string) => void
    onDismiss: () => void
}