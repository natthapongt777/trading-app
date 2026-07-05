export const PRODUCTS = ['XAUUSD', 'XAGUSD', 'BTCUSD', 'EURUSD', 'XTIUSD']
// USD value per 1 lot per 1 unit price move — used for lot size calculation
export const LOT_CALC: Record<string, number> = {
  XAUUSD: 100,
  XAGUSD: 5000,
  BTCUSD: 1,
  EURUSD: 100000,
  XTIUSD: 1000,
}
export const ACCOUNTS = ['Eightcap', '5%er', 'FTMO']
export const STRATEGIES = ['H4 Trend', 'H4 Pullback', 'H4 Resistance', 'H4 Support', 'TF15 Break', 'TF15 Pullback', 'Liquidity Sweep', 'Counter Trend']
export const STAGES = ['รอ H4 confirmation', 'รอ TF15 confirmation', 'Active']
export const CHECKLIST_ITEMS = [
  'H4 Trend เหมือน Day (Buy or Sell)',
  'H4 Overbought / Oversold',
  'H4 ราคาถึงแนวรับ / แนวต้านสำคัญ',
  'H4 ราคากลับมา > 38.2%',
  'TF15 Break',
  'TF15 Pullback',
  'Liquidity Sweep',
  'RR > 2',
]
