import Link from 'next/link'
import Image from 'next/image'

type LogoProps = {
  width?: number
  height?: number
  className?: string
}

export default function Logo({ width = 147, height = 19, className = '' }: LogoProps) {
  return (
    <Link href="/dashboard" className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:rounded-sm ${className}`}>
      <Image src="/Logo.svg" alt="Abricot" width={width} height={height} />
    </Link>
  )
}
