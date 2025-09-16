type ContinuousProps = {
  mode: 'continuous'
  min: number
  max: number
  initialMin?: number
  initialMax?: number
  step?: number
  onChange?: (values: { min: number; max: number }) => void
}

type DiscreteProps = {
  mode: 'discrete'
  values: number[]
  initialMinIndex?: number
  initialMaxIndex?: number
  currency?: string
  onChange?: (values: { 
    minIndex: number
    maxIndex: number
    min: number
    max: number 
  }) => void
}

export type RangeProps = ContinuousProps | DiscreteProps