import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HeaderComponent } from './components/header/header.component';
import { RolesComponent } from './components/roles/roles.component';
import { StateComponent } from './components/state/state.component';
import { RequestTypeComponent } from './components/request-type/request-type.component';
import { FrequentQuestionComponent } from './components/frequent-question/frequent-question.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { StateFormModalComponent } from './shared/components/state-form-modal/state-form-modal.component';
import { FrequentQuestionFormModalComponent } from './shared/components/frequent-question-form-modal/frequent-question-form-modal.component';
import { RequestTypeFormModalComponent } from './shared/components/request-type-form-modal/request-type-form-modal.component';
import { RoleFormModalComponent } from './shared/components/role-form-modal/role-form-modal.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ForgotPasswordComponent,
    HeaderComponent,
    RolesComponent,
    StateComponent,
    RequestTypeComponent,
    FrequentQuestionComponent,
    ConfirmDialogComponent,
    NotificationComponent,
    StateFormModalComponent,
    FrequentQuestionFormModalComponent,
    RequestTypeFormModalComponent,
    RoleFormModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

