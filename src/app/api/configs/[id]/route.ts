import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Config } from '@/lib/types'

// GET handler
export async function GET(
  _request: any,
  context: any
) {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/data/configs.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    const configs = data.configs || []
    
    const config = configs.find((c: Config) => c.id === context.params.id)
    if (!config) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 })
    }

    return NextResponse.json(config)
  } catch (err) {
    console.error('GET error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// PUT handler
export async function PUT(
  request: any,
  context: any
) {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/data/configs.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    const configs = data.configs || []
    
    const { title, config: configContent } = await request.json()
    const configIndex = configs.findIndex((c: Config) => c.id === context.params.id)
    
    if (configIndex === -1) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 })
    }
    
    const updatedConfig = {
      ...configs[configIndex],
      title,
      config: configContent,
      updated_at: new Date().toISOString()
    }
    
    configs[configIndex] = updatedConfig
    data.configs = configs
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    return NextResponse.json(updatedConfig)
  } catch (err) {
    console.error('PUT error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE handler
export async function DELETE(
  _request: any,
  context: any
) {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/data/configs.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    const configs = data.configs || []
    
    const configIndex = configs.findIndex((c: Config) => c.id === context.params.id)
    if (configIndex === -1) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 })
    }
    
    configs.splice(configIndex, 1)
    data.configs = configs
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    return NextResponse.json({ message: 'Config deleted successfully' })
  } catch (err) {
    console.error('DELETE error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 