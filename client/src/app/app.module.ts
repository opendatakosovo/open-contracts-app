import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HostListener } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable/src';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { NgDatepickerModule } from 'ng2-datepicker';

import { AppComponent } from './app.component';
import { LoginComponent } from './main/login/login.component';
import { HomeComponent } from './main/home/home.component';
import { VisualisationsComponent } from './main/visualisations/visualisations.component';
import { ProfileComponent } from './admin/profile/profile.component';
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
import { DataService } from './service/data.service';
import { ChartModule } from 'angular-highcharts';




import { AuthGuard } from './guards/auth.guard';
import { ContractInformationComponent } from './admin/contracts/contract-information/contract-information.component';
import { ContractsListComponent } from './admin/contracts/contracts-list/contracts-list.component';
import { EditContractComponent } from './admin/contracts/edit-contract/edit-contract.component';
import { ContractCommentsComponent } from './admin/contracts/contract-comments/contract-comments.component';
import { MainPageContractsListComponent } from './main/home/main-page-contracts-list/main-page-contracts-list.component';
import { CommentService } from './service/comment.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ContractsCountByYearsChartComponent } from './main/visualisations/charts/contracts-count-by-years-chart/contracts-count-by-years-chart.component';
import { TopTenContractorsChartComponent } from './main/visualisations/charts/top-ten-contractors-chart/top-ten-contractors-chart.component';
import { ContractBySigningDatePublicationDateChartComponent } from './main/visualisations/charts/contract-by-signing-date-publication-date-chart/contract-by-signing-date-publication-date-chart.component';
import { ContractByYearWithPredictedValueTotalAmountComponent } from './main/visualisations/charts/contract-by-year-with-predicted-value-total-amount/contract-by-year-with-predicted-value-total-amount.component';
import { DirectoratesChartComponent } from './main/visualisations/charts/directorates-chart/directorates-chart.component';
import { DirectoratesTableComponent } from './main/visualisations/charts/directorates-table/directorates-table.component';
import { ContractsCountByProcurementTypeAndYearComponent } from './main/visualisations/charts/contracts-count-by-procurement-type-and-year/contracts-count-by-procurement-type-and-year.component';
import { ContractsCountByProcurementValueAndYearComponent } from './main/visualisations/charts/contracts-count-by-procurement-value-and-year/contracts-count-by-procurement-value-and-year.component';
import { ContractsCountByProcurementProcedureAndYearComponent } from './main/visualisations/charts/contracts-count-by-procurement-procedure-and-year/contracts-count-by-procurement-procedure-and-year.component';
import { ResetPasswordComponent } from './main/reset-password/reset-password.component';
import { fromPromise } from '../../node_modules/rxjs/observable/fromPromise';
import { ChangePasswordMainComponent } from './main/change-password-main/change-password-main.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
const appRoutes: Routes = [
  // Main page layouts routes
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'visualisations', component: VisualisationsComponent },
      { path: 'about-us', component: AboutUsComponent },
    ]
  },
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
      { path: 'dashboard/contracts/:id', component: ContractInformationComponent, canActivate: [AuthGuard] },
      { path: 'dashboard/contracts/edit-contract/:id', component: EditContractComponent, canActivate: [AuthGuard] }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'change-password/:token', component: ChangePasswordMainComponent },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    VisualisationsComponent,
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
    ContractsListComponent,
    EditContractComponent,
    ContractCommentsComponent,
    MainPageContractsListComponent,
    PageNotFoundComponent,
    ContractsCountByYearsChartComponent,
    TopTenContractorsChartComponent,
    ContractBySigningDatePublicationDateChartComponent,
    ContractByYearWithPredictedValueTotalAmountComponent,
    DirectoratesChartComponent,
    DirectoratesTableComponent,
    ContractsCountByProcurementTypeAndYearComponent,
    ContractsCountByProcurementValueAndYearComponent,
    ContractsCountByProcurementProcedureAndYearComponent,
    ResetPasswordComponent,
    ChangePasswordMainComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    ModalModule.forRoot(),
    NgxDatatableModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
    DatepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxDatatableModule,
    NgxPageScrollModule,
    ChartModule,
    NgDatepickerModule
  ],
  entryComponents: [ChangePasswordComponent],
  providers: [
    UserService,
    AuthGuard,
    DirectorateService,
    HttpClientService,
    ContractsService,
    DatasetService,
    CommentService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

