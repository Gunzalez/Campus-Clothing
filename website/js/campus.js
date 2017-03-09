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

        // globally used functions
        $displayToggles: $('.js-toggle-display'), // show/hide
        $tooltips: $('[data-toggle="tooltip"]'),  // tool tips

        resize: function(){},

        init: function (){
            // check for mobile
            if (campus.utils.mobileCheck()){
                campus.properties.isMobile = true;
            }

            // displays tooltips
            if(campus.environment.$tooltips.length > 0){
                campus.environment.$tooltips.tooltip();
            }



            // toggles display of divs
            campus.environment.$displayToggles.each(function(i, obj){
                $(obj).on('click', function(){
                    var toggleTargetId = $(this).attr('data-toggle-display'),
                        $toggleTarget = $('#'+toggleTargetId),
                        isChecked = $(this).prop("checked");

                    if(isChecked){
                        $toggleTarget.addClass('display-none');
                    } else {
                        $toggleTarget.removeClass('display-none');
                    }
                })
            });
        }
    };

    campus.largeCTA = {

        init: function () {

            // instantiate and assign variables
            campus.largeCTA.$parent = $('.large-cta');
            campus.largeCTA.$pointers = $('i', campus.largeCTA.$parent);
            campus.largeCTA.$stringDisplay = $('#animated-text', campus.largeCTA.$parent);
            campus.largeCTA.$stringSource = $("#text-list", campus.largeCTA.$parent);

            // big shout out to Matt from http://www.mattboldt.com/ for this, cheers.
            if(this.$stringDisplay){
                this.$stringDisplay.typed({
                    //strings: ["First sentence.", "Second sentence."],
                    //stringsElement: null,
                    stringsElement: this.$stringSource,
                    // typing speed
                    typeSpeed: 0,
                    // time before typing starts
                    startDelay: 0,
                    // backspacing speed
                    backSpeed: 0,
                    // shuffle the strings
                    shuffle: false,
                    // time before backspacing
                    backDelay: 5000,
                    // loop
                    loop: false,
                    // false = infinite
                    loopCount: 2,
                    // show cursor
                    showCursor: false,
                    // character for cursor
                    cursorChar: "|",
                    // attribute to type (null == text)
                    attr: null,
                    // either html or text
                    contentType: 'html',
                    // call when done callback function
                    callback: function() {},
                    // starting callback function before each string
                    preStringTyped: function(i) {
                        switch (i){
                            case 0:
                                campus.largeCTA.$pointers.addClass('fa-caret-up');
                                break;
                            case 1:
                                campus.largeCTA.$pointers.addClass('fa-caret-down').removeClass('fa-caret-up');
                                break;
                            default:
                                campus.largeCTA.$pointers.removeClass('fa-caret-down').removeClass('fa-caret-up');
                                campus.largeCTA.$pointers.eq(0).addClass('fa-caret-up');
                                campus.largeCTA.$pointers.eq(1).addClass('fa-caret-down');
                        }
                    },
                    //callback for every typed string
                    onStringTyped: function() {},
                    // callback for reset
                    resetCallback: function() {}
                });
            }
        }
    };

    campus.login = {
        // elements of this component
        $parentRow: $('.header-login'),
        $openBtn: $('.toggle-btn', $('.header-login')),
        $loginFrm: $('.login-form', $('.header-login')),
        delayedClose: null,

        // open action
        openFrm: function(){
            var newHeight = this.$loginFrm.outerHeight() +
                    this.$parentRow.height();
            this.$parentRow.css('height', newHeight);
            this.$parentRow.addClass('open');

            // if Main Navigation is open, close it first
            if(campus.navigation.isOpen){
                campus.navigation.$toggleBtn.trigger('click');
            }
        },

        // close action
        closeFrm: function(){
            this.$parentRow.removeAttr('style');
            this.$parentRow.removeClass('open');
        },

        // close on resize
        resize: function(){
            this.closeFrm();
        },

        // initial set up
        init: function(){

            // assign variables
            campus.login.$parentRow = $('.header-login');
            campus.login.$openBtn = $('.toggle-btn', $('.header-login'));
            campus.login.$loginFrm = $('.login-form', $('.header-login'));

            // attach open action
            var self = this;
            this.$openBtn.on('click', function(e){
                e.preventDefault();
                if(!self.$parentRow.hasClass('open')){
                    self.openFrm();
                } else {
                    self.closeFrm();
                }
            });

            // delay hiding menu after 3 seconds mouseleave
            this.$parentRow.on('mouseleave', function(){
                self.delayedClose = setTimeout(function(){
                    if(!self.$parentRow.is(":hover")){
                        self.closeFrm();
                    } else {
                        clearInterval(self.delayedClose);
                    }
                }, 3000);
            })
        }
    };

    campus.overlay = {

        /* Open */
        showOverlay:function(){

            document.getElementById("myNav").style.height = "100%";
        },

        hideOverlay: function(){
            document.getElementById("myNav").style.height = "0%";

        },


        init: function () {

            $('.openModal').on('click', function (e) {
                e.preventDefault();
                campus.overlay.showOverlay();
            })

            $('.hideModal').on('click', function (e) {
                e.preventDefault();
                campus.overlay.hideOverlay();
            })

        }
    };

    campus.navigation = {
        // elements of this component
        $parentRow: $('.header-title'),
        $toggleBtn: $('.toggle-navigation', this.$parentRow),
        $buttonsContainer: $('.main-navigation', this.$parentRow),
        $buttons: $('.header-links', this.$parentRow),
        isOpen: false,

        // open menu
        open: function(){
            this.$parentRow.addClass('open');
            this.isOpen = true;
            this.$toggleBtn.addClass('is-active');
            this.$buttonsContainer.height(campus.navigation.$buttons.outerHeight());
        },

        // close navigation
        close: function(){
            this.$parentRow.removeClass('open');
            this.isOpen = false;
            this.$toggleBtn.removeClass('is-active');
            this.$buttonsContainer.removeAttr('style');
        },

        // rest navigation
        reset: function(){
            this.isOpen = false;
            this.$toggleBtn.removeClass('is-active');
            this.$buttonsContainer.removeClass('animate').removeAttr('style');
        },

        // close on resize
        resize: function(){
            this.reset();
        },

        // initial set up
        init: function(){
            var self = this;
            this.$toggleBtn.on('click', function(e){
                e.preventDefault();
                self.$buttonsContainer.addClass('animate');
                if(!self.isOpen){
                    self.open();
                } else {
                    self.close();
                }
            });
        }
    };

    campus.institutions = {
        // elements for this component
        $parentRow: $('.institutions-search'),
        $form: $('#select-institution-form', this.$parentRow),
        $input: $('#institution-name', this.$parentRow),
        listMax: 5,
        basUrl: 'institution.html?id=',

        init: function(){

            var self = this;

            // stopping default for action,
            // not best practice, but breaks the autoComplete :(
            this.$form.on('submit', function(e){
                e.preventDefault();
            });

            // auto complete options
            var options = {
                url: "js/institutions.json",
                getValue: "name",
                list: {
                    maxNumberOfElements: self.listMax,
                    match: {
                        enabled: true
                    },
                    onChooseEvent: function(){
                        // cosmetic effect - gives user feedback
                        campus.institutions.$form.addClass('loading');
                        // go to new page
                        location.assign(self.basUrl + self.$input.getSelectedItemData().id);
                    }
                }
            };

            // cosmetic effect
            this.$input.on('focus', function(){
                self.$form.removeClass('loading');
            });
            this.$form.removeClass('loading'); // fixes bug on page load

            // attach action
            this.$input.easyAutocomplete(options);
        }

    };

    campus.products = {
        $list: $('.products-list'),
        $titles: $('.list-title', this.$list),
        $buttons: $('.products-navigation a'),

        setPosition: function(position){
            // controls header and copy display
            this.$list.removeClass('active');
            this.$list.eq(position).addClass('active');

            // controls buttons
            this.$buttons.parents('li').removeClass('active');
            this.$buttons.eq(position).parents('li').addClass('active');
        },

        init: function(){
            var products = this;
            this.$titles.each(function(i, obj){
                $(obj).on('click', function(){
                    var index = products.$titles.index($(obj));
                    products.setPosition(index);
                })
            });

            this.$buttons.each(function(i, obj){
                $(obj).on('click', function(e){
                    e.preventDefault();
                    var index = products.$buttons.index($(obj));
                    products.setPosition(index);
                })
            });
        }
    };

    campus.product = {
        // elements for this component
        $parent: $('.product-detail'),
        $miniCarousel: $('.product-image-carousel', this.$parent),

        init: function(){
            campus.product.$miniCarousel.each(function(i, obj){
                var $buttons = $('[data-image-target]', $(obj));
                $buttons.on('click', function(e){
                    e.preventDefault();
                    var $targetImage = $('.' + $(this).attr('data-image-target'));
                    var imagePath = $('img', $(this)).attr('src');
                    $targetImage.attr('src', imagePath);
                    $buttons.removeClass('active');
                    $(this).addClass('active');
                });
            });
        }
    };

    campus.init = function () {

        // all init here
        campus.environment.init();
        campus.login.init();
        campus.navigation.init();
        campus.institutions.init();
        campus.products.init();
        campus.product.init();
        campus.largeCTA.init();
        campus.overlay.init();

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