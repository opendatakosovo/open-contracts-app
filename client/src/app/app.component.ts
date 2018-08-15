import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  title = 'app';

  constructor(private meta: Meta, private translate: TranslateService, private titleService: Title, private router: Router) {
    // Twitter Tags
    this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.addTag({ name: 'twitter:title', content: 'Kontratat e Hapura' });
    this.meta.addTag({ name: 'twitter:description', content: 'K&euml;tu mund t&euml; gjeni t&euml; dh&euml;nat e hapura p&euml;r kontratat n&euml; komun&euml;n e Prishtin&euml;s.' });
    this.meta.addTag({ name: 'twitter:image', content: '/assets/images/social-media.jpg' });
    this.meta.addTag({ name: 'twitter:creator', content: '@OpenDataKosovo' });

    // Facebook Tags
    this.meta.addTag({ name: 'og:site_name', content: 'Kontratat e Hapura' });
    this.meta.addTag({ name: 'og:title', content: 'Kontratat e Hapura' });
    this.meta.addTag({ name: 'og:description', content: 'K&euml;tu mund t&euml; gjeni t&euml; dh&euml;nat e hapura p&euml;r kontratat n&euml; komun&euml;n e Prishtin&euml;s.' });
    this.meta.addTag({ name: 'og:image:url', content: '/assets/images/social-media.jpg' });
    this.meta.addTag({ name: 'og:url', content: 'http://kontratatehapura.prishtinaonline.com/' });
    this.meta.addTag({ name: 'og:type', content: 'website' });

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
