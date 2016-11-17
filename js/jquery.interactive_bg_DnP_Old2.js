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
            var settings = $.extend({}, defaults, options),
                el = $(this),
                h = el.outerHeight(),
                w = el.outerWidth(),
                sh = settings.strength / h,
                sw = settings.strength / w,
                has_touch = 'ontouchstart' in document.documentElement;
            var limitX = w * (settings.scale - 1) * 0.25;
            var limitY = h * (settings.scale - 1) * 0.25;
            //alert(limitX + ' - ' + limitY);

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
                    background: "url('" + el.data("ibg-bg") + "')",
                    "background-size": "cover",
                    "background-repeat": "no-repeat"
                });
                //el.find("> .ibg-bg").prepend(el.data("ibg-bg"));
            }

            el.find("> .ibg-bg").css({
                width: w,
                height: h,
                "-webkit-transform": "scale(" + settings.scale + ")",
                "-o-transform": "scale(" + settings.scale + ")",
                "-moz-transform": "scale(" + settings.scale + ")",
                "transform": "scale(" + settings.scale + ")"
            })

            if (has_touch || screen.width <= 699) {
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
                // "-webkit-transform": "scale("+settings.scale+") translate3d("+newX+"px,"+0+"px,0)",
                // "-moz-transform": "scale("+settings.scale+") translate3d("+newX+"px,"+0+"px,0)",
                // "-o-transform": "scale("+settings.scale+") translate3d("+newX+"px,"+0+"px,0)",
                // "transform": "scale("+settings.scale+") translate3d("+newX+"px,"+0+"px,0)"
                // });
                // }

                function deviceMotionHandler(eventData) {
                    var newX = event.gamma;
                    var newY = event.beta;
                    newX = Math.max(newX, -limitX);
                    newX = Math.min(newX, limitX);
                    newY = Math.max(newY, -limitY);
                    newY = Math.min(newY, limitY);

                    el.find("> .ibg-bg").css({
                        "-webkit-transform": "scale(" + settings.scale + ") translate3d(" + newX + "px," + newY + "px,0)",
                        "-o-transform": "scale(" + settings.scale + ") translate3d(" + newX + "px," + newY + "px,0)",
                        "-moz-transform": "scale(" + settings.scale + ") translate3d(" + newX + "px," + newY + "px,0)",
                        "transform": "scale(" + settings.scale + ") translate3d(" + newX + "px," + newY + "px,0)"
                    });
                }

            } else {
                // For Desktop
                // Animate only scaling when mouse enter
                el.mouseenter(function (e) {
                    // Calc new X, Y
                    var pageX = e.pageX || e.clientX,
                        pageY = e.pageY || e.clientY,
                        pageX = (pageX - el.offset().left) - el.outerWidth() / 2,
                        pageY = (pageY - el.offset().top) - el.outerHeight() / 2,
                        newX = 0 - pageX * (settings.scale - 1) * (2 - settings.scale),
                        newY = 0 - pageY * (settings.scale - 1) * (2 - settings.scale);

                    if (settings.scale != 1) el.addClass("ibg-entering");
                    // if (-limitX <= newX && newX <= limitX && -limitY <= newY && newY <= limitY) {
                    el.find("> .ibg-bg").css({
                        "-webkit-transform": "scale(" + settings.scale + ") translate3d(" + newX + "px," + newY + "px,0)",
                        "-o-transform": "scale(" + settings.scale + ") translate3d(" + newX + "px," + newY + "px,0)",
                        "-moz-transform": "scale(" + settings.scale + ") translate3d(" + newX + "px," + newY + "px,0)",
                        "transform": "scale(" + settings.scale + ") translate3d(" + newX + "px," + newY + "px,0)",
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
                        var pageX = e.pageX || e.clientX,
                            pageY = e.pageY || e.clientY,
                            pageX = (pageX - el.offset().left) - el.outerWidth() / 2,
                            pageY = (pageY - el.offset().top) - el.outerHeight() / 2,
                            newX = 0 - pageX * (settings.scale - 1) * (2 - settings.scale),
                            newY = 0 - pageY * (settings.scale - 1) * (2 - settings.scale);
                                //console.log(pageX + ' - ' + newX);

                        el.find("> .ibg-bg").css({
                            "-webkit-transform": "scale(" + settings.scale + ") translate3d(" + newX + "px," + newY + "px,0)",
                            "-o-transform": "scale(" + settings.scale + ") translate3d(" + newX + "px," + newY + "px,0)",
                            "-moz-transform": "scale(" + settings.scale + ") translate3d(" + newX + "px," + newY + "px,0)",
                            "transform": "scale(" + settings.scale + ") translate3d(" + newX + "px," + newY + "px,0)",
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