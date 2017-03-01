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
            campus.login.resize();
        },

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
            if(campus.menu.isOpen){
                campus.menu.$toggleBtn.trigger('click');
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

    campus.menu = {
        // elements of this component
        isOpen: false,

        // open menu
        openMenu: function(){
            campus.menu.isOpen = true;
        },

        // close menu
        closeMenu: function(){
            campus.menu.isOpen = false;
        },

        // close one resize
        resize: function(){

        },

        // initial set up
        init: function(){
            // Inspired by hamburger.js
            // Created by Thomas Zinnbauer YMC AG  |  http://www.ymc.ch
            // Date: 21.05.13

            var $toggleBtn = $('#hamburger'),
                $content = $('#content'),
                $container = $('#container'),
                $nav = $('#main-navigation'),
                $contentLayer = $('#content-layer');

                $toggleBtn.on('click',function (e) {
                    e.preventDefault();

                    $content.css('min-height', $(window).height());
                    $nav.css('opacity', 1);

                    //set the width of primary content container -> content should not scale while animating
                    var contentWidth = $content.width();

                    //set the content with the width that it has originally
                    $content.css('width', contentWidth);

                    //display a layer to disable clicking and scrolling on the content while menu is shown
                    $contentLayer.css('display', 'block');

                    //disable all scrolling on mobile devices while menu is shown
                    $content.bind('touchmove', function (e) {
                        e.preventDefault()
                    });

                    //set margin for the whole container with a jquery UI animation
                    campus.menu.openMenu();
                    $toggleBtn.addClass('click-to-close');
                    $container.animate({"marginLeft": ["-70%", 'easeOutExpo']}, {
                        duration: 700
                    });
                });

            $contentLayer.on('click', function () {
                //enable all scrolling on mobile devices when menu is closed
                $container.unbind('touchmove');

                //set margin for the whole container back to original state with a jquery UI animation
                campus.menu.closeMenu();
                $toggleBtn.removeClass('click-to-close');
                $container.animate({"marginLeft": ["-1", 'easeOutExpo']}, {
                    duration: 700,
                    complete: function () {
                        $content.css('width', 'auto');
                        $contentLayer.css('display', 'none');
                        $nav.css('opacity', 0);
                        $content.css('min-height', 'auto');
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
        campus.menu.init();
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
    };

    // main init
    $(document).ready(function () {
        campus.init();
    });

}(jQuery, window));