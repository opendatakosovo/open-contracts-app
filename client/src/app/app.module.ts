import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HostListener } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './main/login/login.component';
import { HomeComponent } from './main/home/home.component';
import { VisualisationsComponent } from './main/visualisations/visualisations.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { DataSetComponent } from './main/data-set/data-set.component';
import { AboutUsComponent } from './main/about-us/about-us.component';
import { FooterComponent } from './layouts/main-page-layout/footer/footer.component';
import { HeaderComponent } from './layouts/main-page-layout/header/header.component';
import { LayoutComponent } from './layouts/main-page-layout/layout/layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-page-layout/dashboard-layout/dashboard-layout.component';
import { DashboardFooterComponent } from './layouts/dashboard-page-layout/dashboard-footer/dashboard-footer.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UsersComponent } from './admin/users/users.component';
import { DataDashboardComponent } from './admin/data-dashboard/data-dashboard.component';
import { UserService } from './service/user.service';
import { DirectorateService } from './service/directorate.service';
import { ContractsComponent } from './admin/contracts/contracts.component';
import { AddContractComponent } from './admin/contracts/add-contract/add-contract.component';
import { ModalModule } from 'ngx-bootstrap';
import { ChangePasswordFormComponent } from './admin/change-password-form/change-password-form.component';
import { ChangePasswordComponent } from './admin/profile/change-password/change-password.component';
import { DirectoratesComponent } from './admin/directorates/directorates.component';
import { HttpClientService } from './service/http-client.service';
import { ContractsService } from './service/contracts.service';
import { DatasetService } from './service/dataset.service';



import { AuthGuard } from './guards/auth.guard';
import { ContractInformationComponent } from './admin/contracts/contract-information/contract-information.component';


const appRoutes: Routes = [
  // Main page layouts routes
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'visualisations', component: VisualisationsComponent },
      { path: 'data-set', component: DataSetComponent },
      { path: 'about-us', component: AboutUsComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'dashboard/users', component: UsersComponent, canActivate: [AuthGuard] },
      { path: 'dashboard/data', component: DataDashboardComponent, canActivate: [AuthGuard] },
      { path: 'dashboard/contracts', component: ContractsComponent, canActivate: [AuthGuard] },
      { path: 'dashboard/contracts/add-contract', component: AddContractComponent, canActivate: [AuthGuard] },
      { path: 'dashboard/profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'dashboard/directorates', component: DirectoratesComponent, canActivate: [AuthGuard] },
      { path: 'dashboard/contracts/:id', component: ContractInformationComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    VisualisationsComponent,
    DataSetComponent,
    AboutUsComponent,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    DashboardLayoutComponent,
    DashboardFooterComponent,
    UsersComponent,
    DataDashboardComponent,
    ContractsComponent,
    AddContractComponent,
    ChangePasswordFormComponent,
    ChangePasswordComponent,
    DirectoratesComponent,
    ContractInformationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    ModalModule.forRoot()
  ],
  entryComponents: [ChangePasswordComponent],
  providers: [
    UserService,
    AuthGuard,
    DirectorateService,
    HttpClientService,
    ContractsService,
    DatasetService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
