import { Trade, Setup } from '@/types'
export { PRODUCTS, ACCOUNTS, STAGES, CHECKLIST_ITEMS } from '@/lib/constants'

// ─── Mock data (Demo mode) ────────────────────────────────────────────────────
let mockTrades: Trade[] = [
  { rowIndex: 2,  date: '2025-05-01', symbol: 'XAUUSD', direction: 'Buy',  account: 'Eightcap', entry: 2320.50, exit: 2345.80, size: 0.5,  pnl:  1265, feeling: 'มั่นใจ',  strategy: 'H4 Trend',      notes: 'Setup ชัดเจน' },
  { rowIndex: 3,  date: '2025-05-03', symbol: 'BTCUSD', direction: 'Sell', account: '5%er',     entry: 62500,  exit: 61200,  size: 0.01, pnl:  1300, feeling: 'FOMO',    strategy: 'TF15 Break',    notes: '' },
  { rowIndex: 4,  date: '2025-05-05', symbol: 'EURUSD', direction: 'Buy',  account: 'Eightcap', entry: 1.0850, exit: 1.0810, size: 1.0,  pnl:  -400, feeling: 'ลังเล',   strategy: 'H4 Pullback',   notes: 'เข้าเร็วไป' },
  { rowIndex: 5,  date: '2025-05-07', symbol: 'XAUUSD', direction: 'Sell', account: 'Eightcap', entry: 2360,   exit: 2340,   size: 0.3,  pnl:   600, feeling: 'มั่นใจ',  strategy: 'H4 Resistance', notes: 'ออกตามแผน' },
  { rowIndex: 6,  date: '2025-05-09', symbol: 'XAGUSD', direction: 'Buy',  account: '5%er',     entry: 32.50,  exit: 33.10,  size: 2.0,  pnl:  1200, feeling: 'มั่นใจ',  strategy: 'TF15 Break',    notes: 'RR 1:3' },
  { rowIndex: 7,  date: '2025-05-11', symbol: 'BTCUSD', direction: 'Buy',  account: '5%er',     entry: 61000,  exit: 60200,  size: 0.01, pnl:  -800, feeling: 'FOMO',    strategy: 'FOMO entry',    notes: 'ไม่ควรเข้า' },
  { rowIndex: 8,  date: '2025-05-13', symbol: 'XTIUSD', direction: 'Buy',  account: 'Eightcap', entry: 78.50,  exit: 80.20,  size: 1.0,  pnl:  1700, feeling: 'มั่นใจ',  strategy: 'H4 Support',    notes: 'Perfect entry' },
  { rowIndex: 9,  date: '2025-05-15', symbol: 'EURUSD', direction: 'Sell', account: 'Eightcap', entry: 1.0920, exit: 1.0880, size: 1.0,  pnl:   400, feeling: 'ปกติ',    strategy: 'H4 Resistance', notes: '' },
  { rowIndex: 10, date: '2025-05-17', symbol: 'XAUUSD', direction: 'Buy',  account: '5%er',     entry: 2350,   exit: 2380,   size: 0.2,  pnl:   600, feeling: 'มั่นใจ',  strategy: 'H4 Trend',      notes: 'Trend following' },
  { rowIndex: 11, date: '2025-05-19', symbol: 'XAGUSD', direction: 'Sell', account: 'Eightcap', entry: 33.20,  exit: 33.80,  size: 1.0,  pnl:  -600, feeling: 'ลังเล',   strategy: 'Counter trend', notes: 'ผิด direction' },
  { rowIndex: 12, date: '2025-05-21', symbol: 'XAUUSD', direction: 'Buy',  account: 'Eightcap', entry: 2390,   exit: 2420,   size: 0.5,  pnl:  1500, feeling: 'มั่นใจ',  strategy: 'H4 Trend',      notes: 'Full TP' },
  { rowIndex: 13, date: '2025-05-23', symbol: 'BTCUSD', direction: 'Sell', account: '5%er',     entry: 67000,  exit: 65500,  size: 0.01, pnl:  1500, feeling: 'มั่นใจ',  strategy: 'H4 Resistance', notes: 'RR 1:2.5' },
]

let mockSetups: Setup[] = [
  { rowIndex: 2, symbol: 'XAUUSD', stage: 'พร้อม Entry', checklist: [true, true, true, true, true, true, true, false], notes: 'รอ H1 confirm',   lastUpdated: '2025-05-23' },
  { rowIndex: 3, symbol: 'BTCUSD', stage: 'รอสัญญาณ',   checklist: [true, true, true, false, false, false, false, false], notes: 'Need pullback', lastUpdated: '2025-05-22' },
  { rowIndex: 4, symbol: 'EURUSD', stage: 'กำลังดู',    checklist: [true, false, false, false, false, false, false, false], notes: '',            lastUpdated: '2025-05-21' },
  { rowIndex: 5, symbol: 'XAGUSD', stage: 'รอสัญญาณ',   checklist: [true, true, true, true, false, false, false, false], notes: 'Near key level', lastUpdated: '2025-05-23' },
  { rowIndex: 6, symbol: 'XTIUSD', stage: 'กำลังดู',    checklist: [true, true, false, false, false, false, false, false], notes: '',            lastUpdated: '2025-05-20' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isConfigured(): boolean {
  return !!(process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
}

async function getSheetClient() {
  const { google } = await import('googleapis')
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({ version: 'v4', auth })
}

// ─── Trades ───────────────────────────────────────────────────────────────────
export async function getTrades(): Promise<Trade[]> {
  if (!isConfigured()) return [...mockTrades].reverse()

  const sheets = await getSheetClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Trades!A2:K',
  })
  const rows = res.data.values ?? []
  return rows.map((row, idx) => ({
    rowIndex:  idx + 2,
    date:      row[0] ?? '',
    symbol:    row[1] ?? '',
    direction: (row[2] as 'Buy' | 'Sell') ?? 'Buy',
    account:   row[3] ?? '',
    entry:     parseFloat(row[4] ?? '0') || 0,
    exit:      parseFloat(row[5] ?? '0') || 0,
    size:      parseFloat(row[6] ?? '0') || 0,
    pnl:       parseFloat(row[7] ?? '0') || 0,
    feeling:   row[8] ?? '',
    strategy:  row[9] ?? '',
    notes:     row[10] ?? '',
  })).reverse()
}

export async function deleteTrade(rowIndex: number): Promise<void> {
  if (!isConfigured()) {
    mockTrades = mockTrades.filter(t => t.rowIndex !== rowIndex)
    return
  }

  const sheets = await getSheetClient()
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID })
  const tradesSheet = spreadsheet.data.sheets?.find(s => s.properties?.title === 'Trades')
  const sheetId = tradesSheet?.properties?.sheetId ?? 0

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    requestBody: {
      requests: [{ deleteDimension: { range: { sheetId, dimension: 'ROWS', startIndex: rowIndex - 1, endIndex: rowIndex } } }],
    },
  })
}

export async function addTrade(trade: Omit<Trade, 'rowIndex'>): Promise<void> {
  if (!isConfigured()) {
    mockTrades.push({ ...trade, rowIndex: mockTrades.length + 2 })
    return
  }

  const sheets = await getSheetClient()
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Trades!A:K',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        trade.date, trade.symbol, trade.direction, trade.account,
        trade.entry, trade.exit, trade.size, trade.pnl,
        trade.feeling, trade.strategy, trade.notes,
      ]],
    },
  })
}

// ─── Setups ───────────────────────────────────────────────────────────────────
export async function getSetups(): Promise<Setup[]> {
  if (!isConfigured()) return [...mockSetups]

  const sheets = await getSheetClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Setups!A2:L',
  })
  const rows = res.data.values ?? []
  return rows.map((row, idx) => ({
    rowIndex:    idx + 2,
    symbol:      row[0] ?? '',
    stage:       row[1] ?? '',
    checklist:   [row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9]].map(v => v === 'TRUE'),
    notes:       row[10] ?? '',
    lastUpdated: row[11] ?? '',
  }))
}

export async function deleteSetup(rowIndex: number): Promise<void> {
  if (!isConfigured()) {
    mockSetups = mockSetups.filter(s => s.rowIndex !== rowIndex)
    return
  }

  const sheets = await getSheetClient()
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID })
  const setupsSheet = spreadsheet.data.sheets?.find(s => s.properties?.title === 'Setups')
  const sheetId = setupsSheet?.properties?.sheetId ?? 0

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    requestBody: {
      requests: [{ deleteDimension: { range: { sheetId, dimension: 'ROWS', startIndex: rowIndex - 1, endIndex: rowIndex } } }],
    },
  })
}

export async function addSetup(setup: Omit<Setup, 'rowIndex'>): Promise<void> {
  const now = new Date().toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' })

  if (!isConfigured()) {
    mockSetups.push({ ...setup, rowIndex: mockSetups.length + 2, lastUpdated: now })
    return
  }

  const sheets = await getSheetClient()
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Setups!A:L',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        setup.symbol, setup.stage,
        ...setup.checklist.map(c => c ? 'TRUE' : 'FALSE'),
        setup.notes, now,
      ]],
    },
  })
}

export async function updateSetup(setup: Setup): Promise<void> {
  const now = new Date().toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' })

  if (!isConfigured()) {
    const idx = mockSetups.findIndex(s => s.rowIndex === setup.rowIndex)
    if (idx !== -1) mockSetups[idx] = { ...setup, lastUpdated: now }
    return
  }

  const sheets = await getSheetClient()
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `Setups!A${setup.rowIndex}:L${setup.rowIndex}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        setup.symbol, setup.stage,
        ...setup.checklist.map(c => c ? 'TRUE' : 'FALSE'),
        setup.notes, now,
      ]],
    },
  })
}
