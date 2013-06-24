(function($) {
  $.fn.slidingContentBox = function(menuContainer) {
    var sectionsContainer = $(this);
    var menuContainer = $(menuContainer);

    function setupInitialSection() {
      var anchor = window.location.hash.replace('#', '');
      var initialSection = $('#' + anchor);
      if (!initialSection.is('section')) {
        initialSection = $('.sections section:first-child');
      }
      sectionsContainer.css('height', initialSection.outerHeight());
      sectionsContainer.scrollTop(initialSection.position().top);
      setAvtiveMenuItem(initialSection.attr('id'));
      $(document).scrollTop(0);
    }

    function setAvtiveMenuItem(activeItemId) {
      menuContainer.find('a').each(function() {
        var item = $(this);
        if (item.attr('id') == 'menu-' + activeItemId) {
          item.addClass('active');
        } else {
          item.removeClass('active');
        }
      });
    }

    function setupMenuEvents() {
      $.merge(menuContainer.find('a'), $('.content-slider-trigger')).on('click', function(event) {
        var section = $($(this).attr('href'));
        setAvtiveMenuItem(section.attr('id'));
        sectionsContainer.animate({
          scrollTop: sectionsContainer.scrollTop() + section.position().top,
          height: section.outerHeight()
        }, 500);
        return false;
      });
    }

    setupInitialSection();
    setupMenuEvents();
  }
})(jQuery);

$(document).ready(function() {
  $('.sections').slidingContentBox('.menu');
  $('#imprint-link').on('click', function() {
    $('#imprint').slideToggle();
    return false;
  });
});
