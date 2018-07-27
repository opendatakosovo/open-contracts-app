import { Component, NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private translate: TranslateService, private titleService: Title, private router: Router) {
    translate.setDefaultLang('sq');
    this.translate.get('pageTitle.title').subscribe(name => {
      this.titleService.setTitle(name);
    });
    this.router.events.subscribe((evt) => {
      window.scrollTo(0, 0);
    });
  }
}
