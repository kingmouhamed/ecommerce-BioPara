'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, searchParams])

  return null
}
