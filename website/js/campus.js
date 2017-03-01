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

        resize: function(){},

        init: function (){
            // check for mobile
            if (campus.utils.mobileCheck()){
                campus.properties.isMobile = true;
            }
        }
    };

    campus.login = {
        // elements of this component
        $openBtn: $('#open-login-btn'),
        $closeBtn: $('#close-login-btn'),
        $loginRow: $('.header-login'),
        $loginFrm: $('#login-form'),
        delayedClose: null,

        // open action
        openFrm: function(){
            var newHeight = campus.login.$loginFrm.outerHeight() +
                    campus.login.$loginRow.height();
            campus.login.$loginRow.css('height', newHeight);
            campus.login.$loginRow.addClass('open');

            // close main navigation if open
            if(campus.navigation.isOpen){
                campus.navigation.$toggleBtn.trigger('click');
            }
        },

        // close action
        closeFrm: function(){
            campus.login.$loginRow.removeAttr('style');
            campus.login.$loginRow.removeClass('open');
        },

        // close on resize
        resize: function(){
            campus.login.closeFrm();
        },

        // initial set up
        init: function(){
            // attach open action
            campus.login.$openBtn.on('click', function(e){
                e.preventDefault();
                if(!campus.login.$loginRow.hasClass('open')){
                   campus.login.openFrm();
                } else {
                   campus.login.closeFrm();
                }
            });

            // attach close action
            campus.login.$closeBtn.on('click', function(e){
                e.preventDefault();
                campus.login.closeFrm();
            });

            // delay hiding menu after 3 seconds mouseleave
            campus.login.$loginRow.on('mouseleave', function(){
                campus.login.delayedClose = setTimeout(function(){
                    if(!campus.login.$loginRow.is(":hover")){
                        campus.login.closeFrm();
                    } else {
                        clearInterval(campus.login.delayedClose);
                    }
                }, 3000);
            })
        }
    };

    campus.navigation = {
        // elements of this component
        $toggleBtn: null,
        $content: null,
        $container: null,
        $nav: null,
        $contentLayer: null,
        isOpen: false,

        // open menu
        open: function(){
            campus.navigation.isOpen = true;
            campus.navigation.$toggleBtn.addClass('is-active');
        },

        // close navigation
        close: function(){
            campus.navigation.isOpen = false;
            campus.navigation.$toggleBtn.removeClass('is-active');
        },

        // rest navigation
        reset: function(){
            campus.navigation.$content.css('width', 'auto');
            campus.navigation.$contentLayer.css('display', 'none');
            campus.navigation.$nav.css('opacity', 0);
            campus.navigation.$content.css('min-height', 'auto');
        },

        // close on resize
        resize: function(){
            campus.navigation.$container.removeAttr('style');
            campus.navigation.reset();
            campus.navigation.close();
        },

        // initial set up
        init: function(){
            // Inspired by hamburger.js
            // Created by Thomas Zinnbauer YMC AG  |  http://www.ymc.ch
            // Date: 21.05.13

            campus.navigation.$toggleBtn = $('#menu-toggle-btn');
            campus.navigation.$content = $('#content');
            campus.navigation.$container = $('#container');
            campus.navigation.$nav = $('#main-navigation');
            campus.navigation.$contentLayer = $('#content-layer');

            campus.navigation.$toggleBtn.on('click',function (e) {
                    e.preventDefault();

                campus.navigation.$content.css('min-height', $(window).height());
                campus.navigation.$nav.css('opacity', 1);

                    //set the width of primary content container -> content should not scale while animating
                    var contentWidth = campus.navigation.$content.width();

                    //set the content with the width that it has originally
                    campus.navigation.$content.css('width', contentWidth);

                    //display a layer to disable clicking and scrolling on the content while menu is shown
                    campus.navigation.$contentLayer.css('display', 'block');

                    //disable all scrolling on mobile devices while menu is shown
                    campus.navigation.$content.bind('touchmove', function (e) {
                            e.preventDefault()
                        });

                    //set margin for the whole container with a jquery UI animation
                    campus.navigation.$container.animate(
                        {"marginLeft": ["-70%", 'easeOutExpo']}, {
                        duration: 700,
                        complete: function () {
                            campus.navigation.open();
                        }
                    });
                });

            campus.navigation.$contentLayer.on('click', function () {
                //enable all scrolling on mobile devices when menu is closed
                campus.navigation.$container.unbind('touchmove');

                //set margin for the whole container back to original state with a jquery UI animation
                campus.navigation.$container.animate(
                    {"marginLeft": ["-1", 'easeOutExpo']}, {
                    duration: 700,
                    complete: function () {
                        campus.navigation.reset();
                        campus.navigation.close();
                    }
                });
            });
        }
    };

    campus.institutions = {
        // elements for this component
        $form: $('#select-institution-form'),
        $input: $('#institution'),
        listMax: 5,
        basUrl: 'another-page.html?from=InstitutionForm&id=',

        init: function(){

            // stopping default for action,
            // not best practice, but breaks the autoComplete :(
            campus.institutions.$form.on('submit', function(e){
                e.preventDefault();
            });

            // auto complete options
            var options = {
                url: "js/institutions.json",
                getValue: "name",
                list: {
                    maxNumberOfElements: campus.institutions.listMax,
                    match: {
                        enabled: true
                    },
                    onChooseEvent: function(){
                        // cosmetic effect - gives user feedback
                        campus.institutions.$form.addClass('loading');
                        // go to new page
                        location.assign(campus.institutions.basUrl + campus.institutions.$input.getSelectedItemData().id);
                    }
                }
            };

            // cosmetic effect
            campus.institutions.$input.on('focus', function(){
                campus.institutions.$form.removeClass('loading');
            });
            campus.institutions.$form.removeClass('loading'); // fixes bug on page load

            // attach action
            campus.institutions.$input.easyAutocomplete(options);
        }

    };

    campus.init = function () {

        // all init here
        campus.environment.init();
        campus.login.init();
        campus.navigation.init();
        campus.institutions.init();

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
        campus.login.resize();
        campus.navigation.resize();
    };

    // main init
    $(document).ready(function () {
        campus.init();
    });

}(jQuery, window));