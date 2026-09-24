export enum SacramentType {
  BAPTISM = 'BAPTISM',
  CONFIRMATION = 'CONFIRMATION',
  FIRST_COMMUNION = 'FIRST_COMMUNION',
  MARRIAGE = 'MARRIAGE',
  ANOINTING = 'ANOINTING',
  OTHER = 'OTHER',
}

export const sacramentLabels: Record<SacramentType, string> = {
  [SacramentType.BAPTISM]: 'Baptism',
  [SacramentType.CONFIRMATION]: 'Confirmation',
  [SacramentType.FIRST_COMMUNION]: 'First Communion',
  [SacramentType.MARRIAGE]: 'Marriage',
  [SacramentType.ANOINTING]: 'Anointing of the Sick',
  [SacramentType.OTHER]: 'Other',
}
