import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  width: number = window.innerWidth;
  selectedItem = 'item1';
  constructor(private translate: TranslateService, private titleService: Title) {
    translate.setDefaultLang('sq');
  }
  ngOnInit() { }

  onResize() {
    this.width = window.innerWidth;
  }
  useLanguage(language: string) {
    this.translate.use(language);
    this.translate.get('pageTitle.title').subscribe(name => {
      this.titleService.setTitle(name);
    });
  }
}
