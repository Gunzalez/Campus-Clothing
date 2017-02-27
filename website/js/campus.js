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
        $openBtn: $('#open-form'),
        $loginRow: $('.header-login'),
        $loginFrm: $('#login-form'),

        resize: function(){
            campus.login.closeFrm();
        },

        openFrm: function(){
            var newHeight = campus.login.$loginFrm.height() + campus.login.$loginRow.height();
            campus.login.$loginRow.css('height', newHeight);
            campus.login.$loginRow.addClass('open');
        },

        closeFrm: function(){
            campus.login.$loginRow.removeAttr('style');
            campus.login.$loginRow.removeClass('open');
        },

        init: function(){
            campus.login.$openBtn.on('click', function(e){
                e.preventDefault();
                if(!campus.login.$loginRow.hasClass('open')){
                   campus.login.openFrm();
                } else {
                   campus.login.closeFrm();
                }
            });
        }
    };

    campus.init = function () {

        // all init here
        campus.environment.init();
        campus.login.init();

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