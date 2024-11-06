'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import mermaid from 'mermaid'
import PageLayout from '@/components/PageLayout'

interface MermaidConfig {
  id: string
  title: string
  config: string
}

export default function EditPage() {
  const params = useParams()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [config, setConfig] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/configs')
      .then(res => res.json())
      .then(data => {
        const current = data.find((c: MermaidConfig) => c.id === params.id)
        if (current) {
          setTitle(current.title)
          setConfig(current.config)
          renderPreview(current.config)
        }
      })
      .catch(console.error)
  }, [params.id])

  const renderPreview = async (configText: string) => {
    try {
      const element = document.querySelector('#preview-diagram')
      if (element) {
        element.innerHTML = ''
        mermaid.initialize({ startOnLoad: true })
        const { svg } = await mermaid.render('preview-svg', configText)
        element.innerHTML = svg
        setError('')
      }
    } catch (error) {
      console.error('Preview error:', error)
      setError('Invalid mermaid syntax')
    }
  }

  const handleConfigChange = (value: string) => {
    setConfig(value)
    renderPreview(value)
  }

  const handleSubmit = async () => {
    if (!title || !config) {
      setError('Please fill in all fields')
      return
    }

    try {
      const response = await fetch(`/api/configs/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, config })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error)
        return
      }

      router.push(`/show/${params.id}`)
    } catch (error) {
      console.error(error)
      setError('Failed to update config')
    }
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <Link
            href={`/show/${params.id}`}
            className="text-black dark:text-white hover:underline"
          >
            ← Back to Diagram
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Configuration
            </h2>
            
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Config Title"
              className="w-full p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />

            <textarea
              value={config}
              onChange={(e) => handleConfigChange(e.target.value)}
              placeholder="Enter Mermaid Config"
              className="w-full p-2 border dark:border-gray-700 rounded-md h-[400px] font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />

            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Save Changes
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Preview
            </h2>
            
            <div 
              id="preview-diagram" 
              className="p-4 bg-white rounded-lg shadow-sm overflow-x-auto"
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}