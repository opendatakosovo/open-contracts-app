import { Component, NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private translate: TranslateService, private titleService: Title) {
    translate.setDefaultLang('sq');
    this.translate.get('pageTitle.title').subscribe(name => {
      this.titleService.setTitle(name);
    });
  }
}
