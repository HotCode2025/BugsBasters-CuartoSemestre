import React from 'react'

export function Card({ children }) {
  return (
    <div className="bg-zinc-900 p-14 rounded-md w-full max-w-md">{children}</div>
  )
}
