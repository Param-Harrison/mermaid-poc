'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import mermaid from 'mermaid'
import Link from 'next/link'
import PageLayout from '@/components/PageLayout'
import { FaMobileAlt, FaTabletAlt, FaLaptop } from 'react-icons/fa';
import { MdOutlineFullscreen } from 'react-icons/md';
import { IoArrowBack } from 'react-icons/io5';
import { FiEdit } from 'react-icons/fi';
import { BiCodeAlt } from 'react-icons/bi';

interface MermaidConfig {
  id: string
  title: string
  config: string
}

type DeviceSize = 'mobile' | 'tablet' | 'desktop' | 'auto';

export default function ShowPage() {
  const params = useParams()
  const [configs, setConfigs] = useState<MermaidConfig[]>([])
  const [selectedConfig, setSelectedConfig] = useState<MermaidConfig | null>(null)
  const [devicePreview, setDevicePreview] = useState<DeviceSize>('auto')

  useEffect(() => {
    fetch('/api/configs')
      .then(res => res.json())
      .then(data => {
        setConfigs(data);
        const current = data.find((c: MermaidConfig) => c.id === params.id);
        setSelectedConfig(current || null);
      })
      .catch(console.error);
  }, [params.id]);

  useEffect(() => {
    if (selectedConfig) {
      mermaid.initialize({ startOnLoad: true })
      try {
        const element = document.querySelector('#mermaid-diagram')
        if (element) {
          element.innerHTML = ''
          mermaid.render('preview-svg', selectedConfig.config)
            .then(({ svg }) => {
              element.innerHTML = svg
            })
        }
      } catch (error) {
        console.error('Failed to render diagram:', error)
      }
    }
  }, [selectedConfig])

  const getDevicePreviewClass = (size: DeviceSize) => {
    switch (size) {
      case 'mobile':
        return 'max-w-[375px]'
      case 'tablet':
        return 'max-w-[768px]'
      case 'desktop':
        return 'max-w-[1024px]'
      default:
        return 'w-full'
    }
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-black dark:text-white hover:underline group"
            >
              <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Configs</span>
            </Link>
            
            <select
              value={selectedConfig?.id || ''}
              onChange={(e) => {
                const newConfig = configs.find(c => c.id === e.target.value)
                setSelectedConfig(newConfig || null)
              }}
              className="w-full sm:w-auto p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            >
              <option value="">Select a config</option>
              {configs.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <a
              href="https://mermaid.js.org/intro/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              📚 Learn Mermaid
            </a>
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <a
              href="https://mermaid.live/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              🔨 Try Live Editor
            </a>
          </div>
        </div>

        {selectedConfig ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedConfig.title}
              </h2>
              <Link
                href={`/edit/${selectedConfig.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                <FiEdit className="text-lg" />
                <span>Edit</span>
              </Link>
            </div>

            <div className="relative w-full">
              <div className="border dark:border-gray-700 rounded-lg bg-white overflow-hidden">
                <div className="border-b dark:border-gray-700 p-2 flex justify-end gap-2 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Preview Size:
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDevicePreview('mobile')}
                        className={`p-2 rounded-md transition-colors inline-flex items-center gap-2 ${
                          devicePreview === 'mobile'
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        title="Mobile view (375px)"
                      >
                        <FaMobileAlt />
                        <span className="text-sm">Mobile</span>
                      </button>
                      <button
                        onClick={() => setDevicePreview('tablet')}
                        className={`p-2 rounded-md transition-colors inline-flex items-center gap-2 ${
                          devicePreview === 'tablet'
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        title="Tablet view (768px)"
                      >
                        <FaTabletAlt />
                        <span className="text-sm">Tablet</span>
                      </button>
                      <button
                        onClick={() => setDevicePreview('desktop')}
                        className={`p-2 rounded-md transition-colors inline-flex items-center gap-2 ${
                          devicePreview === 'desktop'
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        title="Desktop view (1024px)"
                      >
                        <FaLaptop />
                        <span className="text-sm">Desktop</span>
                      </button>
                      <button
                        onClick={() => setDevicePreview('auto')}
                        className={`p-2 rounded-md transition-colors inline-flex items-center gap-2 ${
                          devicePreview === 'auto'
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        title="Auto (Full width)"
                      >
                        <MdOutlineFullscreen />
                        <span className="text-sm">Full</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-full overflow-x-auto p-4">
                  <div className={`mx-auto transition-all duration-300 ${getDevicePreviewClass(devicePreview)}`}>
                    <div 
                      id="mermaid-diagram" 
                      className="w-full min-h-[200px] flex items-center justify-center"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <BiCodeAlt className="text-lg" />
                <span>Config Source</span>
              </h3>
              <pre className="text-sm overflow-x-auto p-2 bg-white dark:bg-gray-900 rounded border dark:border-gray-700">
                <code>{selectedConfig.config}</code>
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p className="text-gray-500 dark:text-gray-400">
              Select a configuration to view the diagram
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  )
} 