import InventoryService from "../services/inventory.service.js";

class InventoryController {
    async listWarehouseInventory(req, h) {
        try {
            const { warehouseId } = req.params;
            const filters = req.query;
            const result = await InventoryService.findAllWarehouseInventory(warehouseId, filters);
            return h.response(result).code(result.code);
        } catch (error) {
            console.error("List Warehouse Inventory Controller Error:", error);
            return h.response({ success: false, message: error.message }).code(error.code || 500);
        }
    }
}

export default new InventoryController();

