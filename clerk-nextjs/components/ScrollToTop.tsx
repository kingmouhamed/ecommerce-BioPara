'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function ScrollToTopHandler() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, searchParams])

  return null
}

export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopHandler />
    </Suspense>
  )
}
