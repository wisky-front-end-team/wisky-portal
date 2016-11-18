/* ===========================================================
 * jquery-interactive_bg.js v2.0
 * ===========================================================
 * Copyright 2014 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Modified: 2016 Bach Minh Duc.
 *
 * Create an interactive moving background
 * that reacts to viewer's cursor
 *
 * https://github.com/peachananr/interactive_bg
 *
 * License: GPL v3
 *
 * ========================================================== */

// Function declaration
!function ($) {

    // Init params
    var defaults = {
        strength: 100,
        scale: 1.25,
        animationSpeed: "100ms",
        contain: true,
        wrapContent: false
    };

    $.fn.interactive_bg = function (options) {
        return this.each(function () {
            // return;
            // 1- PREDEFINATIONS
            // 1.0- Init settings
            var settings = $.extend({}, defaults, options),
                el = $(this), // the Screen: the view
                has_touch = 'ontouchstart' in document.documentElement;
            var bg = el.find(".ibg-bg"); // Background Picture
            var hScreen, wScreen, wFrame, hFrame, rFrame, wRange, hRange;

            // 1.1- Get Picture's size and ratio (w/h)
            var wPicture = bg.width();
            var hPicture = bg.height();
            var rPicture = wPicture / hPicture; // Remember to check hP == 0

            // 1.2- Set transition
            bg.css({
                "-webkit-transition": "-webkit-transform " + settings.animationSpeed + " linear",
                "-moz-transition": "-moz-transform " + settings.animationSpeed + " linear",
                "-o-transition": "-o-transform " + settings.animationSpeed + " linear",
                "transition": "transform " + settings.animationSpeed + " linear"
            });

            // 1.3- Function: limit01(X). Ensure that: X, Y: 0..1
            function limit01(X) {
                if (X > 1.0) X = 1.0;
                if (X < 0.0) X = 0.0;
                return X;
            }

            // 1.4- Dynamic Init: on document ready and window resize
            function dynamicInit() {
                // 1.4.1- Get Screen's size
                hScreen = el.outerHeight();
                wScreen = el.outerWidth();

                // 1.4.2- Set Frame's size and ratio
                wFrame = settings.scale * wScreen;
                hFrame = settings.scale * hScreen;
                rFrame = wFrame / hFrame;

                // 1.4.3- Set Picture's size
                if (rPicture > rFrame) {
                    hPicture = hFrame;
                    wPicture = rPicture * hPicture;
                } else {
                    wPicture = wFrame;
                    hPicture = wPicture / rPicture;
                }
                bg.width(wPicture);
                bg.height(hPicture);
                
                // 1.4.4- Set Range's size
                wRange = wPicture - wScreen;
                hRange = hPicture - hScreen;
            }
            dynamicInit();
            $(window).resize(dynamicInit);

            // 2- BEHAVIORS
            if (has_touch || screen.width <= 699) {
                //// FOR MOBILE
                // Add support for accelerometeron mobile
                // window.addEventListener('devicemotion', deviceMotionHandler, false);
                window.addEventListener("deviceorientation", deviceMotionHandler, true);

                function deviceMotionHandler(eventData) {
                    var gamma = -event.gamma;
                    if (gamma > 90) gamma = 180 - gamma;
                    if (gamma < -90) gamma = -180 - gamma;
                    var beta = event.beta;
                    var XMouse = (gamma + 90) / 180; // value: 0..1
                    var YMouse = (beta + 90) / 180; // value: 0..1
                    XMouse = limit01(XMouse);
                    YMouse = limit01(YMouse);

                    var XPicture = -XMouse;
                    var YPicture = -YMouse;

                    var newX = xPicture = XPicture * wRange;
                    var newY = yPicture = YPicture * hRange;

                    bg.css({
                        "-webkit-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                        "-o-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                        "-moz-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                        "transform": "translate3d(" + newX + "px," + newY + "px,0)"
                    });
                }

            } else {
                // 2.1-FOR DESKTOP
                // Animate only scaling when mouse enter
                el.mouseenter(function (e) {
                    // 2.1.1- Calc new x, y
                    var xMouse = e.pageX || e.clientX;
                    var yMouse = e.pageY || e.clientY;
                    XMouse = limit01(XMouse);
                    YMouse = limit01(YMouse);

                    var XMouse = xMouse / wScreen; // value: 0..1
                    var YMouse = yMouse / hScreen; // value: 0..1

                    var XPicture = -XMouse;
                    var YPicture = -YMouse;

                    var newX = xPicture = XPicture * wRange;
                    var newY = yPicture = YPicture * hRange;

                    // 2.1.2- Set new x, y
                    if (settings.scale != 1) el.addClass("ibg-entering");
                    // if (-limitX <= newX && newX <= limitX && -limitY <= newY && newY <= limitY) {
                    bg.css({
                        "-webkit-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                        "-o-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                        "-moz-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                        "transform": "translate3d(" + newX + "px," + newY + "px,0)"
                    }).on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
                        // This will signal the mousemove below to execute when the scaling animation stops
                        el.removeClass("ibg-entering")
                    });
                }).mousemove(function (e) {
                    // This condition prevents transition from causing the movement of the background to lag
                    if (!el.hasClass("ibg-entering") && !el.hasClass("exiting")) {
                        // 2.2.1- Calc new X, Y
                        var xMouse = e.pageX || e.clientX;
                        var yMouse = e.pageY || e.clientY;
                        XMouse = limit01(XMouse);
                        YMouse = limit01(YMouse);

                        var XMouse = xMouse / wScreen; // value: 0..1
                        var YMouse = yMouse / hScreen; // value: 0..1

                        var XPicture = -XMouse;
                        var YPicture = -YMouse;

                        var newX = xPicture = XPicture * wRange;
                        var newY = yPicture = YPicture * hRange;

                        // 2.2.2- Set new X, Y
                        bg.css({
                            "-webkit-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                            "-o-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                            "-moz-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                            "transform": "translate3d(" + newX + "px," + newY + "px,0)"
                        });
                    }
                }).mouseleave(function (e) {
                    if (settings.scale != 1) el.addClass("ibg-exiting")
                    // Same condition applies as mouseenter. Rescale the background back to its original scale
                    el.addClass("ibg-exiting");
                    bg.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
                        el.removeClass("ibg-exiting")
                    });
                });
            }
        });

    }
}(window.jQuery);

// Set up
$(document).ready( function () {
    $(".bg.interactive").interactive_bg();
    $(".bg.static").each(function () {
        var img = $(this).find(".ibg-bg");
        img.css({
            "width": "100%",
            "height": "100%"
        });
    });
})