(function($) {
  $.fn.slidingContentBox = function() {
    var sectionsContainer = $(this);

    function setupInitialSection() {
      var anchor = window.location.href.split('#')[1];
      var initialSection = $('#' + anchor);
      if (!initialSection.is('.section')) {
        initialSection = $('.sections .section:first-child');
      }
      sectionsContainer.css('height', initialSection.outerHeight());
      sectionsContainer.scrollTop(initialSection.position().top);
      setAvtiveMenuItem(initialSection.attr('id'));
    }

    function setAvtiveMenuItem(activeItemId) {
      $('.menu a').each(function() {
        var item = $(this);
        if (item.attr('id') == 'menu-' + activeItemId) {
          item.addClass('active');
        } else {
          item.removeClass('active');
        }
      });
    }

    function setupMenuEvents() {
      $('.menu a').on('click', function(event) {
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
  $('.sections').slidingContentBox();
  $('#imprintLink').on('click', function() {
    $('#imprint').slideToggle();
    return false;
  });
});
