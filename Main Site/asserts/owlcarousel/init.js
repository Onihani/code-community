$(".suggested-posts-loop").owlCarousel({
  center: true,
  items: 2,
  loop: true,
  lazyLoad: true,
  animateOut: "slideOutDown",
  animateIn: "flipInX",
  autoplay: true,
  autoplayTimeout: 5000,
  autoplayHoverPause: true,
  margin: 30,
  responsiveClass: true,
  responsive: {
    0: {
      items: 1,
      nav: true,
      autoplay: false,
    },
    600: {
      items: 2,
      nav: false,
      loop: true
    },
    1000: {
      items: 3,
      nav: false,
      loop: true
    }
  }
});
