import './graph1.js'
import './graph2.js'
import './graph3.js'
import './graph4.js'
import './graph5.js'
import './graph7.js'
import './graph8.js'

//charger les éléments avec la class: loadLater, au scroll
$(window).on('scroll', function(e) {
    // console.log("coucou");
    var viewportTopPosition = $(window).scrollTop(),
        viewportBottomPosition = viewportTopPosition + $(window).height();
   
    $('.loadLater:not(.visible)').each(function(i, loadLater) {
       var loadLaterPosition = $(loadLater).offset().top;
   
       if (loadLaterPosition >= viewportTopPosition && loadLaterPosition < viewportBottomPosition) {
          $(loadLater).addClass('visible');
       }
    });
  });