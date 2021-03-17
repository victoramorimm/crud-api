export type HashComparerModel = {
  value: string
  valueToCompare: string
}

export interface HashComparer {
  compare: (data: HashComparerModel) => Promise<boolean>
}
