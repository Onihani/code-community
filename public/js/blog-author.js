$(document).ready(function(){
  $(".owl-carousel").owlCarousel({
    margin: 25,
    loop: false,
    lazuload: true,
    autoplay: true,
    autoplayHoverPause: true,
    rewind: true,
    responsive: {
      0: {
          items : 1,
          nav: false
      },
      540: {
          items : 2,
          nav: false
      },
      980: {
          items : 3
      }
    }
  });
})