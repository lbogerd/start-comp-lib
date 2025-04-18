import { createServerFn } from "@tanstack/react-start";
import path from "path";
import fs from "fs/promises";

export const getLibComps = createServerFn({ method: 'GET' })
    .validator((d: string) => d)
    .handler(async ({ data }) => {
        // get all files in the respective lib folder
        const lib = (await fs.readdir(path.join('./src/components/libs', data))).map((comp) => comp.replace('.tsx', ''))
        return lib
    })
    