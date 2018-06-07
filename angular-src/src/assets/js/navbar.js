$(document).ready(() => {
    // navbar transition
    $(window).scroll(function () {
      var height = $(window).scrollTop();
    
      if (height >= 114) {
          $("#navbar-1").addClass("scroll");
      } else {
          $("#navbar-1").removeClass("scroll");

      }
  });
})
