/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

var disqus_config = function () {
this.page.url = 'localHost:3000';  // Replace PAGE_URL with your page's canonical URL variable
this.page.identifier = 1; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};

(function() { // DON'T EDIT BELOW THIS LINE
  let d = document, s = d.createElement('script');
  s.src = 'https://blogy-4.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
})();


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
    const mainNavbarNavItems = mainNavbar.querySelectorAll('.navbar-nav li')
    mainNavbarNavItems.forEach(item => {
      item.style.padding = '15px'
    })
  })

  // hiding nav items for small screens
  $('#sectionsNav').on('hidden.bs.collapse', function () {
    const mainNavbar = document.querySelector('#mainNavbar');
    const mainNavbarNavItems = mainNavbar.querySelectorAll('.navbar-nav li')
    mainNavbarNavItems.forEach(item => {
      item.style.padding = '0'
    })
  })
})