import type { FinanceTransactionType } from '../enums/FinanceTransactionType'

export interface FinanceTransaction {
  id: string
  parishId: string
  transactionType: FinanceTransactionType
  date: string
  category: string
  description: string
  amount: number
  reference?: string
  notes?: string
  createdAt: string
  updatedAt?: string
  active?: boolean
}
