import manifest from "./media-manifest.json";

const PATH_TO_ID: Record<string, string> = {};
for (const [id, entry] of Object.entries(
    manifest as Record<string, { path: string; mime: string }>,
)) {
    PATH_TO_ID[entry.path] = id;
}

export const mediaUrl = (path: string): string => {
    const id = PATH_TO_ID[path];
    return id ? `/api/m/${id}` : path;
};
