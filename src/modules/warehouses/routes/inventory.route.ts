import InventoryController from "../controllers/inventory.controller.js";
import { listWarehouseInventoryValidation } from "../validations/inventory.validator.js";
import { verifyAccessTokenMiddleware, requireRole } from "../../../middlewares/authenticate.middleware.js";
import { ROLES } from "../../../constants/roles.constant.js";
import { handleValidationFailure } from "../../../utils/failActionValidation.js";

const inventoryRoutes = [
    {
        method: "GET",
        path: "/admin/warehouse/{warehouseId}/inventory",
        options: {
            tags: ["api", "Warehouse Inventory"],
            description: "Get a paginated and filterable list of all plant inventory for a specific warehouse.",
            pre: [
                verifyAccessTokenMiddleware,
                requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.WAREHOUSE_MANAGER])
            ],
            validate: {
                ...listWarehouseInventoryValidation,
                failAction: handleValidationFailure,
            },
            handler: InventoryController.listWarehouseInventory,
        }
    }
];

export default inventoryRoutes;

