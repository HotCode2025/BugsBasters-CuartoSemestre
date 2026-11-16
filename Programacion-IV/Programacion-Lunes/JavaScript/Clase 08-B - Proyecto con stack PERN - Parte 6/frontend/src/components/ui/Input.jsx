import React from 'react'

export function Input({ type = "text", placeholder, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full bg-zinc-800 text-white px-4 py-2 rounded-md my-2 block border border-zinc-700 focus:outline-none focus:border-blue-500"
      {...props}
    />
  )
}
