/* ===========================================================
 * Wisky Portal
 * Author: DucBM
 * =========================================================== */

$(document).ready(function(){
  // Set up interactive background
  $(".bg").interactive_bg();

  // Move up animation on load
  $('.move-up').animate({
    top: "0"
  }, 500);

  // Survey: icon animation
  $('.survey .choices .item').mouseenter(function() {
    $(this).addClass('active');
    $(this).parent().find('.item:not(.active)').each(function() {
      var opacity = $(this).css('opacity');
      var delay = 0;
      if (opacity == '1') delay = 100;
      $(this).animate({
        opacity: '0.5'
      }, delay);
    });
  });
  $('.survey .choices .item').mouseleave(function() {
    $(this).removeClass('active');
    $(this).parent().find('.item').each(function() {
      var opacity = $(this).css('opacity');
      if (opacity != '1')
        $(this).animate({
          opacity: '1'
        }, 100);
    });
  });

  // Survey Form
  $('.survey .choices .item').click(function(){
    var choice = $(this).data('value');
    $('#survey-form input[name="choice"]').val(choice);
    $('#survey-form').submit();
  });

});

// Change width & height on window resizing
$(window).resize(function() {
  $(".wrapper > .ibg-bg").css({
    width: $(window).outerWidth(),
    height: $(window).outerHeight()
  })
})

// Set up Ready To Connect counter
$(document).ready(function() {
  $('.timeout').html('10');
  $('.ready-counter').each(function() {
    var el = $(this);
    var timeOut = parseInt(el.data("timeout"));
    var target = el.data("target");
    var spanTimeout = el.find('.timeout');

    spanTimeout.html(timeOut);
    // Function to update counters on all elements with class counter
    var doUpdate = function() {
      spanTimeout.each(function() {
        var count = parseInt($(this).html());
        if (count !== 0) {
          $(this).html(count - 1);
        } else {
          clearInterval(interval);
          // show Connect button
          $('.portal-2 .content').animate({
            top: "0"
          }, 500);
          el.html('Kết nối của bạn đã sẵn sàng');
        }
      });
    };
    // Schedule the update to happen once every second
    var interval = setInterval(doUpdate, 1000);
  });
});

// Set up Page Redirect Counter
$(document).ready(function() {
  $('.timeout').html('10');
  $('.page-redirect-counter').each(function() {
    var el = $(this);
    var timeOut = parseInt(el.data("timeout"));
    var target = el.data("target");
    var spanTimeout = el.find('.timeout');

    spanTimeout.html(timeOut);
    // Function to update counters on all elements with class counter
    var doUpdate = function() {
      spanTimeout.each(function() {
        var count = parseInt($(this).html());
        if (count !== 0) {
          $(this).html(count - 1);
        } else {
          clearInterval(interval);
          window.location = target;
        }
      });
    };
    // Schedule the update to happen once every second
    var interval = setInterval(doUpdate, 1000);

  });
});