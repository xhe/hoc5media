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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFDM0QsZ0ZBQThFO0FBQzlFLG9EQUFxRTtBQUNyRSxrREFBbUU7QUFDbkUsc0RBQXVFO0FBQ3ZFLGtFQUF3RjtBQUN4RixnRUFBb0Y7QUFFcEYsdUZBQXVGO0FBQ3ZGLGlGQUFpRjtBQUNqRix1RkFBdUY7QUFDdkYsdUdBQXVHO0FBQ3ZHLG1GQUFtRjtBQUduRixpREFBK0M7QUFDL0MsNkNBQStFO0FBQy9FLHdEQUFvRDtBQUVwRCx3RUFBb0U7QUFnQnBFO0lBQUE7SUFFQSxDQUFDO0lBRlksU0FBUztRQWRyQixlQUFRLENBQUM7WUFDTixPQUFPLEVBQUUsQ0FBQyx3Q0FBa0IsRUFBRSwrQkFBdUIsRUFBRSw2QkFBc0I7Z0JBQ3pFLGlDQUF3QjtnQkFDeEIsaUNBQXdCLENBQUMsT0FBTyxDQUFDLG9CQUFNLENBQUM7Z0JBQ3hDLDRCQUFZO2dCQUNaLHdDQUE4QjtnQkFDOUIsc0NBQTRCO2FBQy9CO1lBQ0QsWUFBWSxHQUFHLDRCQUFZLFNBQUssbUNBQXFCLENBQUM7WUFDdEQsU0FBUyxFQUFFLENBQUMsNEJBQVksQ0FBQztZQUN6QixlQUFlLEVBQU0sNkJBQWUsUUFBQztZQUNyQyxPQUFPLEVBQUUsQ0FBRSx1QkFBZ0IsQ0FBRTtZQUM3QixTQUFTLEVBQUUsQ0FBQyw4QkFBYSxDQUFDO1NBQzdCLENBQUM7T0FDVyxTQUFTLENBRXJCO0lBQUQsZ0JBQUM7Q0FBQSxBQUZELElBRUM7QUFGWSw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9uYXRpdmVzY3JpcHQubW9kdWxlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRVSVNpZGVEcmF3ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyL2FuZ3VsYXJcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFVJTGlzdFZpZXdNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9saXN0dmlldy9hbmd1bGFyXCI7XG5cbi8vaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlDYWxlbmRhck1vZHVsZSAgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9jYWxlbmRhci9hbmd1bGFyXCI7XG4vLyBpbXBvcnQgeyBOYXRpdmVTY3JpcHRVSUNoYXJ0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1wcm8tdWkvY2hhcnQvYW5ndWxhclwiO1xuLy8gaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlEYXRhRm9ybU1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL2RhdGFmb3JtL2FuZ3VsYXJcIjtcbi8vIGltcG9ydCB7IE5hdGl2ZVNjcmlwdFVJQXV0b0NvbXBsZXRlVGV4dFZpZXdNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9hdXRvY29tcGxldGUvYW5ndWxhclwiO1xuLy8gaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlHYXVnZXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXByby11aS9nYXVnZXMvYW5ndWxhclwiO1xuXG5cbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gXCIuL2FwcC5jb21wb25lbnRcIjtcbmltcG9ydCB7IHJvdXRlcywgbmF2aWdhdGFibGVDb21wb25lbnRzLCBlbnRyeUNvbXBvbmVudHMgfSBmcm9tIFwiLi9hcHAucm91dGluZ1wiO1xuaW1wb3J0IHtTaGFyZWRNb2R1bGV9IGZyb20gXCIuL3NoYXJlZC9zaGFyZWQubW9kdWxlXCI7XG5cbmltcG9ydCB7RGV0YWlsU2VydmljZX0gZnJvbSAnLi9wYWdlcy9yc3MvcnNzX2RldGFpbC9kZXRhaWwuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW05hdGl2ZVNjcmlwdE1vZHVsZSwgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSxcbiAgICAgICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvclJvb3Qocm91dGVzKSxcbiAgICAgICAgU2hhcmVkTW9kdWxlLFxuICAgICAgICBOYXRpdmVTY3JpcHRVSVNpZGVEcmF3ZXJNb2R1bGUsXG4gICAgICAgIE5hdGl2ZVNjcmlwdFVJTGlzdFZpZXdNb2R1bGVcbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uczogW0FwcENvbXBvbmVudCwgLi4ubmF2aWdhdGFibGVDb21wb25lbnRzXSxcbiAgICBib290c3RyYXA6IFtBcHBDb21wb25lbnRdLFxuICAgIGVudHJ5Q29tcG9uZW50czogWy4uLmVudHJ5Q29tcG9uZW50c10sXG4gICAgc2NoZW1hczogWyBOT19FUlJPUlNfU0NIRU1BIF0sXG4gICAgcHJvdmlkZXJzOiBbRGV0YWlsU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHtcblxufVxuIl19