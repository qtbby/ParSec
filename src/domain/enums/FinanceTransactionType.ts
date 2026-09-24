export enum FinanceTransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export const financeTypeLabels: Record<FinanceTransactionType, string> = {
  [FinanceTransactionType.INCOME]: 'Income',
  [FinanceTransactionType.EXPENSE]: 'Expense',
}
