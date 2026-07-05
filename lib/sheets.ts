import { Trade, Setup } from '@/types'
export { PRODUCTS, ACCOUNTS, STAGES, STRATEGIES, CHECKLIST_ITEMS } from '@/lib/constants'

// ─── Mock data (Demo mode) ────────────────────────────────────────────────────
let mockTrades: Trade[] = [
  { rowIndex: 2,  date: '2025-05-01', symbol: 'XAUUSD', direction: 'Buy',  account: 'Eightcap', entry: 2320.50, exit: 2345.80, size: 0.5,  pnl:  1265, rr:  2.5, strategy: 'H4 Trend',      notes: 'Setup ชัดเจน',    learningPoint: '',                       plan: 'ตามแผน' },
  { rowIndex: 3,  date: '2025-05-03', symbol: 'BTCUSD', direction: 'Sell', account: '5%er',     entry: 62500,  exit: 61200,  size: 0.01, pnl:  1300, rr:  2.0, strategy: 'TF15 Break',    notes: '',                 learningPoint: '',                       plan: 'ไม่ตามแผน' },
  { rowIndex: 4,  date: '2025-05-05', symbol: 'EURUSD', direction: 'Buy',  account: 'Eightcap', entry: 1.0850, exit: 1.0810, size: 1.0,  pnl:  -400, rr: -1.0, strategy: 'H4 Pullback',   notes: 'เข้าเร็วไป',      learningPoint: 'รอ confirm ก่อนเข้า',    plan: 'ไม่ตามแผน' },
  { rowIndex: 5,  date: '2025-05-07', symbol: 'XAUUSD', direction: 'Sell', account: 'Eightcap', entry: 2360,   exit: 2340,   size: 0.3,  pnl:   600, rr:  1.5, strategy: 'H4 Resistance', notes: 'ออกตามแผน',       learningPoint: '',                       plan: 'ตามแผน' },
  { rowIndex: 6,  date: '2025-05-09', symbol: 'XAGUSD', direction: 'Buy',  account: '5%er',     entry: 32.50,  exit: 33.10,  size: 2.0,  pnl:  1200, rr:  3.0, strategy: 'TF15 Break',    notes: '',                 learningPoint: 'Patience pays off',      plan: 'ตามแผน' },
  { rowIndex: 7,  date: '2025-05-11', symbol: 'BTCUSD', direction: 'Buy',  account: '5%er',     entry: 61000,  exit: 60200,  size: 0.01, pnl:  -800, rr: -1.0, strategy: 'H4 Trend',      notes: 'ไม่ควรเข้า',      learningPoint: 'อย่า overtrade',         plan: 'ไม่ตามแผน' },
  { rowIndex: 8,  date: '2025-05-13', symbol: 'XTIUSD', direction: 'Buy',  account: 'Eightcap', entry: 78.50,  exit: 80.20,  size: 1.0,  pnl:  1700, rr:  2.8, strategy: 'H4 Support',    notes: 'Perfect entry',   learningPoint: '',                       plan: 'ตามแผน' },
  { rowIndex: 9,  date: '2025-05-15', symbol: 'EURUSD', direction: 'Sell', account: 'Eightcap', entry: 1.0920, exit: 1.0880, size: 1.0,  pnl:   400, rr:  1.2, strategy: 'H4 Resistance', notes: '',                 learningPoint: '',                       plan: 'ตามแผน' },
  { rowIndex: 10, date: '2025-05-17', symbol: 'XAUUSD', direction: 'Buy',  account: '5%er',     entry: 2350,   exit: 2380,   size: 0.2,  pnl:   600, rr:  2.0, strategy: 'H4 Trend',      notes: 'Trend following',  learningPoint: '',                       plan: 'ตามแผน' },
  { rowIndex: 11, date: '2025-05-19', symbol: 'XAGUSD', direction: 'Sell', account: 'Eightcap', entry: 33.20,  exit: 33.80,  size: 1.0,  pnl:  -600, rr: -1.0, strategy: 'Counter Trend', notes: 'ผิด direction',   learningPoint: 'ตรวจ H4 ก่อนเสมอ',      plan: 'ไม่ตามแผน' },
  { rowIndex: 12, date: '2025-05-21', symbol: 'XAUUSD', direction: 'Buy',  account: 'Eightcap', entry: 2390,   exit: 2420,   size: 0.5,  pnl:  1500, rr:  3.0, strategy: 'H4 Trend',      notes: 'Full TP',         learningPoint: '',                       plan: 'ตามแผน' },
  { rowIndex: 13, date: '2025-05-23', symbol: 'BTCUSD', direction: 'Sell', account: '5%er',     entry: 67000,  exit: 65500,  size: 0.01, pnl:  1500, rr:  2.5, strategy: 'H4 Resistance', notes: '',                 learningPoint: '',                       plan: 'ตามแผน' },
]

let mockSetups: Setup[] = [
  { rowIndex: 2, symbol: 'XAUUSD', stage: 'พร้อม Entry', direction: 'Buy',  checklist: [true, true, true, true, true, true, true, false], notes: 'รอ H1 confirm',   lastUpdated: '2025-05-23' },
  { rowIndex: 3, symbol: 'BTCUSD', stage: 'รอสัญญาณ',   direction: 'Sell', checklist: [true, true, true, false, false, false, false, false], notes: 'Need pullback', lastUpdated: '2025-05-22' },
  { rowIndex: 4, symbol: 'EURUSD', stage: 'กำลังดู',    direction: '',     checklist: [true, false, false, false, false, false, false, false], notes: '',            lastUpdated: '2025-05-21' },
  { rowIndex: 5, symbol: 'XAGUSD', stage: 'รอสัญญาณ',   direction: 'Buy',  checklist: [true, true, true, true, false, false, false, false], notes: 'Near key level', lastUpdated: '2025-05-23' },
  { rowIndex: 6, symbol: 'XTIUSD', stage: 'กำลังดู',    direction: '',     checklist: [true, true, false, false, false, false, false, false], notes: '',            lastUpdated: '2025-05-20' },
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
    range: 'Trades!A2:N',
  })
  const rows = res.data.values ?? []
  return rows.map((row, idx) => ({
    rowIndex:      idx + 2,
    date:          row[0] ?? '',
    symbol:        row[1] ?? '',
    direction:     (row[2] as 'Buy' | 'Sell') ?? 'Buy',
    account:       row[3] ?? '',
    entry:         parseFloat(row[4] ?? '0') || 0,
    exit:          parseFloat(row[5] ?? '0') || 0,
    size:          parseFloat(row[6] ?? '0') || 0,
    pnl:           parseFloat(row[7] ?? '0') || 0,
    // row[8] = Feeling (legacy, kept in sheet for history, not shown in UI)
    rr:            parseFloat(row[12] ?? '0') || 0,
    strategy:      row[9] ?? '',
    notes:         row[10] ?? '',
    learningPoint: row[13] ?? '',
    plan:          (row[11] as 'ตามแผน' | 'ไม่ตามแผน' | '') ?? '',
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

export async function updateTrade(trade: Trade): Promise<void> {
  if (!isConfigured()) {
    const idx = mockTrades.findIndex(t => t.rowIndex === trade.rowIndex)
    if (idx !== -1) mockTrades[idx] = trade
    return
  }

  const sheets = await getSheetClient()
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `Trades!A${trade.rowIndex}:N${trade.rowIndex}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        trade.date, trade.symbol, trade.direction, trade.account,
        trade.entry, trade.exit, trade.size, trade.pnl,
        '', trade.strategy, trade.notes, trade.plan ?? '',
        trade.rr, trade.learningPoint,
      ]],
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
    range: 'Trades!A:N',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        trade.date, trade.symbol, trade.direction, trade.account,
        trade.entry, trade.exit, trade.size, trade.pnl,
        '', trade.strategy, trade.notes, trade.plan ?? '',
        trade.rr, trade.learningPoint,
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
    range: 'Setups!A2:M',
  })
  const rows = res.data.values ?? []
  return rows.map((row, idx) => ({
    rowIndex:    idx + 2,
    symbol:      row[0] ?? '',
    stage:       row[1] ?? '',
    checklist:   [row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9]].map(v => v === 'TRUE'),
    notes:       row[10] ?? '',
    lastUpdated: row[11] ?? '',
    direction:   (row[12] as 'Buy' | 'Sell' | '') ?? '',
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
    range: 'Setups!A:M',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        setup.symbol, setup.stage,
        ...setup.checklist.map(c => c ? 'TRUE' : 'FALSE'),
        setup.notes, now, setup.direction ?? '',
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
    range: `Setups!A${setup.rowIndex}:M${setup.rowIndex}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        setup.symbol, setup.stage,
        ...setup.checklist.map(c => c ? 'TRUE' : 'FALSE'),
        setup.notes, now, setup.direction ?? '',
      ]],
    },
  })
}
