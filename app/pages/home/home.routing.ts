import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home.component";
import {DBComponent} from "./db.component";

const homeRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "db", component: DBComponent },
];

export const homeRouting: ModuleWithProviders = RouterModule.forChild(homeRoutes);
