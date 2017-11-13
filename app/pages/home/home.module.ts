import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { homeRouting } from "./home.routing";
import { HomeComponent } from "./home.component";
import { DBComponent } from "./db.component";

@NgModule({
  // imports: [
  //   NativeScriptModule,
  //   homeRouting
  // ],
  // declarations: [
  //   HomeComponent,
  //   DBComponent
  // ],
  // schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule { }
