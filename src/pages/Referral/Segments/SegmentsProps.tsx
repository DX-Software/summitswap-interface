import { Token } from '@koda-finance/summitswap-sdk'
import { TransactionResponse } from '@ethersproject/providers'

export interface SegmentsProps {
    outputToken?: Token
    openModel: (pendingMess: string) => void
    transactionSubmitted: (transaction: TransactionResponse, summary: string) => void
    transactionFailed: (messFromError: string) => void
    onDismiss: () => void
}