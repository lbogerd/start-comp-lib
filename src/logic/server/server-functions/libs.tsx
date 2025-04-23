import { createServerFn } from "@tanstack/react-start";
import { getLibs } from "../data/libs";

export const getLibsServerFn = createServerFn({ method: 'GET' }).handler(async () => {
    return await getLibs();
});
