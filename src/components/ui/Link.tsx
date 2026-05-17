import NextLink from 'next/link'

type LinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

export default function Link({ href, children, className = '' }: LinkProps) {
  return (
    <NextLink
      href={href}
      className={`text-sm font-sans text-primary underline hover:opacity-75 transition-opacity ${className}`}
    >
      {children}
    </NextLink>
  )
}
