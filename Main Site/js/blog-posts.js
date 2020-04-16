$(document).ready(function () {
  const gridWidth = parseFloat(getComputedStyle(document.querySelector('.grid')).width)
  const gridItemWidth = parseFloat((getComputedStyle(document.querySelector('.grid-item')).width))
  console.log(gridWidth, gridItemWidth)
  // init Masonry
  const $grid = $('.grid').masonry({
    itemSelector: '.grid-item',
    percentPosition: true,
    columnWidth: '.grid-sizer',
    gutter: (gridWidth - (gridItemWidth * 3)) / 2
  });

  // layout Masonry after each image loads
  $grid.imagesLoaded().progress( function() {
    $grid.masonry();
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