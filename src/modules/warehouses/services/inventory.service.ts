import WarehouseInventoryRepository from "../repositories/inventory.repository.js";

class InventoryService {
    // A private helper function to transform the nested DB object into a clean, flat response for the UI
    _transformInventoryItem(item) {
        if (!item) return null;

        const { plants, plantVariant, ...restOfItem } = item;
        console.log("Transforming Item:", plants); // Debug log
        console.log("Transforming Item Variant:", plantVariant); // Debug log
        return {
            inventoryId: restOfItem.id,
            currentStock: restOfItem.currentStock,
            sku: plantVariant.sku,
            variantName: `${plants.name} - ${plantVariant.size.plantSize}, ${plantVariant.color.name}`
        };
    }

    async findAllWarehouseInventory(warehouseId, filters) {
        const { page, limit } = filters;
        const { inventoryItems, total } = await WarehouseInventoryRepository.findAll({ warehouseId, ...filters });
        console.log("Fetched Inventory Items:", inventoryItems); // Debug log
        console.log("Total Items Count:", total); // Debug log
        const transformedItems = inventoryItems.map(this._transformInventoryItem);

        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            code: 200,
            message: "Warehouse inventory retrieved successfully.",
            data: {
                inventory: transformedItems,
                pagination: {
                    totalItems: total,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            }
        };
    }
}

export default new InventoryService();