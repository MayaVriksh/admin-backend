const testRoute = require("./test.route");
const authRoutes = require("../modules/auth/routes/auth.route");
const notificationRoutes = require("../modules/auth/routes/notification.route");
const supplierRoutes = require("../modules/users/suppliers/routes/index.route");
const adminRoutes = require("../modules/users/admins/routes/index.route");
const plantRoutes = require("../modules/products/plants/routes/plants.routes");
const customerRoutes = require("../modules/auth/routes/customer.auth.route");
const plantTagRoute = require("../modules/products/plants/routes/plantTag.route");

module.exports = {
    name: "base-router-v1",
    register: async (server, _) => {
        server.route([
            ...testRoute,
            ...plantRoutes,
            ...plantTagRoute
            // ...customerRoutes
            // ...authRoutes,
            // ...notificationRoutes,
            // ...supplierRoutes,
            // ...adminRoutes
        ]);
    }
};
