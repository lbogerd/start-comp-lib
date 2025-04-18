import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useState } from 'react'
import type { ComponentType } from 'react'
import { getComp } from '~/utils/comps/get'
export const Route = createFileRoute('/libs/$libName/$compName')({
  loader: async ({ params: { libName, compName } }) => {
    return await getComp({ data: `${libName}/${compName}.tsx` })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const data = Route.useLoaderData()

  const [Cmp, setCmp] = useState<ComponentType<any> | null>(null)

  useEffect(() => {
    import(`../components/libs/${params.libName}/${params.compName}.tsx`).then((mod) => {
      setCmp(() => mod.default)
    })
  }, [params.libName, params.compName])

  return (
    <div>
      <pre className="bg-gray-100 max-w-md p-4 rounded-md overflow-auto">
        {data}
      </pre>
      {Cmp ? <Cmp>Your Children Here</Cmp> : <span>Loading...</span>}
    </div>
  )
}
