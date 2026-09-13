type ButtonProps = {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'solid' | 'outline'
  onClick?: () => void
  disabled?: boolean
  className?: string
  // aria-label utile quand plusieurs boutons ont le même texte (ex: plusieurs "Voir" dans une liste)
  'aria-label'?: string
}

const variantStyles = {
  solid: 'bg-text-primary text-white',
  outline: 'bg-white text-text-primary border border-text-primary',
}

export default function Button({ children, type = 'button', variant = 'solid', onClick, disabled = false, className = '', 'aria-label': ariaLabel }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        h-[50px] rounded-[10px] px-[20px] gap-[10px]
        ${variantStyles[variant]}
        text-base font-normal font-sans
        flex items-center justify-center
        transition-opacity disabled:opacity-50 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${className}
      `}
    >
      {children}
    </button>
  )
}
