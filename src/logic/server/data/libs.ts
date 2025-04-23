import { Registry } from "~/logic/shared/types"; import { glob, globSync } from 'tinyglobby';
import path from "path";


export const getLibs = async (): Promise<Registry[]> => {
    // get the name of all folders in the libs directory
    const libs = (await glob({ cwd: 'src/components/libs', onlyDirectories: true, deep: 1, expandDirectories: false })).sort((a, b) => a.localeCompare(b));

    // loop through each lib and add the items
    const registry: Registry[] = [];
    for (const lib of libs) {
        const libItems = await glob("**/*.{js,ts,jsx,tsx}", { cwd: `src/components/libs/${lib}` });

        registry.push({
            name: lib.slice(0, -1),
            homepage: `http://localhost:3000/libs/${lib}`,
            items: libItems.sort((a, b) => a.localeCompare(b)).map((item) => {
                return {
                    name: item,
                    // TODO: make this dynamic based on either the file name or the file's frontmatter
                    type: "registry:lib",
                }
            }),
        });
    }

    return registry;
}