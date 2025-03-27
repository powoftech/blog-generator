import { Suspense } from 'react'
import SearchBox from './_components/search-box'
import SearchResults from './_components/search-results'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  let query = (await searchParams).query || ''
  const page = (await searchParams).page
  if (Array.isArray(query)) {
    query = query[0]
  }

  return (
    <>
      <div className="relative">
        <div className="mx-auto max-w-7xl px-2">
          <SearchBox />
          <hr className="border-foreground/5 mt-3 mb-3"></hr>
          <Suspense key={query}>
            <SearchResults query={query} page={page} />
          </Suspense>
        </div>
      </div>
    </>
  )
}
