const assets = import.meta.env.VITE_ASSETS;

export const useImage = (images: string) => {
    if (!images) {
        return `${assets}/assets/placeholders/products.jpg`;
    }

    const first = images.split(",")[0];
    return first ? `${assets}/products/${first}` : `${assets}/assets/placeholders/products.jpg`;
};

export const useAsset = (image: string) => {
    return `${assets}/products/${image}`;
};
