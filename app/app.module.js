"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var forms_1 = require("nativescript-angular/forms");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var angular_1 = require("nativescript-pro-ui/sidedrawer/angular");
var angular_2 = require("nativescript-pro-ui/listview/angular");
//import { NativeScriptUICalendarModule  } from "nativescript-pro-ui/calendar/angular";
// import { NativeScriptUIChartModule } from "nativescript-pro-ui/chart/angular";
// import { NativeScriptUIDataFormModule } from "nativescript-pro-ui/dataform/angular";
// import { NativeScriptUIAutoCompleteTextViewModule } from "nativescript-pro-ui/autocomplete/angular";
// import { NativeScriptUIGaugesModule } from "nativescript-pro-ui/gauges/angular";
var app_component_1 = require("./app.component");
var app_routing_1 = require("./app.routing");
var shared_module_1 = require("./shared/shared.module");
var detail_service_1 = require("./pages/rss/rss_detail/detail.service");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [nativescript_module_1.NativeScriptModule, forms_1.NativeScriptFormsModule, http_1.NativeScriptHttpModule,
                router_1.NativeScriptRouterModule,
                router_1.NativeScriptRouterModule.forRoot(app_routing_1.routes),
                shared_module_1.SharedModule,
                angular_1.NativeScriptUISideDrawerModule,
                angular_2.NativeScriptUIListViewModule
            ],
            declarations: [app_component_1.AppComponent].concat(app_routing_1.navigatableComponents),
            bootstrap: [app_component_1.AppComponent],
            entryComponents: app_routing_1.entryComponents.slice(),
            schemas: [core_1.NO_ERRORS_SCHEMA],
            providers: [detail_service_1.DetailService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
