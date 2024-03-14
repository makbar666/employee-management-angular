import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'; // Import here;
// primeng
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { ListComponent } from './pages/list/list.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';
import { ToastrModule } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
// component external
// components internal
import { LoadingComponent } from './loading/loading.component'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListComponent,
    LoadingComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    PasswordModule,
    TableModule,
    DropdownModule,
    SidebarModule,
    CalendarModule,
    DialogModule,
    InputNumberModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
