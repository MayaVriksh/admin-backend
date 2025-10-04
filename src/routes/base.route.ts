import testRoute from "./test.route";
// import authRoutes from "../modules/auth/routes/auth.route";
// import notificationRoutes from "../modules/auth/routes/notification.route";
// import supplierRoutes from "../modules/users/suppliers/routes/index.route";
// import adminRoutes from "../modules/users/admins/routes/index.route";
// import inventoryRoutes from "../modules/warehouses/routes/inventory.route";
// import shiprocketCheckout from "../modules/warehouses/routes/shiprocketCheckout.route";
import shipRocketRoutes from "../modules/warehouses/routes/shipRocket.route";

export const baseRoutes = {
    name: "base-router-v1",
    register: async (server: any, _: any) => {
        server.route([
            ...testRoute,
            // ...authRoutes,
            // ...notificationRoutes,
            // ...supplierRoutes,
            // ...inventoryRoutes,
            // ...adminRoutes,
            // ...shiprocketCheckout,
            ...shipRocketRoutes
        ]);
    }
};
