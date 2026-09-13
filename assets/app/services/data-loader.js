const cache = new Map();
export async function loadJSON(url) {
    if (cache.has(url))
        return cache.get(url);
    const request = fetch(url, { cache: 'no-cache' }).then(async (response) => {
        if (!response.ok)
            throw new Error(`Risorsa non disponibile (${response.status})`);
        return response.json();
    });
    cache.set(url, request);
    try {
        return await request;
    }
    catch (error) {
        cache.delete(url);
        throw error;
    }
}
