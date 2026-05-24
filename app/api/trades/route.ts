import { NextRequest, NextResponse } from 'next/server'
import { getTrades, addTrade, deleteTrade } from '@/lib/sheets'

export async function GET() {
  try {
    return NextResponse.json(await getTrades())
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await addTrade(await req.json())
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { rowIndex } = await req.json()
    await deleteTrade(rowIndex)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
