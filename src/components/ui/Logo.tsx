import Link from 'next/link'
import Image from 'next/image'

export default function Logo() {
  return (
    <Link href="/dashboard">
      <Image src="/Logo.svg" alt="Abricot" width={147} height={19} />
    </Link>
  )
}
