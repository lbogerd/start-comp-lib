import { createServerFn } from "@tanstack/react-start";
import path from "path";
import fs from "fs/promises";

export const getComp = createServerFn({ method: 'GET' }).validator((d: string) => d).handler(async ({ data }) => {
    const comp = await fs.readFile(path.join('./src/components/libs', data), 'utf8')
    return comp
})
