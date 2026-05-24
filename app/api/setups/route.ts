import { NextRequest, NextResponse } from 'next/server'
import { getSetups, addSetup, updateSetup, deleteSetup } from '@/lib/sheets'

export async function GET() {
  try {
    return NextResponse.json(await getSetups())
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await addSetup(await req.json())
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await updateSetup(await req.json())
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { rowIndex } = await req.json()
    await deleteSetup(rowIndex)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
