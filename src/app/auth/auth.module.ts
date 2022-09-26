import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainComponent } from './pages/main/main.component';

import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { ValidatorComponent } from './validator/validator.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    MainComponent,
    ValidatorComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AuthModule { }

