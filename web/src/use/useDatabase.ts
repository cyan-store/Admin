export function useStock(stock: string) {
    return {
        IN_STOCK: "In Stock",
        OUT_STOCK: "Out of Stock",
        DISCONTINUED: "Discontinued",
        HIDDEN: "Hidden",
    }[stock];
}
