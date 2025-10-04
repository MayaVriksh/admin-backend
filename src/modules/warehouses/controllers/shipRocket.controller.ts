import { Request, ResponseToolkit } from "@hapi/hapi";
import ShipRocketService from "../services/shipRocket.service";
import { COMMON } from "../../../constants/errorMessages.constant";
import { RESPONSE_CODES } from "../../../constants/responseCodes.constant";

const ShipRocketController = {
    async fetchProducts(request: Request, h: ResponseToolkit) {
        try {
            const {
                collection_id,
                page = 1,
                limit = 20
            } = request.query as {
                collection_id?: string;
                page?: number;
                limit?: number;
            };

            const data = await ShipRocketService.fetchProducts({
                collection_id,
                page,
                limit
            });
            return h.response(data).code(RESPONSE_CODES.SUCCESS);
        } catch (error: any) {
            return h
                .response({ error: COMMON.INTERNAL_SERVER_ERROR })
                .code(RESPONSE_CODES.INTERNAL_SERVER_ERROR);
        }
    },

    async fetchCollections(request: Request, h: ResponseToolkit) {
        try {
            const { page = 1, limit = 20 } = request.query as {
                page?: number;
                limit?: number;
            };

            const data = await ShipRocketService.fetchCollections({
                page,
                limit
            });
            return h.response(data).code(RESPONSE_CODES.SUCCESS);
        } catch (error: any) {
            return h
                .response({ error: COMMON.INTERNAL_SERVER_ERROR })
                .code(RESPONSE_CODES.INTERNAL_SERVER_ERROR);
        }
    }
};

export default ShipRocketController;
