import { NextResponse } from 'next/server'
import { getConfigs, addConfig, deleteConfig } from '@/lib/db'

export async function GET() {
  const configs = getConfigs()
  return NextResponse.json(configs)
}

export async function POST(request: Request) {
  const { title, config } = await request.json()
  
  const newConfig = addConfig(title, config)
  if (!newConfig) {
    return NextResponse.json(
      { error: 'Maximum limit of 20 configs reached. Please edit or delete existing configs to add new ones.' },
      { status: 400 }
    )
  }
  
  return NextResponse.json(newConfig)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const success = deleteConfig(id)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Failed to delete config' },
      { status: 500 }
    )
  }
  
  return NextResponse.json({ success: true })
} 