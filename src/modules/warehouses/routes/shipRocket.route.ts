import { ServerRoute } from "@hapi/hapi";
import ShipRocketController from "../controllers/shipRocket.controller";
// import { verifyAccessTokenMiddleware } from "../../../middlewares/authenticate.middleware";
import ShipRocketValidator from "../validations/shipRocket.validator";
import { handleValidationFailure } from "../../../utils/failActionValidation";

const shipRocketRoutes: ServerRoute[] = [
    {
        method: "GET",
        path: "/shiprocket/products",
        options: {
            tags: ["api", "ShipRocket"],
            description:
                "Fetch products (optionally by collection_id) from ShipRocket.",
            // pre: [verifyAccessTokenMiddleware],
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
            description: "Fetch all product collections from ShipRocket.",
            // pre: [verifyAccessTokenMiddleware],
            validate: {
                ...ShipRocketValidator.fetchCollectionsValidation,
                failAction: handleValidationFailure
            },
            handler: ShipRocketController.fetchCollections
        }
    }
];

export default shipRocketRoutes;
