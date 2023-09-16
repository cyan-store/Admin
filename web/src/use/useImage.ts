const assets = import.meta.env.VITE_ASSETS;

export const useImage = (images: string) => {
    const first = images.split(",")[0];

    return first
        ? `${assets}/products/${first}`
        : `${assets}/assets/placeholders/products.jpg`;
};
