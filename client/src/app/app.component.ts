import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  title = 'app';
  constructor(private translate: TranslateService, private titleService: Title, private router: Router) {
    translate.setDefaultLang('sq');
    this.translate.get('pageTitle.title')
      .takeUntil(this.unsubscribeAll)
      .subscribe(name => {
        this.titleService.setTitle(name);
      });
    this.router.events
      .takeUntil(this.unsubscribeAll)
      .subscribe((evt) => {
        window.scrollTo(0, 0);
      });
  }
}
