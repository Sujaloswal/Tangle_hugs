import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for crochet items..."
          className="w-full px-6 py-4 rounded-full glass-effect border-2 border-blush/30 focus:border-blush focus:outline-none text-yarn placeholder:text-yarn-light/50 shadow-soft"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blush text-white px-7 py-3 rounded-full hover:bg-blush-dark transition-all hover:scale-105 font-medium shadow-soft"
        >
          Search
        </button>
      </div>
    </form>
  )
}
