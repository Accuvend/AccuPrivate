import Transaction from "../models/Transaction.model"

export default class ResponseTrimmer {
    static trimTransactionResponse(transaction: Partial<Transaction>): Partial<Transaction> {
        delete transaction.events
        delete transaction.previousVendors
        delete transaction.retryRecord
        delete transaction.superagent

        return transaction  
    }
}
