'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Modal from '@/components/Modal'
import PageLayout from '@/components/PageLayout'

interface MermaidConfig {
  id: string
  title: string
  config: string
}

export default function Home() {
  const [configs, setConfigs] = useState<MermaidConfig[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [mermaidConfig, setMermaidConfig] = useState('')

  useEffect(() => {
    fetch('/api/configs')
      .then(res => res.json())
      .then(data => setConfigs(data))
      .catch(console.error);
  }, []);

  const addConfig = async () => {
    if (!title || !mermaidConfig) return;
    
    const response = await fetch('/api/configs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, config: mermaidConfig })
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error);
      return;
    }

    const newConfig = await response.json();
    setConfigs([newConfig, ...configs]);
    setTitle('');
    setMermaidConfig('');
    setIsOpen(false);
  };

  const deleteConfig = async (id: string) => {
    try {
      const response = await fetch('/api/configs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to delete config');
        return;
      }
      
      setConfigs(configs.filter(c => c.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete config');
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2">
              <button
                onClick={() => setIsOpen(true)}
                disabled={configs.length >= 20}
                className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add New Config
              </button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {configs.length}/20 configs used
                {configs.length >= 20 && (
                  <span className="text-red-500 dark:text-red-400 block sm:inline sm:ml-1">
                    (limit reached - please delete some configs)
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 text-sm">
            <a
              href="https://mermaid.js.org/intro/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              📚 Mermaid Documentation
            </a>
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <a
              href="https://mermaid.live/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              🔨 Live Editor
            </a>
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <a
              href="https://mermaid.js.org/syntax/flowchart.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              📊 Syntax Guide
            </a>
          </div>
        </div>

        {configs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No configurations yet. Click &quot;Add New Config&quot; to create one.
              <br />
              <span className="text-sm">
                (Maximum 20 configurations allowed)
              </span>
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {configs.map((config) => (
              <div key={config.id} className="flex justify-between items-center p-6 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <a 
                  href={`/show/${config.id}`}
                  className="flex-grow"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {config.title}
                  </h2>
                </a>
                <div className="flex gap-2">
                  <a
                    href={`/edit/${config.id}`}
                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => deleteConfig(config.id)}
                    className="px-4 py-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Add New Mermaid Config
          </h2>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Config Title"
            className="w-full p-2 border dark:border-gray-700 rounded-md mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />

          <textarea
            value={mermaidConfig}
            onChange={(e) => setMermaidConfig(e.target.value)}
            placeholder="Enter Mermaid Config"
            className="w-full p-2 border dark:border-gray-700 rounded-md mb-4 h-48 font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addConfig}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Save
            </button>
          </div>
        </Modal>
      </div>
    </PageLayout>
  )
}