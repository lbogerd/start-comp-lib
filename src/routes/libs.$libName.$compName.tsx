import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useState } from 'react'
import type { ComponentType } from 'react'
import { getComp } from '~/utils/comps/get'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

export const Route = createFileRoute('/libs/$libName/$compName')({
  loader: async ({ params: { libName, compName } }) => {
    return await getComp({ data: `${libName}/${compName}.tsx` })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const data = Route.useLoaderData()

  const [Cmp, setCmp] = useState<ComponentType<any>[] | null>(null)

  useEffect(() => {
    import(`../components/libs/${params.libName}/${params.compName}.tsx`).then((mod) => {
      setCmp(() => {
        return Object.keys(mod).map((key) => mod[key])
      })
    })
  }, [params.libName, params.compName])

  return (
    <div>
      <SyntaxHighlighter 
        language="typescript"
        style={vscDarkPlus}
        showLineNumbers={true}
        wrapLines={true}
        customStyle={{
          borderRadius: '4px',
          padding: '1em',
          margin: '1em 0'
        }}
      >
        {data}
      </SyntaxHighlighter>
      {Cmp ? Cmp.map((Cmp) => <Cmp>asdf</Cmp>) : <span>Loading...</span>}
    </div>
  )
}
