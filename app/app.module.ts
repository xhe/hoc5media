import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptUISideDrawerModule } from "nativescript-pro-ui/sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-pro-ui/listview/angular";

import { AppComponent } from "./app.component";
import { routes, navigatableComponents, entryComponents } from "./app.routing";
import {SharedModule} from "./shared/shared.module";


@NgModule({
    imports: [NativeScriptModule, NativeScriptFormsModule, NativeScriptHttpModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes),
        SharedModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIListViewModule
    ],
    declarations: [AppComponent, ...navigatableComponents],
    bootstrap: [AppComponent],
    entryComponents: [...entryComponents],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
