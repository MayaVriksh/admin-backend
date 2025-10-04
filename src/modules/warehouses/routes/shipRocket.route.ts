import { ServerRoute } from "@hapi/hapi";
import ShipRocketController from "../controllers/shipRocket.controller";
import ShipRocketValidator from "../validations/shipRocket.validator";
import { handleValidationFailure } from "../../../utils/failActionValidation";

const shipRocketRoutes: ServerRoute[] = [
    {
        method: "GET",
        path: "/shiprocket/products",
        options: {
            tags: ["api", "ShipRocket"],
            description:
                "Fetch active products from your store in the ShipRocket compatible format. " +
                "Optionally, you can filter products by providing `collection_id` as a query parameter. " +
                "Supports pagination using `page` and `limit` query parameters. " +
                "This endpoint is intended for ShipRocket integration only.",
            validate: {
                ...ShipRocketValidator.fetchProductsValidation,
                failAction: handleValidationFailure
            },
            handler: ShipRocketController.fetchProducts
        }
    },
    {
        method: "GET",
        path: "/shiprocket/collections",
        options: {
            tags: ["api", "ShipRocket"],
            description:
                "Fetch all product collections (categories) from MayaVriksh store in a ShipRocket compatible format. " +
                "Supports pagination using `page` and `limit` query parameters. " +
                "Each collection includes its ID, title, handle, updated timestamp, and an optional image URL. " +
                "This endpoint is intended for ShipRocket integration only.",
            validate: {
                ...ShipRocketValidator.fetchCollectionsValidation,
                failAction: handleValidationFailure
            },
            handler: ShipRocketController.fetchCollections
        }
    }
];

export default shipRocketRoutes;
