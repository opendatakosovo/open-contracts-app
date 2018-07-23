(function ($) {
  "use strict"; // Start of use strict

  $(document).ready(() => {

    // Configure tooltips for collapsed side navigation
    $('.navbar-sidenav [data-toggle="tooltip"]').tooltip({
      template: '<div class="tooltip navbar-sidenav-tooltip" role="tooltip" style="pointer-events: none;"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
    })

    // Toggle the side navigation        
    $("#sidenavToggler").click(function (e) {
      e.preventDefault();

      $("body").toggleClass("sidenav-toggled");
      $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
      $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
    });

    // Force the toggled class to be removed when a collapsible nav link is clicked
    $(".navbar-sidenav .nav-link-collapse").click(function (e) {
      e.preventDefault();
      $("body").removeClass("sidenav-toggled");
    });
    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function (e) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    });
    // Scroll to top button appear
    $(document).scroll(function () {
      var scrollDistance = $(this).scrollTop();
      if (scrollDistance > 100) {
        $('.scroll-to-top').fadeIn();
      } else {
        $('.scroll-to-top').fadeOut();
      }
    });
    // Configure tooltips globally
    $('[data-toggle="tooltip"]').tooltip();
    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function (event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top)
      }, 1000, 'easeInOutExpo');
      event.preventDefault();
    });
    $('.datatable-header').css({ 'color': 'white', 'background-color': '#32a6bd' });
    setTimeout(function () {
      $('.datatable-body-row').css({ 'color': '#5f5e5e', 'border': 'none' });
      $('.datatable-body-cell').css('margin-right', '27px');
      $('.ngx-datatable.bootstrap .datatable-body .datatable-body-row').css('width', '1815px');
      $('.ngx-datatable.bootstrap').css('border-radius', '10px');
      $('.ngx-datatable.bootstrap .datatable-body .datatable-body-row .datatable-body-cell').css('padding-left', '14px');
      $('.ngx-datatable.bootstrap .datatable-header .datatable-header-cell').css('padding-left', '26px');
    }, 300);

  });
})(jQuery); // End of use strict
