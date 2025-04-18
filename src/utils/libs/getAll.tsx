import { createServerFn } from '@tanstack/react-start'
import fs from 'fs/promises'
import path from 'path'

export const getAllLibs = createServerFn({ method: 'GET' }).handler(async () => {
    const libs = await fs.readdir(path.join('./src/components/libs'))
    return libs as string[]
})