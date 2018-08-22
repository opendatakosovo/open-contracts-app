import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  language = 'sq';
  constructor(private router: Router, private route: ActivatedRoute, public translate: TranslateService) {
    const currentRoute = this.router.url;
    if (this.translate.currentLang === 'sq' || this.router.url === '/sq/about-us') {
      this.language = 'sq';
      this.translate.use(this.language);
    } else if (this.translate.currentLang === 'sr' || this.router.url === '/sr/about-us') {
      this.language = 'sr';
      this.translate.use(this.language);
    } else if (this.translate.currentLang === 'en ' || this.router.url === '/en/about-us') {
      this.language = 'en';
      this.translate.use(this.language);
    }
  }

  ngOnInit() {
  }


}
