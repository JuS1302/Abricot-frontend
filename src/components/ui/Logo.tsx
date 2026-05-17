import Link from 'next/link'
import Image from 'next/image'

type LogoProps = {
  width?: number
  height?: number
  className?: string
}

export default function Logo({ width = 147, height = 19, className = '' }: LogoProps) {
  return (
    <Link href="/dashboard" className={className}>
      <Image src="/Logo.svg" alt="Abricot" width={width} height={height} />
    </Link>
  )
}
