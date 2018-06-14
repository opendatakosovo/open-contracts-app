import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
width = window.innerWidth;
  constructor() { }
  ngOnInit() { }

  onResize(){
    this.width=window.innerWidth;
  }

}
