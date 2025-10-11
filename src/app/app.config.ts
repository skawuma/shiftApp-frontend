import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import { EmployeeForm } from './employee-form/employee-form';
import { AdminList } from './admin-list/admin-list';
import { App } from './app';

const routes = [
  { path: '', component: EmployeeForm },
  { path: 'admin', component: AdminList }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(BrowserModule, ReactiveFormsModule, FormsModule)
  ]
};