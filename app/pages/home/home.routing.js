"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var home_component_1 = require("./home.component");
var db_component_1 = require("./db.component");
var homeRoutes = [
    { path: "", component: home_component_1.HomeComponent },
    { path: "db", component: db_component_1.DBComponent },
];
exports.homeRouting = router_1.RouterModule.forChild(homeRoutes);
