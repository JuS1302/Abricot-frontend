type ButtonProps = {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  className?: string
  // aria-label utile quand plusieurs boutons ont le même texte (ex: plusieurs "Voir" dans une liste)
  'aria-label'?: string
}

export default function Button({ children, type = 'button', onClick, disabled = false, className = '', 'aria-label': ariaLabel }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        h-[50px] rounded-[10px] px-[74px] gap-[10px]
        bg-text-primary text-white
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
