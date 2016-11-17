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
        scale: 1.2,
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
                hScreen = el.outerHeight(),
                wScreen = el.outerWidth(),
                // sh = settings.strength / h,
                // sw = settings.strength / w,
                has_touch = 'ontouchstart' in document.documentElement;
            var bg = el.find(".ibg-bg"); // Background Picture

            // 1.1- Get Picture's size
            var wPicture = bg.width();
            var hPicture = bg.height();

            // 1.2- Set Frame's size
            var wFrame = settings.scale * wScreen;
            var hFrame = settings.scale * hScreen;

            // 1.3- Set Picture's size
            var rPicture = wPicture / hPicture; // Remember to check hP == 0
            var rFrame = wFrame / hFrame;
            if (rPicture > rFrame) {
                hPicture = hFrame;
                wPicture = rPicture * hPicture;
            } else {
                wPicture = wFrame;
                hPicture = wPicture / rPicture;
            }
            bg.width(wPicture);
            bg.height(hPicture);
            
            // 1.4- Set Range's size
            var wRange = wPicture - wScreen;
            var hRange = hPicture - hScreen;

            // var limitX = w * (settings.scale - 1) * 0.25;
            // var limitY = h * (settings.scale - 1) * 0.25;

            // if (settings.contain == true) {
            //     el.css({
            //         overflow: "hidden"
            //     });
            // }
            // Insert new container so that the background can be contained when scaled.

            // if (settings.wrapContent == false) {
            //     el.prepend("<div class='ibg-bg'></div>")
            // } else {
            //     el.wrapInner("<div class='ibg-bg'></div>")
            // }

            // Set background to the newly added container. no-repeat center center

            // if (el.data("ibg-bg") !== undefined) {
            //     el.find("> .ibg-bg").css({
            //         background: "url('" + el.data("ibg-bg") + "')",
            //         "background-size": "cover",
            //         "background-repeat": "no-repeat"
            //     });
            //     //el.find("> .ibg-bg").prepend(el.data("ibg-bg"));
            // }

            // bg.css({
            //     width: w,
            //     height: h,
            //     "-webkit-transform": "scale(" + settings.scale + ")",
            //     "-o-transform": "scale(" + settings.scale + ")",
            //     "-moz-transform": "scale(" + settings.scale + ")",
            //     "transform": "scale(" + settings.scale + ")"
            // })

            // 2- BEHAVIORS
            if (has_touch || screen.width <= 699) {
                //// FOR MOBILE
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
                // "-webkit-transform": "scale("+settings.scale+") translate3d("+newX+"px,"+0+"px,0)",
                // "-moz-transform": "scale("+settings.scale+") translate3d("+newX+"px,"+0+"px,0)",
                // "-o-transform": "scale("+settings.scale+") translate3d("+newX+"px,"+0+"px,0)",
                // "transform": "scale("+settings.scale+") translate3d("+newX+"px,"+0+"px,0)"
                // });
                // }

                function deviceMotionHandler(eventData) {
                    var gamma = event.gamma;
                    var beta = event.beta;
                    var XMouse = (gamma + 90) / 180; // value: 0..1
                    var YMouse = (beta + 90) / 180; // value: 0..1

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

                    var XMouse = xMouse / wScreen; // value: 0..1
                    var YMouse = yMouse / hScreen; // value: 0..1

                    var XPicture = -XMouse;
                    var YPicture = -YMouse;

                    var newX = xPicture = XPicture * wRange;
                    var newY = yPicture = YPicture * hRange;

                    // var pageX = e.pageX || e.clientX,
                    //     pageY = e.pageY || e.clientY,
                    //     pageX = (pageX - el.offset().left) - el.outerWidth() / 2,
                    //     pageY = (pageY - el.offset().top) - el.outerHeight() / 2,
                    //     newX = 0 - pageX * (settings.scale - 1) * (2 - settings.scale),
                    //     newY = 0 - pageY * (settings.scale - 1) * (2 - settings.scale);

                    // 2.1.2- Set new x, y
                    if (settings.scale != 1) el.addClass("ibg-entering");
                    // if (-limitX <= newX && newX <= limitX && -limitY <= newY && newY <= limitY) {
                    bg.css({
                        "-webkit-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                        "-o-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                        "-moz-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                        "transform": "translate3d(" + newX + "px," + newY + "px,0)",
                        "-webkit-transition": "-webkit-transform " + settings.animationSpeed + " linear",
                        "-moz-transition": "-moz-transform " + settings.animationSpeed + " linear",
                        "-o-transition": "-o-transform " + settings.animationSpeed + " linear",
                        "transition": "transform " + settings.animationSpeed + " linear"
                    }).on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
                        // This will signal the mousemove below to execute when the scaling animation stops
                        el.removeClass("ibg-entering")
                    });
                }).mousemove(function (e) {
                    // This condition prevents transition from causing the movement of the background to lag
                    if (!el.hasClass("ibg-entering") && !el.hasClass("exiting")) {
                        // Calc new X, Y
                        var xMouse = e.pageX || e.clientX;
                        var yMouse = e.pageY || e.clientY;

                        var XMouse = xMouse / wScreen; // value: 0..1
                        var YMouse = yMouse / hScreen; // value: 0..1

                        var XPicture = -XMouse;
                        var YPicture = -YMouse;

                        var newX = xPicture = XPicture * wRange;
                        var newY = yPicture = YPicture * hRange;
                        // var pageX = e.pageX || e.clientX,
                        //     pageY = e.pageY || e.clientY,
                        //     pageX = (pageX - el.offset().left) - el.outerWidth() / 2,
                        //     pageY = (pageY - el.offset().top) - el.outerHeight() / 2,
                        //     newX = 0 - pageX * (settings.scale - 1) * (2 - settings.scale),
                        //     newY = 0 - pageY * (settings.scale - 1) * (2 - settings.scale);
                                //console.log(pageX + ' - ' + newX);

                        bg.css({
                            "-webkit-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                            "-o-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                            "-moz-transform": "translate3d(" + newX + "px," + newY + "px,0)",
                            "transform": "translate3d(" + newX + "px," + newY + "px,0)",
                            "-webkit-transition": "none",
                            "-moz-transition": "none",
                            "-o-transition": "none",
                            "transition": "none"
                        });
                    }
                }).mouseleave(function (e) {
                    if (settings.scale != 1) el.addClass("ibg-exiting")
                    // Same condition applies as mouseenter. Rescale the background back to its original scale
                    el.addClass("ibg-exiting").find("> .ibg-bg").css({
                        "-webkit-transition": "-webkit-transform " + settings.animationSpeed + " linear",
                        "-moz-transition": "-moz-transform " + settings.animationSpeed + " linear",
                        "-o-transition": "-o-transform " + settings.animationSpeed + " linear",
                        "transition": "transform " + settings.animationSpeed + " linear"
                    }).on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
                        el.removeClass("ibg-exiting")
                    });
                });
            }
        });

    }
}(window.jQuery);

// Set up
$(document).ready(function () {
    $(".bg.interactive").interactive_bg();
    $(".bg.static").each(function () {
        var image = $(this).data("ibg-bg");
        $(this).css("background-image", "url(" + image + ")");
        $(this).css("background-size", "100% 100%");
        $(this).css("background-repeat", "no-repeat");
    });
});