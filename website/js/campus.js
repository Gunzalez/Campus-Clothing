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
        $openBtn: $('#open-menu-btn'),
        isOpen: false,

        // open menu
        openMenu: function(){
            campus.menu.$openBtn.addClass('click-to-close');
            campus.menu.isOpen = true;
            console.log(campus.menu.$openBtn);
            console.log('Menu is ' + campus.menu.isOpen);
        },

        // close menu
        closeMenu: function(){
            campus.menu.$openBtn.removeClass('click-to-close');
            campus.menu.isOpen = false;
            console.log(campus.menu.$openBtn);
            console.log('Menu is ' + campus.menu.isOpen);
        },

        // close one resize
        resize: function(){
            campus.login.closeMenu();
        },

        // initial set up
        init: function(){
            // attach toggle open and close
            campus.menu.$openBtn.on('click', function(e){
                e.preventDefault();
                if(!campus.menu.isOpen){
                    campus.menu.openMenu();
                } else {
                    campus.menu.closeMenu();
                }
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