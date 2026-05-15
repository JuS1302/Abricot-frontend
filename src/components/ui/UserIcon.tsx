type UserIconProps = {
  initials: string
  className?: string
}

export default function UserIcon({ initials, className = '' }: UserIconProps) {
  return (
    <div
      className={`w-[65px] h-[65px] rounded-full bg-primary-light flex items-center justify-center ${className}`}
      style={{ padding: '21px 12px', gap: '10px' }}
    >
      <span className="text-base font-normal font-sans text-text-primary">
        {initials}
      </span>
    </div>
  )
}
