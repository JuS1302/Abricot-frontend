type UserIconProps = {
  initials: string
  size?: 'sm' | 'md'
  className?: string
}

export default function UserIcon({ initials, size = 'md', className = '' }: UserIconProps) {
  const sizeClasses = size === 'sm'
    ? 'w-[30px] h-[30px]'
    : 'w-[65px] h-[65px]'

  const textClasses = size === 'sm' ? 'text-xs' : 'text-base'

  return (
    <div
      className={`${sizeClasses} rounded-full bg-primary-light flex items-center justify-center ${className}`}
      style={size === 'md' ? { padding: '21px 12px', gap: '10px' } : undefined}
    >
      <span className={`${textClasses} font-normal font-sans text-text-primary`}>
        {initials}
      </span>
    </div>
  )
}
