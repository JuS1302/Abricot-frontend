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
      className={`text-sm font-sans text-primary underline hover:opacity-75 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:rounded-sm ${className}`}
    >
      {children}
    </NextLink>
  )
}
