import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { VisualisationsComponent } from './visualisations/visualisations.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { DataSetComponent } from './data-set/data-set.component';
import { AboutUsComponent } from './about-us/about-us.component';




const appRoutes: Routes = [
  { path: '', component: HomeComponent, runGuardsAndResolvers: 'always' },
  { path: 'register', component: RegisterComponent, runGuardsAndResolvers: 'always' },
  { path: 'login', component: LoginComponent, runGuardsAndResolvers: 'always' },
  { path: 'dashboard', component: DashboardComponent, runGuardsAndResolvers: 'always' },
  { path: 'profile', component: ProfileComponent, runGuardsAndResolvers: 'always' },
  { path: 'visualizations' , component: VisualisationsComponent , runGuardsAndResolvers: 'always'}, 
  { path: 'dataSet' , component: DataSetComponent, runGuardsAndResolvers: 'always'},
  { path: 'aboutUs' , component: AboutUsComponent , runGuardsAndResolvers: 'always'}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    VisualisationsComponent,
    DataSetComponent,
    AboutUsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
