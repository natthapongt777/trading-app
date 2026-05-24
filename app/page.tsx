'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Trade, Setup } from '@/types'
import { PRODUCTS, ACCOUNTS, STAGES, CHECKLIST_ITEMS } from '@/lib/constants'

type Tab = 'dashboard' | 'trades' | 'setups'

const defaultForm = {
  date: '', symbol: 'XAUUSD', direction: 'Buy' as 'Buy' | 'Sell',
  account: 'Eightcap', entry: '', exit: '', size: '', pnl: '',
  feeling: '', strategy: '', notes: '',
}

export default function Home() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [trades, setTrades] = useState<Trade[]>([])
  const [setups, setSetups] = useState<Setup[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const [showTradeForm, setShowTradeForm] = useState(false)
  const [tradeForm, setTradeForm] = useState(defaultForm)
  const [savingTrade, setSavingTrade] = useState(false)

  const [editSetup, setEditSetup] = useState<Setup | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Trade | null>(null)
  const [deleteSetupConfirm, setDeleteSetupConfirm] = useState<Setup | null>(null)
  const [showAddSetup, setShowAddSetup] = useState(false)
  const [savingSetup, setSavingSetup] = useState(false)
  const [newSymbol, setNewSymbol] = useState('XAUUSD')
  const [customSymbol, setCustomSymbol] = useState('')

  const [filterSymbol, setFilterSymbol] = useState('all')
  const [filterAccount, setFilterAccount] = useState('all')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [tr, se] = await Promise.all([fetch('/api/trades'), fetch('/api/setups')])
      const td = await tr.json()
      const sd = await se.json()
      setTrades(Array.isArray(td) ? td : [])
      setSetups(Array.isArray(sd) ? sd : [])
    } catch { showToast('โหลดข้อมูลไม่สำเร็จ') }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAddTrade = async () => {
    if (!tradeForm.date || !tradeForm.pnl) return
    setSavingTrade(true)
    try {
      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: tradeForm.date, symbol: tradeForm.symbol,
          direction: tradeForm.direction, account: tradeForm.account,
          entry: parseFloat(tradeForm.entry) || 0,
          exit: parseFloat(tradeForm.exit) || 0,
          size: parseFloat(tradeForm.size) || 0,
          pnl: parseFloat(tradeForm.pnl) || 0,
          feeling: tradeForm.feeling, strategy: tradeForm.strategy, notes: tradeForm.notes,
        }),
      })
      if (!res.ok) throw new Error()
      setShowTradeForm(false)
      setTradeForm(defaultForm)
      showToast('บันทึกเทรดเรียบร้อย')
      fetchData()
    } catch { showToast('บันทึกไม่สำเร็จ') }
    setSavingTrade(false)
  }

  const handleDeleteTrade = async (trade: Trade) => {
    try {
      const res = await fetch('/api/trades', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowIndex: trade.rowIndex }),
      })
      if (!res.ok) throw new Error()
      setDeleteConfirm(null)
      showToast('ลบเทรดเรียบร้อย')
      fetchData()
    } catch { showToast('ลบไม่สำเร็จ') }
  }

  const handleDeleteSetup = async (setup: Setup) => {
    try {
      const res = await fetch('/api/setups', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowIndex: setup.rowIndex }),
      })
      if (!res.ok) throw new Error()
      setDeleteSetupConfirm(null)
      showToast(`ลบ ${setup.symbol} เรียบร้อย`)
      fetchData()
    } catch { showToast('ลบไม่สำเร็จ') }
  }

  const handleSaveSetup = async (setup: Setup) => {
    setSavingSetup(true)
    try {
      const res = await fetch('/api/setups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setup),
      })
      if (!res.ok) throw new Error()
      setEditSetup(null)
      showToast('บันทึก setup เรียบร้อย')
      fetchData()
    } catch { showToast('บันทึกไม่สำเร็จ') }
    setSavingSetup(false)
  }

  const handleAddSetup = async () => {
    const symbol = newSymbol === '__custom__' ? customSymbol.trim() : newSymbol
    if (!symbol) return
    setSavingSetup(true)
    try {
      const res = await fetch('/api/setups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, stage: 'กำลังดู', checklist: Array(8).fill(false), notes: '', lastUpdated: '' }),
      })
      if (!res.ok) throw new Error()
      setShowAddSetup(false)
      setNewSymbol('XAUUSD')
      setCustomSymbol('')
      showToast(`เพิ่ม ${symbol} เรียบร้อย`)
      fetchData()
    } catch { showToast('เพิ่มไม่สำเร็จ') }
    setSavingSetup(false)
  }

  // ── Dashboard calculations ──────────────────────────────────────────────────
  const filtered = trades.filter(t => {
    if (filterSymbol !== 'all' && t.symbol !== filterSymbol) return false
    if (filterAccount !== 'all' && t.account !== filterAccount) return false
    return true
  })

  const totalPnl = filtered.reduce((s, t) => s + t.pnl, 0)
  const wins = filtered.filter(t => t.pnl > 0)
  const losses = filtered.filter(t => t.pnl < 0)
  const winRate = filtered.length > 0 ? wins.length / filtered.length * 100 : 0
  const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0
  const avgLoss = losses.length > 0 ? losses.reduce((s, t) => s + t.pnl, 0) / losses.length : 0

  const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date))
  let cum = 0
  const cumulativeData = sorted.map(t => ({ label: t.date.slice(5).replace('-', '/'), cum: (cum += t.pnl) }))

  const feelingMap: Record<string, number> = {}
  filtered.forEach(t => { if (t.feeling) feelingMap[t.feeling] = (feelingMap[t.feeling] ?? 0) + t.pnl })
  const feelingData = Object.entries(feelingMap).map(([feeling, pnl]) => ({ feeling, pnl: Math.round(pnl) }))

  const accMap: Record<string, number> = {}
  filtered.forEach(t => { accMap[t.account] = (accMap[t.account] ?? 0) + t.pnl })
  const accData = Object.entries(accMap).map(([account, pnl]) => ({ account, pnl: Math.round(pnl) }))

  const tradeSymbols = [...new Set(trades.map(t => t.symbol))]

  const stageColor = (s: string) =>
    s === 'พร้อม Entry' ? 'bg-green-700 text-green-100' :
    s === 'Active'      ? 'bg-blue-700 text-blue-100' :
    s === 'รอสัญญาณ'   ? 'bg-yellow-700 text-yellow-100' :
    'bg-gray-700 text-gray-300'

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✅ {toast}
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="text-xl">📈</span>
          <div>
            <h1 className="font-bold text-sm leading-none">Trading Journal</h1>
            <p className="text-gray-400 text-xs mt-0.5">Track & Analyze</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-[52px] z-30">
        <div className="max-w-5xl mx-auto flex">
          {(['dashboard', 'trades', 'setups'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium transition ${
                tab === t ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'
              }`}>
              {t === 'dashboard' ? '📊 Dashboard' : t === 'trades' ? '📝 Trades' : '🎯 Setups'}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-3 py-4 space-y-4">

        {/* ── DASHBOARD ────────────────────────────────────────────────────── */}
        {tab === 'dashboard' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <select value={filterSymbol} onChange={e => setFilterSymbol(e.target.value)}
                className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg border border-gray-700 focus:outline-none">
                <option value="all">All Symbols</option>
                {tradeSymbols.map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={filterAccount} onChange={e => setFilterAccount(e.target.value)}
                className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg border border-gray-700 focus:outline-none">
                <option value="all">All Accounts</option>
                {ACCOUNTS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total P&L', value: `${totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()}`, color: totalPnl >= 0 ? 'text-green-400' : 'text-red-400' },
                { label: 'Win Rate',  value: `${winRate.toFixed(0)}%`,   color: 'text-blue-400' },
                { label: 'Avg Win',   value: `+${avgWin.toFixed(0)}`,    color: 'text-green-400' },
                { label: 'Avg Loss',  value: `${avgLoss.toFixed(0)}`,    color: 'text-red-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                  <div className={`text-xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Cumulative P&L */}
            {cumulativeData.length > 1 && (
              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-3">📈 P&L สะสม</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={cumulativeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      formatter={(v: number) => [v.toLocaleString(), 'P&L สะสม']} />
                    <Line type="monotone" dataKey="cum" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Win Rate + P&L by Account */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-3">🏆 Win Rate</h3>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width={110} height={110}>
                    <PieChart>
                      <Pie data={[{ value: wins.length }, { value: losses.length }]}
                        cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" startAngle={90} endAngle={-270}>
                        <Cell fill="#22c55e" />
                        <Cell fill="#ef4444" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div>
                    <div className="text-3xl font-bold">{winRate.toFixed(0)}%</div>
                    <div className="text-xs text-green-400 mt-1">✅ {wins.length} wins</div>
                    <div className="text-xs text-red-400">❌ {losses.length} losses</div>
                    <div className="text-xs text-gray-400">{filtered.length} trades</div>
                  </div>
                </div>
              </div>

              {accData.length > 0 && (
                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                  <h3 className="text-sm font-semibold mb-3">💼 P&L by Account</h3>
                  <ResponsiveContainer width="100%" height={110}>
                    <BarChart data={accData} barSize={48}>
                      <XAxis dataKey="account" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        formatter={(v: number) => [v.toLocaleString(), 'P&L']} />
                      <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                        {accData.map((e, i) => <Cell key={i} fill={e.pnl >= 0 ? '#22c55e' : '#ef4444'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* P&L by Feeling */}
            {feelingData.length > 0 && (
              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold">🧠 P&L by Feeling</h3>
                <p className="text-xs text-gray-400 mb-3">Feeling ไหนทำกำไรได้ดีสุด — หา Edge ของตัวเอง</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={feelingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="feeling" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      formatter={(v: number) => [v.toLocaleString(), 'P&L รวม']} />
                    <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                      {feelingData.map((e, i) => <Cell key={i} fill={e.pnl >= 0 ? '#3b82f6' : '#ef4444'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* ── TRADES ───────────────────────────────────────────────────────── */}
        {tab === 'trades' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">{trades.length} รายการ</span>
              <button onClick={() => setShowTradeForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl font-medium">
                + บันทึกเทรด
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-500">กำลังโหลด...</div>
            ) : trades.length === 0 ? (
              <div className="text-center py-20 text-gray-500">ยังไม่มีรายการเทรด</div>
            ) : (
              <div className="space-y-2">
                {trades.map((t, i) => (
                  <div key={i} className={`rounded-xl p-3 border ${t.pnl >= 0 ? 'bg-green-900/20 border-green-800/40' : 'bg-red-900/20 border-red-800/40'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm">{t.symbol}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.direction === 'Buy' ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>
                          {t.direction}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">{t.account}</span>
                      </div>
                      <span className={`font-bold text-sm ${t.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {t.pnl >= 0 ? '+' : ''}{t.pnl.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 text-xs text-gray-400">
                      <span>{t.date}</span>
                      <span>In {t.entry}</span>
                      <span>Out {t.exit}</span>
                      {t.size > 0 && <span>{t.size} lot</span>}
                      {t.feeling && <span className="text-purple-400">😌 {t.feeling}</span>}
                    </div>
                    {(t.strategy || t.notes) && (
                      <p className="text-xs text-gray-500 mt-1">{[t.strategy, t.notes].filter(Boolean).join(' · ')}</p>
                    )}
                    <button onClick={() => setDeleteConfirm(t)}
                      className="mt-2 text-xs text-gray-600 hover:text-red-400 transition">
                      🗑 ลบ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SETUPS ───────────────────────────────────────────────────────── */}
        {tab === 'setups' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">{setups.length} setups</span>
              <button onClick={() => setShowAddSetup(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl font-medium">
                + เพิ่ม Setup
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-500">กำลังโหลด...</div>
            ) : setups.length === 0 ? (
              <div className="text-center py-20 text-gray-500">ยังไม่มี Setup</div>
            ) : (
              <div className="space-y-2">
                {setups.map((s, i) => {
                  const score = s.checklist.filter(Boolean).length
                  return (
                    <div key={i} className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold">{s.symbol}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${stageColor(s.stage)}`}>{s.stage}</span>
                        </div>
                        <span className={`text-lg font-bold ${score >= 6 ? 'text-green-400' : score >= 4 ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {score}/8
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                        <div className={`h-2 rounded-full transition-all ${score >= 6 ? 'bg-green-500' : score >= 4 ? 'bg-yellow-500' : 'bg-gray-500'}`}
                          style={{ width: `${score / 8 * 100}%` }} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditSetup({ ...s, checklist: [...s.checklist] })}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs py-2 rounded-lg transition">
                          ✏️ แก้ไข Checklist
                        </button>
                        <button onClick={() => setDeleteSetupConfirm(s)}
                          className="bg-gray-700 hover:bg-red-900/60 text-gray-400 hover:text-red-400 text-xs px-3 py-2 rounded-lg transition">
                          🗑
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Add Trade Modal ────────────────────────────────────────────────── */}
      {showTradeForm && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-gray-900 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-y-auto max-h-[92vh]">
            <div className="bg-gradient-to-r from-gray-800 to-blue-900 px-5 py-4 flex justify-between items-center">
              <h2 className="font-bold">📝 บันทึกเทรดใหม่</h2>
              <button onClick={() => setShowTradeForm(false)} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">วันที่</label>
                <input type="date" value={tradeForm.date} onChange={e => setTradeForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Symbol</label>
                  <select value={tradeForm.symbol} onChange={e => setTradeForm(f => ({ ...f, symbol: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                    {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Direction</label>
                  <div className="flex gap-1 h-[38px]">
                    {(['Buy', 'Sell'] as const).map(d => (
                      <button key={d} onClick={() => setTradeForm(f => ({ ...f, direction: d }))}
                        className={`flex-1 rounded-lg text-sm font-medium transition ${
                          tradeForm.direction === d
                            ? d === 'Buy' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                            : 'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}>{d}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Account</label>
                <div className="flex gap-2">
                  {ACCOUNTS.map(a => (
                    <button key={a} onClick={() => setTradeForm(f => ({ ...f, account: a }))}
                      className={`flex-1 py-2 rounded-lg text-sm transition ${
                        tradeForm.account === a ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>{a}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['entry', 'exit', 'size'] as const).map(k => (
                  <div key={k}>
                    <label className="text-xs text-gray-400 mb-1 block capitalize">{k === 'size' ? 'Lot' : k}</label>
                    <input type="number" step="any" value={tradeForm[k]}
                      onChange={e => setTradeForm(f => ({ ...f, [k]: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">P&L (ใส่ค่าจาก broker)</label>
                <input type="number" step="any" placeholder="+ กำไร  /  - ขาดทุน"
                  value={tradeForm.pnl} onChange={e => setTradeForm(f => ({ ...f, pnl: e.target.value }))}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm font-bold focus:outline-none ${
                    parseFloat(tradeForm.pnl) > 0 ? 'text-green-400 border-green-700 focus:border-green-500' :
                    parseFloat(tradeForm.pnl) < 0 ? 'text-red-400 border-red-700 focus:border-red-500' :
                    'text-white border-gray-700 focus:border-blue-500'
                  }`} />
              </div>

              {[
                { key: 'feeling',  label: 'Feeling ตอนเข้า', placeholder: 'เช่น มั่นใจ / FOMO / ลังเล' },
                { key: 'strategy', label: 'Strategy',         placeholder: 'เช่น H4 Trend, TF15 Break' },
                { key: 'notes',    label: 'Notes',            placeholder: 'บันทึกเพิ่มเติม' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                  <input type="text" placeholder={placeholder}
                    value={tradeForm[key as keyof typeof tradeForm] as string}
                    onChange={e => setTradeForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
              ))}

              <div className="flex gap-2 pt-1 pb-2">
                <button onClick={() => setShowTradeForm(false)}
                  className="flex-1 border border-gray-700 text-gray-400 py-2.5 rounded-xl text-sm">ยกเลิก</button>
                <button onClick={handleAddTrade} disabled={savingTrade || !tradeForm.date || !tradeForm.pnl}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-2.5 rounded-xl text-sm font-semibold">
                  {savingTrade ? 'กำลังบันทึก...' : '💾 บันทึก'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Setup Modal ───────────────────────────────────────────────── */}
      {editSetup && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-gray-900 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-y-auto max-h-[92vh]">
            <div className="bg-gradient-to-r from-gray-800 to-blue-900 px-5 py-4 flex justify-between items-center">
              <div>
                <h2 className="font-bold">🎯 {editSetup.symbol}</h2>
                <p className="text-xs text-blue-300 mt-0.5">{editSetup.checklist.filter(Boolean).length}/8 ผ่าน</p>
              </div>
              <button onClick={() => setEditSetup(null)} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Stage</label>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map(s => (
                    <button key={s} onClick={() => setEditSetup(p => p ? { ...p, stage: s } : null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        editSetup.stage === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>ความคืบหน้า</span>
                  <span className="font-bold text-white">{editSetup.checklist.filter(Boolean).length}/8</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${editSetup.checklist.filter(Boolean).length / 8 * 100}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                {CHECKLIST_ITEMS.map((item, idx) => (
                  <button key={idx}
                    onClick={() => setEditSetup(p => {
                      if (!p) return null
                      const c = [...p.checklist]
                      c[idx] = !c[idx]
                      return { ...p, checklist: c }
                    })}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${
                      editSetup.checklist[idx]
                        ? 'bg-green-900/40 border border-green-700'
                        : 'bg-gray-800/60 border border-gray-700 hover:border-gray-600'
                    }`}>
                    <span className="text-lg leading-none">{editSetup.checklist[idx] ? '✅' : '⬜'}</span>
                    <span className={`text-sm ${editSetup.checklist[idx] ? 'text-green-300' : 'text-gray-400'}`}>{item}</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Notes</label>
                <textarea rows={2} placeholder="บันทึกเพิ่มเติม..."
                  value={editSetup.notes}
                  onChange={e => setEditSetup(p => p ? { ...p, notes: e.target.value } : null)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
              </div>

              <div className="flex gap-2 pb-2">
                <button onClick={() => setEditSetup(null)}
                  className="flex-1 border border-gray-700 text-gray-400 py-2.5 rounded-xl text-sm">ปิด</button>
                <button onClick={() => handleSaveSetup(editSetup)} disabled={savingSetup}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-2.5 rounded-xl text-sm font-semibold">
                  {savingSetup ? 'กำลังบันทึก...' : '💾 บันทึก'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ────────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 w-full max-w-sm rounded-2xl overflow-hidden border border-red-800">
            <div className="px-5 py-5 text-center space-y-3">
              <div className="text-3xl">🗑</div>
              <p className="text-white font-semibold">ยืนยันการลบ?</p>
              <p className="text-gray-400 text-sm">
                {deleteConfirm.symbol} {deleteConfirm.direction} &nbsp;
                <span className={deleteConfirm.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {deleteConfirm.pnl >= 0 ? '+' : ''}{deleteConfirm.pnl.toLocaleString()}
                </span>
              </p>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border border-gray-700 text-gray-400 py-2.5 rounded-xl text-sm">ยกเลิก</button>
                <button onClick={() => handleDeleteTrade(deleteConfirm)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-semibold">ลบ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Setup Confirm ──────────────────────────────────────────── */}
      {deleteSetupConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 w-full max-w-sm rounded-2xl overflow-hidden border border-red-800">
            <div className="px-5 py-5 text-center space-y-3">
              <div className="text-3xl">🗑</div>
              <p className="text-white font-semibold">ลบ Setup นี้?</p>
              <p className="text-gray-400 text-sm font-mono">{deleteSetupConfirm.symbol}</p>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setDeleteSetupConfirm(null)}
                  className="flex-1 border border-gray-700 text-gray-400 py-2.5 rounded-xl text-sm">ยกเลิก</button>
                <button onClick={() => handleDeleteSetup(deleteSetupConfirm)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-semibold">ลบ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Setup Modal ────────────────────────────────────────────────── */}
      {showAddSetup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 w-full max-w-sm rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-blue-900 px-5 py-4 flex justify-between items-center">
              <h2 className="font-bold">+ เพิ่ม Setup ใหม่</h2>
              <button onClick={() => setShowAddSetup(false)} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-2 block">เลือก Symbol</label>
                <div className="grid grid-cols-3 gap-2">
                  {[...PRODUCTS, '__custom__'].map(p => (
                    <button key={p} onClick={() => setNewSymbol(p)}
                      className={`py-2 rounded-lg text-xs font-medium transition ${
                        newSymbol === p ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>{p === '__custom__' ? 'อื่นๆ...' : p}</button>
                  ))}
                </div>
              </div>
              {newSymbol === '__custom__' && (
                <input type="text" placeholder="พิมพ์ชื่อ symbol..."
                  value={customSymbol} onChange={e => setCustomSymbol(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
              )}
              <div className="flex gap-2 pt-1">
                <button onClick={() => setShowAddSetup(false)}
                  className="flex-1 border border-gray-700 text-gray-400 py-2.5 rounded-xl text-sm">ยกเลิก</button>
                <button onClick={handleAddSetup} disabled={savingSetup}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-2.5 rounded-xl text-sm font-semibold">
                  {savingSetup ? '...' : '+ เพิ่ม'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
