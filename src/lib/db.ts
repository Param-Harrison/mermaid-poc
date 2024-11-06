import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'src/lib/data/configs.json')

export interface MermaidConfig {
  id: string
  title: string
  config: string
}

export function getConfigs(): MermaidConfig[] {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
    return data.configs
  } catch (error) {
    console.error('Error reading configs:', error)
    return []
  }
}

export function addConfig(title: string, config: string): MermaidConfig | null {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
    if (data.configs.length >= 20) {
      return null
    }

    const newConfig = {
      id: Date.now().toString(),
      title,
      config
    }

    data.configs.push(newConfig)
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
    return newConfig
  } catch (error) {
    console.error('Error adding config:', error)
    return null
  }
}

export function deleteConfig(id: string): boolean {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
    data.configs = data.configs.filter((c: MermaidConfig) => c.id !== id)
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error deleting config:', error)
    return false
  }
}

export function updateConfig(id: string, title: string, config: string): MermaidConfig | null {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
    const index = data.configs.findIndex((c: MermaidConfig) => c.id === id)
    
    if (index === -1) return null
    
    const updatedConfig = {
      ...data.configs[index],
      title,
      config
    }
    
    data.configs[index] = updatedConfig
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
    return updatedConfig
  } catch (error) {
    console.error('Error updating config:', error)
    return null
  }
} 