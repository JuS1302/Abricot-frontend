type ButtonProps = {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export default function Button({ children, type = 'button', onClick, disabled = false, className = '' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        h-[50px] rounded-[10px] px-[74px] gap-[10px]
        bg-text-primary text-white
        text-base font-normal font-sans
        flex items-center justify-center
        transition-opacity disabled:opacity-50 cursor-pointer
        ${className}
      `}
    >
      {children}
    </button>
  )
}
