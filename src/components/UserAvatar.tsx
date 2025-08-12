import React from 'react'

interface Props {
  id?: string
  name?: string
  email: string
  size?: number
  onClick?: () => void
  highlight?: boolean
}

export default function UserAvatar({ name, email, size = 32, onClick, highlight }: Props) {
  const initial = (name || email || 'U').charAt(0).toUpperCase()
  const style: React.CSSProperties = { width: size, height: size }

  return (
    <button
      type="button"
      onClick={onClick}
      title={name || email}
      className={`rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-black font-semibold flex items-center justify-center border ${highlight ? 'border-white' : 'border-white/10'} shadow-sm`}
      style={style}
    >
      <span style={{ fontSize: size * 0.45 }}>{initial}</span>
    </button>
  )
} 