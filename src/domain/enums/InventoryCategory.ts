export enum InventoryCategory {
  LITURGICAL = 'LITURGICAL',
  OFFICE = 'OFFICE',
  CLEANING = 'CLEANING',
  KITCHEN = 'KITCHEN',
  MAINTENANCE = 'MAINTENANCE',
  OTHER = 'OTHER',
}

export const inventoryCategoryLabels: Record<InventoryCategory, string> = {
  [InventoryCategory.LITURGICAL]: 'Liturgical',
  [InventoryCategory.OFFICE]: 'Office',
  [InventoryCategory.CLEANING]: 'Cleaning',
  [InventoryCategory.KITCHEN]: 'Kitchen',
  [InventoryCategory.MAINTENANCE]: 'Maintenance',
  [InventoryCategory.OTHER]: 'Other',
}
