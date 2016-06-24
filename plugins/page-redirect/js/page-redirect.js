/*
  Page Redirect Settings
  Author: DucBM

  Sample html:
  <div class="page-redirect-counter" data-timeOut="3" data-target="tinhte.vn" >
    Trang sẽ tự động chuyển sau <span class="timeOut">3</span>s...
  </div>
  <script type="text/javascript" src="js/jquery-1.12.1.min.js"></script>
  <script type="text/javascript" src="js/page-redirect.js"></script>

*/
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