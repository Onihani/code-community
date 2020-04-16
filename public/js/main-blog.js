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

  // showing nav items for small screens
  $('#sectionsNav').on('show.bs.collapse', function () {
    const mainNavbar = document.querySelector('#mainNavbar');
    const mainNavbarBrand =  mainNavbar.querySelector('.navbar-brand')
    const mainNavbarNavItems = mainNavbar.querySelectorAll('.navbar-nav li')
    mainNavbar.classList.remove('navbar-transparent');
    mainNavbar.classList.remove('shadow-none');
    mainNavbar.classList.add('navbar-light');
    mainNavbar.classList.add('bg-white');
    mainNavbarBrand.classList.remove('text-white');
    mainNavbarBrand.classList.add('text-reset');
    mainNavbarNavItems.forEach(item => {
      item.style.padding = '15px'
    })
  })

  // hiding nav items for small screens
  $('#sectionsNav').on('hidden.bs.collapse', function () {
    let scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
    if (scrollTop < 150) {
      const mainNavbar = document.querySelector('#mainNavbar');
      const mainNavbarBrand =  mainNavbar.querySelector('.navbar-brand')
      const mainNavbarNavItems = mainNavbar.querySelectorAll('.navbar-nav li')

      mainNavbar.classList.add('navbar-transparent');
      mainNavbar.classList.add('shadow-none');
      mainNavbar.classList.remove('navbar-light');
      mainNavbar.classList.remove('bg-white');
      mainNavbarBrand.classList.add('text-white');
      mainNavbarBrand.classList.remove('text-reset');
      mainNavbarNavItems.forEach(item => {
        item.style.padding = '0'
      })
    }
  })

  // showing white navbar background on scrolling
  $(document).on('scroll', function () {
    let scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;

    const mainNavbar = document.querySelector('#mainNavbar');
    const mainNavbarBrand =  mainNavbar.querySelector('.navbar-brand')
    const mainNavbarNavItems = mainNavbar.querySelectorAll('.navbar-nav li')

    if (scrollTop < 150) {
      mainNavbar.classList.add('navbar-transparent');
      mainNavbar.classList.add('shadow-none');
      mainNavbar.classList.remove('navbar-light');
      mainNavbar.classList.remove('bg-white');
      mainNavbarBrand.classList.add('text-white');
      mainNavbarBrand.classList.remove('text-reset');
      mainNavbarNavItems.forEach(item => {
        item.style.padding = '0'
      })
    } else {
      mainNavbar.classList.remove('navbar-transparent');
      mainNavbar.classList.remove('shadow-none');
      mainNavbar.classList.add('navbar-light');
      mainNavbar.classList.add('bg-white');
      mainNavbarBrand.classList.remove('text-white');
      mainNavbarBrand.classList.add('text-reset');
    }
  })
});


