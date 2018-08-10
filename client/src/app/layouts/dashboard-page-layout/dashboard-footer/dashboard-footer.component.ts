import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-dashboard-footer',
  templateUrl: './dashboard-footer.component.html',
  styleUrls: ['./dashboard-footer.component.css']
})
export class DashboardFooterComponent implements OnInit {
  public collapsed: boolean;
  constructor() { }

  ngOnInit() {
    if (this.collapsed) {
      $('body').toggleClass('sidenav-toggled');
      $('.navbar-sidenav .nav-link-collapse').addClass('collapsed');
      $('.navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level').removeClass('show');
    }

    this.collapseExpandNav();
  }
  collapseExpandNav() {
    $('#sidenavToggler').click((e) => {
      e.preventDefault();

      $('body').toggleClass('sidenav-toggled');
      $('.navbar-sidenav .nav-link-collapse').addClass('collapsed');
      $('.navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level').removeClass('show');

      this.collapsed = !this.collapsed;
      localStorage.setItem('collapsed', this.collapsed.toString());
    });

    // Force the toggled class to be removed when a collapsible nav link is clicked
    $('.navbar-sidenav .nav-link-collapse').click((e) => {
      e.preventDefault();
      $('body').removeClass('sidenav-toggled');
      this.collapsed = !this.collapsed;
      localStorage.setItem('collapsed', this.collapsed.toString());
    });
    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    // tslint:disable-next-line:max-line-length
    $('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function (e) {
      const e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    });

    $('.navbar-toggler').click((e) => {
      $('body').removeClass('sidenav-toggled');
      this.collapsed = false;
      localStorage.setItem('collapsed', this.collapsed.toString());
    });
  }
}
