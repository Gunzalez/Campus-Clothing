// JavaScript Document
(function ($, window) {

    var campus = {};

    campus.properties = {
        windowWidth: '',
        isMobile: false
    };

    campus.utils = {

        // checks based on CSS class
        mobileCheck: function() {
            var rtnVal = false;
            if($('html').hasClass('mobile')){
                rtnVal = true;
            }
            return rtnVal;
        }
    };

    campus.environment = {

        resize: function(){
        },

        init: function (){
            // check for mobile
            if (campus.utils.mobileCheck()){
                campus.properties.isMobile = true;
            }
        }
    };

    campus.navigation = {

        // main navigation
        $mobileNav: $('nav#menu'),
        $mobileNavCloseButton: $('.close-mobile-navigation-link'),
        API: undefined,

        resize: function(){
            campus.navigation.API.close();
        },

        init: function(){

            if (typeof HasTouch != 'undefined') {
                if(!HasTouch){
                    $('.hover-on-desktop-only').addClass('has-hover').removeClass('hover-on-desktop-only');
                }
            }

            campus.navigation.$mobileNav.mmenu({
                "offCanvas": {
                    "position": "right"
                }
            });

            campus.navigation.API = campus.navigation.$mobileNav.data("mmenu");
            campus.navigation.$mobileNavCloseButton.on('click',function() {
                campus.navigation.API.close();
            });
        }
    };


    campus.carousel = {
        $html: $('.main-carousel'),
        $controls: $('.carousel-controls', this.$html),
        $slides: $('.carousel-slide', this.$html),
        $textBoxes: $('.text', this.$html),
        auto: true,
        delay: 7, // 7 seconds,
        timer: undefined,
        currentIndex: 0,

        changeScreen: function(index){

            // sets and un-sets necessary elements of a slide
            $('a', campus.carousel.$controls).removeClass('active').eq(index).addClass('active');
            campus.carousel.$slides.removeClass('active').eq(index).addClass('active');
            campus.carousel.$textBoxes.removeClass('active').eq(index).addClass('active');
        },

        init: function(){

            // initiates click to change slides
            if(campus.carousel.$html.length > 0){
                $('a', campus.carousel.$controls).on('click', function (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    if(!$(this).hasClass('active')){
                        var index = $('a', campus.carousel.$controls).index(this);
                        campus.carousel.changeScreen(index);
                        clearInterval(campus.carousel.timer);
                    }
                });
            }

            // makes image click-able, without complex z-index CSS
            if($('.click-able', campus.carousel.$html).length > 0){

                // stops More links clashing with click-able images
                campus.carousel.$html.find('.text a').on('click', function (evt) {
                    evt.stopPropagation();
                });

                // adds click event on the entire carousel, a bit messy, sorry
                // looks for href of link in active text
                campus.carousel.$html.on('click', function () {
                    location.assign($('.text.active',$(this)).find('.slide-cta').attr('href'));
                });
            }

            // sets up auto if true
            if(campus.carousel.auto){
                campus.carousel.timer = setInterval(function () {
                    if(!campus.carousel.$html.is(':hover')){
                        campus.carousel.currentIndex++;
                        if(campus.carousel.currentIndex > (campus.carousel.$slides.length - 1)){
                            campus.carousel.currentIndex = 0;
                        }
                        campus.carousel.changeScreen(campus.carousel.currentIndex);
                    }
                }, campus.carousel.delay * 1000);
            }
        }
    };

    campus.infoLinks = {
        $html: $('.info-link'),
        scrolling: function(){
           $('.closer', campus.infoLinks.$html).trigger('click');
        },
        init: function(){
            campus.infoLinks.$html.each(function(i, obj){
                $('.opener', $(obj)).on('click', function(evt){
                    evt.preventDefault();
                    $(obj).addClass('opened');
                });
                $('.closer', $(obj)).on('click', function(evt){
                    evt.preventDefault();
                    $(obj).removeClass('opened');
                });
            });
        }
    };

    campus.scrollEvents = function(){
        campus.infoLinks.scrolling();
    };

    campus.init = function () {

        // all init here
        campus.environment.init();
        campus.navigation.init();
        campus.carousel.init();
        campus.infoLinks.init();

        // resize triggers
        $(window).on('resize', function () {

            var newWidth = $(window).width(),
                oldWidth = campus.properties.windowWidth;

            if (oldWidth != newWidth) {
                campus.properties.windowWidth = newWidth;
                campus.resize();
            }
        });

        // trigger initial resize, just to be sure
        campus.resize();
        $(window).trigger('resize');
    };

    // main resize
    campus.resize = function () {
        campus.environment.resize();
        campus.navigation.resize();
        campus.customise.resize();
    };

    // main init
    $(document).ready(function () {
        campus.init();
        $(window).scroll(function (event) {
            campus.scrollEvents();
        });
    });

}(jQuery, window));