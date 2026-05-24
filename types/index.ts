export interface Trade {
  rowIndex: number
  date: string
  symbol: string
  direction: 'Buy' | 'Sell'
  account: string
  entry: number
  exit: number
  size: number
  pnl: number
  feeling: string
  strategy: string
  notes: string
}

export interface Setup {
  rowIndex: number
  symbol: string
  stage: string
  checklist: boolean[]
  notes: string
  lastUpdated: string
}
