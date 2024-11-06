import { NextResponse } from 'next/server'
import { updateConfig } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { title, config } = await request.json()
  
  const updatedConfig = updateConfig(params.id, title, config)
  if (!updatedConfig) {
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    )
  }
  
  return NextResponse.json(updatedConfig)
} 