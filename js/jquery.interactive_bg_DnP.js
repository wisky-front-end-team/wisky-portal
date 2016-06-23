/* ===========================================================
 * jquery-interactive_bg.js v1.0
 * ===========================================================
 * Copyright 2014 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Create an interactive moving background
 * that reacts to viewer's cursor
 *
 * https://github.com/peachananr/interactive_bg
 *
 * License: GPL v3
 *
 * ========================================================== */

!function($){

  // Init params
  var defaults = {
    strength: 60,
    scale: 1.3,
    animationSpeed: "100ms",
    contain: true,
    wrapContent: false
  };

  $.fn.interactive_bg = function(options){
    return this.each(function(){
      var settings = $.extend({}, defaults, options),
          el = $(this),
          h = el.outerHeight(),
          w = el.outerWidth(),
          sh = settings.strength / h,
          sw = settings.strength / w,
          has_touch = 'ontouchstart' in document.documentElement;

      if (settings.contain == true) {
        el.css({
          overflow: "hidden"
        });
      }
      // Insert new container so that the background can be contained when scaled.

      if (settings.wrapContent == false) {
        el.prepend("<div class='ibg-bg'></div>")
      } else {
        el.wrapInner("<div class='ibg-bg'></div>")
      }

      // Set background to the newly added container. no-repeat center center

      if (el.data("ibg-bg") !== undefined) {
        el.find("> .ibg-bg").css({
          background: "url('" + el.data("ibg-bg") + "') no-repeat center center",
          "background-size": "cover",
        });
      }

      el.find("> .ibg-bg").css({
        width: w,
        height: h
      })

      if(has_touch || screen.width <= 699) {
        // For Mobile
        // Add support for accelerometeron mobile
        // window.addEventListener('devicemotion', deviceMotionHandler, false);
		window.addEventListener("deviceorientation", deviceMotionHandler, true);

			// function deviceMotionHandler(eventData) {
				// var accX = Math.round(event.accelerationIncludingGravity.x*10) / 10,
					 // accY = Math.round(event.accelerationIncludingGravity.y*10) / 10,
					 // xA = -(accX / 10) * settings.strength,
					 // yA = -(accY / 10) * settings.strength,
					 // newX = -(xA*2),
					 // newY = -(yA*2);

                // el.find("> .ibg-bg").css({
                   // "-webkit-transform": "scale(1.3) translate3d("+newX+"px,"+0+"px,0)",
                   // "-moz-transform": "scale(1.3) translate3d("+newX+"px,"+0+"px,0)",
                   // "-o-transform": "scale(1.3) translate3d("+newX+"px,"+0+"px,0)",
                    // "transform": "scale(1.3) translate3d("+newX+"px,"+0+"px,0)"
                // });
			// }
		  
			function deviceMotionHandler(eventData) {
				var gamma = event.gamma;
				var move = gamma, duration = 0.2;;
				if(move>50){move=50}
				if(move<-50){move=-50}
				if(gamma>50 || gamma < -50){
					duration = 1;
				}
                 el.find("> .ibg-bg").css({
                   "-webkit-transform": "scale(1.3) translate3d("+move+"px,"+0+"px,0)",
                    "transform": "scale(1.3) translate3d("+move+"px,"+0+"px,0)"
					// ,"-webkit-transition-duration": duration+"s",
					// "transition-duration":duration+"s"
                 });
			}

      } else {
        // For Desktop
        // Animate only scaling when mouse enter
        el.mouseenter(function(e) {

          // Calc new X, Y
          var pageX = e.pageX || e.clientX,
              pageY = e.pageY || e.clientY,
              pageX = (pageX - el.offset().left) - (w / 2),
              pageY = (pageY - el.offset().top) - (h / 2),
              newX = ((sw * pageX)) * - 1,
              newY = ((sh * pageY)) * - 1;
          if (settings.scale != 1) el.addClass("ibg-entering")
          el.find("> .ibg-bg").css({
            "transform": "scale(1.3) translate3d("+newX+"px,"+newY+"px,0)",
            "-webkit-transition": "-webkit-transform " + settings.animationSpeed + " linear",
            "-moz-transition": "-moz-transform " + settings.animationSpeed + " linear",
            "-o-transition": "-o-transform " + settings.animationSpeed + " linear",
            "transition": "transform " + settings.animationSpeed + " linear"
          }).on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){

            // This will signal the mousemove below to execute when the scaling animation stops
            el.removeClass("ibg-entering")
          });
        }).mousemove(function(e){
          // Calc new X, Y
          var pageX = e.pageX || e.clientX,
              pageY = e.pageY || e.clientY,
              pageX = (pageX - el.offset().left) - (w / 2),
              pageY = (pageY - el.offset().top) - (h / 2),
              newX = ((sw * pageX)) * - 1,
              newY = ((sh * pageY)) * - 1;
              //alert(newX + ' - ' + newY);
          // This condition prevents transition from causing the movement of the background to lag
          if (!el.hasClass("ibg-entering") && !el.hasClass("exiting")) {
            // Use matrix to move the background from its origin
            // Also, disable transition to prevent lag
            el.find("> .ibg-bg").css({
            "transform": "scale(1.3) translate3d("+newX+"px,"+newY+"px,0)",
              "-webkit-transition": "none",
              "-moz-transition": "none",
              "-o-transition": "none",
              "transition": "none"
            });
          }
        }).mouseleave(function(e) {
          // Calc new X, Y
          var pageX = e.pageX || e.clientX,
              pageY = e.pageY || e.clientY,
              pageX = (pageX - el.offset().left) - (w / 2),
              pageY = (pageY - el.offset().top) - (h / 2),
              newX = ((sw * pageX)) * - 1,
              newY = ((sh * pageY)) * - 1;
          if (settings.scale != 1) el.addClass("ibg-exiting")
          // Same condition applies as mouseenter. Rescale the background back to its original scale
          el.addClass("ibg-exiting").find("> .ibg-bg").css({
            "-webkit-transition": "-webkit-transform " + settings.animationSpeed + " linear",
            "-moz-transition": "-moz-transform " + settings.animationSpeed + " linear",
            "-o-transition": "-o-transform " + settings.animationSpeed + " linear",
            "transition": "transform " + settings.animationSpeed + " linear"
          }).on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
            el.removeClass("ibg-exiting")
          });
        });
      }
    });

  }


}(window.jQuery);