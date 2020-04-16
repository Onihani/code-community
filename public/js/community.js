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
})