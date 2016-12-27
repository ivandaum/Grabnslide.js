new Grabnslide({
  container: document.querySelector('#slider1 ul')
})

new Grabnslide({
  container: document.querySelector('#slider3 ul'),
  cell: document.querySelectorAll('#slider3 ul li'),
  triggerElement: document.querySelector('#slider-3-trigger')
})

$(document).ready(function() {
  $(".nav-tabs a").on("click", function() {
    $(this).closest('.nav-tabs').find('a').removeClass('active')
    $(this).addClass('active')
  })
})
