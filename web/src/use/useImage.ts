const assets = import.meta.env.VITE_ASSETS;

export function useImage(images: string) {
    if (!images) {
        return `${assets}/assets/placeholders/products.jpg`;
    }

    const first = images.split(",")[0];
    return first ? `${assets}/products/${first}` : `${assets}/assets/placeholders/products.jpg`;
}

export function useAsset(image: string) {
    return `${assets}/products/${image}`;
}

export function useSite(image: string) {
    return `${assets}/assets/site/${image}`;
}
