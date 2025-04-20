import { createServerFn } from "@tanstack/react-start";
import path from "path";
import fs from "fs/promises";

export const getAllLibs = createServerFn({ method: 'GET' }).handler(async () => {
    const libs = await fs.readdir(path.join('./src/components/libs'))
    return libs as string[]
})

export const getLibComps = createServerFn({ method: 'GET' })
    .validator((d: string) => d)
    .handler(async ({ data }) => {
        // get all files in the respective lib folder
        const lib = (await fs.readdir(path.join('./src/components/libs', data))).map((comp) => comp.replace('.tsx', ''))
        return lib
    })