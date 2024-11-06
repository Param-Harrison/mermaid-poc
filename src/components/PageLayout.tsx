 import React from 'react'

interface PageLayoutProps {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <header className="border-b dark:border-gray-800">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Mermaid Playground by Jobbatical
          </h1>
        </div>
      </header>

      <div className="flex-grow">
        {children}
      </div>

      <footer className="border-t dark:border-gray-800 mt-8">
        <div className="max-w-4xl mx-auto p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          POC by Jobbatical OÜ
        </div>
      </footer>
    </main>
  )
}