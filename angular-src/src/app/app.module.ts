import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { VisualisationsComponent } from './visualisations/visualisations.component';
import { DashboardComponent } from './layouts/dashboard-page-layout/dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { DataSetComponent } from './data-set/data-set.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { FooterComponent } from './layouts/main-page-layout/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './layouts/main-page-layout/header/header.component';
import { LayoutComponent } from './layouts/main-page-layout/layout/layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-page-layout/dashboard-layout/dashboard-layout.component';
import { DashboardHeaderComponent } from './layouts/dashboard-page-layout/dashboard-header/dashboard-header.component';
import { DashboardFooterComponent } from './layouts/dashboard-page-layout/dashboard-footer/dashboard-footer.component';



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
      {path:'dashboard', component:DashboardComponent}
    ]
  }
  
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
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
    DashboardHeaderComponent,
    DashboardFooterComponent
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
