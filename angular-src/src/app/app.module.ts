import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './main/login/login.component';
import { HomeComponent } from './main/home/home.component';
import { VisualisationsComponent } from './main/visualisations/visualisations.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { DataSetComponent } from './main/data-set/data-set.component';
import { AboutUsComponent } from './main/about-us/about-us.component';
import { FooterComponent } from './layouts/main-page-layout/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './layouts/main-page-layout/header/header.component';
import { LayoutComponent } from './layouts/main-page-layout/layout/layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-page-layout/dashboard-layout/dashboard-layout.component';
import { DashboardFooterComponent } from './layouts/dashboard-page-layout/dashboard-footer/dashboard-footer.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UsersComponent } from './admin/users/users.component';
import { DataComponent } from './admin/data/data.component';
import { TablesComponent } from './admin/tables/tables.component';



const appRoutes: Routes = [
  //Main page layouts routes
  {
    path: "",
    component: LayoutComponent,
    children:[
      {path:"", component: HomeComponent},
      { path: 'visualisations' , component: VisualisationsComponent }, 
      { path: 'data-set' , component: DataSetComponent},
      { path: 'about-us' , component: AboutUsComponent },
    ]
  },
  {path:'login', component:LoginComponent},
  {
    path:'',
    component: DashboardLayoutComponent,
    children:[
      {path:'dashboard', component:DashboardComponent},
      {path:'dashboard/users', component:UsersComponent},
      {path:'dashboard/data', component:DataComponent},
      {path:'dashboard/tables', component:TablesComponent}
    ]
  }
  
]

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
    DataComponent,
    TablesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
