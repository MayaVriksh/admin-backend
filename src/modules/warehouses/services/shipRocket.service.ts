import ShipRocketRepository from "../repositories/shipRocket.repository";

interface FetchProductsParams {
    collection_id?: string;
    page: number;
    limit: number;
}

interface FetchCollectionsParams {
    page: number;
    limit: number;
}

const ShipRocketService = {
    /*
     * Fetch all products (optionally filtered by collection) and format for ShipRocket
     */
    async fetchProducts({ page, limit }: FetchProductsParams) {
        return this._formatProducts(
            await ShipRocketRepository.fetchProducts({ page, limit })
        );
    },

    /*
     * Fetch products filtered by collection/category and format for ShipRocket
     */
    async fetchProductsByCollection({
        collection_id,
        page,
        limit
    }: FetchProductsParams) {
        if (!collection_id) throw new Error("collection_id is required");
        return this._formatProducts(
            await ShipRocketRepository.fetchProducts({
                collection_id,
                page,
                limit
            })
        );
    },

    /*
     * Fetch collections and format for ShipRocket
     */
    async fetchCollections({ page, limit }: FetchCollectionsParams) {
        const { total, collections } =
            await ShipRocketRepository.fetchCollections({ page, limit });

        const formattedCollections = collections.map((c) => ({
            id: c.categoryId,
            title: c.name,
            body_html: `<p>${c.description}</p>`,
            handle: c.name.toLowerCase().replace(/\s+/g, "-"),
            created_at: c.createdAt,
            updated_at: c.updatedAt,
            image: { src: c.mediaUrl || null }
        }));

        return { data: { total, collections: formattedCollections } };
    },

    /*
     * Internal helper to format products for ShipRocket
     */
    async _formatProducts({ total, plants }: any) {
        const formattedProducts = plants.map((plant: any) => ({
            id: plant.plantId,
            title: plant.name,
            body_html: `<p>${plant.description}</p>`,
            vendor: "MayaVriksh",
            product_type: "Plant",
            created_at: plant.createdAt,
            handle: plant.name.toLowerCase().replace(/\s+/g, "-"),
            updated_at: plant.updatedAt,
            tags: plant.benefits?.join(", ") || "",
            status: plant.isProductActive ? "active" : "inactive",
            variants: plant.variants.map((variant: any) => {
                const weightInGram = Number(variant.size?.weight || 0) * 1000;

                return {
                    id: variant.variantId,
                    title: variant.color?.name || "Default",
                    price: variant.plantWarehouseInventory?.trueCostPrice.toString(),
                    compare_at_price: variant.mrp.toString(),
                    sku: variant.sku,
                    quantity: variant.plantWarehouseInventory?.currentStock,
                    created_at: variant.createdAt,
                    updated_at: variant.updatedAt,
                    taxable: true,
                    option_values: {
                        Color: variant.color?.name,
                        Size: variant.size?.plantSize
                    },
                    grams: Number(weightInGram),
                    image: {
                        src:
                            variant.plantVariantImages.find(
                                (img: any) => img.isPrimary
                            )?.mediaUrl || null
                    },
                    weight: Number(variant.size?.weight || 0),
                    weight_unit: "kg"
                };
            }),
            image: {
                src:
                    plant.variants.find(
                        (v: any) => v.plantVariantImages.length > 0
                    )?.plantVariantImages[0].mediaUrl || null
            },
            options: [
                {
                    name: "Color",
                    values: [
                        ...new Set(
                            plant.variants
                                .map((v: any) => v.color?.name)
                                .filter(Boolean)
                        )
                    ]
                },
                {
                    name: "Size",
                    values: [
                        ...new Set(
                            plant.variants
                                .map((v: any) => v.size?.plantSize)
                                .filter(Boolean)
                        )
                    ]
                }
            ]
        }));

        return { data: { total, products: formattedProducts } };
    }
};

export default ShipRocketService;
