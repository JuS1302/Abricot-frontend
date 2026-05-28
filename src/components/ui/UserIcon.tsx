type UserIconProps = {
  initials: string
  size?: 'sm' | 'md'
  color?: 'primary' | 'neutral' | 'active'
  className?: string
}

export default function UserIcon({ initials, size = 'md', color = 'primary', className = '' }: UserIconProps) {
  const sizeClasses = size === 'sm' ? 'w-[27px] h-[27px]' : 'w-[65px] h-[65px]'
  const bgClasses = color === 'neutral' ? 'bg-gray-light' : color === 'active' ? 'bg-primary' : 'bg-primary-light'
  const textColor = color === 'active' ? 'text-white' : 'text-text-primary'
  const textClasses = size === 'sm' ? 'text-[10px]' : 'text-base'
  const style = size === 'sm'
    ? { padding: '8.72px 4.98px', gap: '4.15px' }
    : { padding: '21px 12px', gap: '10px' }

  return (
    <div
      className={`${sizeClasses} ${bgClasses} rounded-full flex items-center justify-center ${className}`}
      style={style}
    >
      <span className={`${textClasses} font-normal font-sans ${textColor}`}>
        {initials}
      </span>
    </div>
  )
}
