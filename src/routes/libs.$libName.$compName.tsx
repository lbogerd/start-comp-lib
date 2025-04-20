import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useState } from 'react'
import type { ComponentType } from 'react'
import { getComp } from '~/logic/server/comps'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { ComponentDoc } from 'react-docgen-typescript'
import { PropField } from '~/components/internal/comps/prop-field'
import { Form, useForm } from 'react-hook-form'

export const Route = createFileRoute('/libs/$libName/$compName')({
  loader: async ({ params: { libName, compName } }) => {
    return await getComp({ data: `${libName}/${compName}.tsx` })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const data = Route.useLoaderData()

  const form = useForm({
    defaultValues: {
      children: "Lorem ipsum dolor sit amet"
    }
  })

  const [Cmp, setCmp] = useState<ComponentType<any>[] | null>(null)
  const [componentPropValues, setComponentPropValues] = useState<any>({})

  // Use watch to subscribe to all form changes
  const watchedValues = form.watch();

  useEffect(() => {
    setComponentPropValues(watchedValues);
  }, [watchedValues]);

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
        {data.sourceCode}
      </SyntaxHighlighter>


      <div>
        <Form {...form}>
          <form>
            {JSON.parse(data.docs).map((doc: ComponentDoc) => (
              <>
                <pre>{JSON.stringify(doc, null, 2)}</pre>
                  <PropField 
                    key="children" 
                    meta={{ 
                      name: "children", 
                      type: { name: "string" }, 
                      required: false,
                      description: "",
                      defaultValue: undefined
                    }} 
                    control={form.control} 
                  />
                  {Object.keys(doc.props).map((prop: string) => (
                    <PropField key={prop} meta={doc.props[prop]} control={form.control} />
                  ))}
              </>

            ))}
          </form>
        </Form>
      </div>
      {Cmp ? Cmp.map((Cmp) => <Cmp {...componentPropValues} />) : <span>Loading...</span>}
    </div>
  )
}
