'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="border-b dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
            >
              Mermaid Playground
            </Link>
            <nav className="flex gap-4">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {isMounted ? children : null}
      </main>

      <footer className="border-t dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Built with Next.js and Mermaid
            </p>
            <div className="flex gap-4">
              <a
                href="https://mermaid.js.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Mermaid Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}