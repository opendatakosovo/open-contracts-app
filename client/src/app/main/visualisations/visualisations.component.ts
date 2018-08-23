import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit {
  language = 'sq';
  constructor(private router: Router, private route: ActivatedRoute, public translate: TranslateService) {
    window.scrollTo(0, 0);
    const currentRoute = this.router.url;
    if (this.translate.currentLang === 'sq' || this.router.url === '/sq/visualisations') {
      this.language = 'sq';
      this.translate.use(this.language);
    } else if (this.translate.currentLang === 'sr' || this.router.url === '/sr/visualisations') {
      this.language = 'sr';
      this.translate.use(this.language);
    } else if (this.translate.currentLang === 'en ' || this.router.url === '/en/visualisations') {
      this.language = 'en';
      this.translate.use(this.language);
    }
  }

  ngOnInit() {
    window.addEventListener('language', function () {
      // do your checks to detect
      // changes in "e1", "e2" & "e3" here
    }, false);
  }

}
