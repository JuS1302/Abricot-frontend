type InputProps = {
  label: string
  name: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export default function Input({ label, name, type = 'text', placeholder, value, onChange, className = '' }: InputProps) {
  return (
    <div className={`flex flex-col gap-[7px] ${className}`}>
      <label htmlFor={name} className="text-sm font-sans text-text-primary">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          h-[53px] rounded-[4px] border border-border
          px-[17px]
          text-base font-sans text-text-primary
          placeholder:text-text-disabled
          outline-none focus:border-primary focus:ring-2 focus:ring-primary/30
          bg-white
        "
      />
    </div>
  )
}
