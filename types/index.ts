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
  rr: number
  strategy: string
  notes: string
  learningPoint: string
  plan: 'ตามแผน' | 'ไม่ตามแผน' | ''
}

export interface Setup {
  rowIndex: number
  symbol: string
  stage: string
  direction: 'Buy' | 'Sell' | ''
  checklist: boolean[]
  notes: string
  lastUpdated: string
}
