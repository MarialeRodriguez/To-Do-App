import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasklistComponent } from './tasklist/tasklist.component';


@NgModule({
  declarations: [
    DashboardComponent,
    TasklistComponent
  ],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ProtectedModule { }
