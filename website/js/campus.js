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
        $inputPods: $('.input-group-pod'),
        $datePickers: $('.datepicker'),
        $datePickersList: [],

        resize: function(){},

        init: function (){
            // check for mobile
            if (campus.utils.mobileCheck()){
                campus.properties.isMobile = true;
            }

            // shout out to
            // http://amsul.ca/pickadate.js
            if(this.$datePickers.length > 0){



                var picker = this.$datePickers.each(function(i, obj){
                    $(obj).pickadate({
                        formatSubmit: 'yyyy/mm/dd',
                        //min: [2017, 2, 31], // stop dates in the past
                        //max: [2017, 2, 31], // stop dates in the future
                        container: '.page',
                        close: 'Cancel'
                    });
                });



                this.$datePickersList.push(picker);
                console.log(this.$datePickersList);
            }

            //var $input = $( '.datepicker' ).pickadate({
            //    formatSubmit: 'yyyy/mm/dd',
            //    // min: [2015, 7, 14],
            //    container: '#container',
            //    // editable: true,
            //    closeOnSelect: false,
            //    closeOnClear: false,
            //})
            //
            //var picker = $input.pickadate('picker')
            //// picker.set('select', '14 October, 2014')
            //// picker.open()
            //
            //// $('button').on('click', function() {
            ////     picker.set('disable', true);
            //// });
            //

            this.$inputPods.each(function(i, obj){
                $('.symbol', $(obj)).on('click', function(){
                    $('input', $(obj)).trigger('focus');
                });
            });

            // displays tooltips (bootstrap tooltips)
            if(this.$tooltips.length > 0){
                this.$tooltips.each(function(i, obj){
                    $(obj).on('click', function(e){
                        e.preventDefault();
                    })
                });
                this.$tooltips.tooltip();
            }

            // displays of divs (toggles)
            this.$displayToggles.each(function(i, obj){
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
            this.$parent = $('.large-cta');
            this.$pointers = $('i', this.$parent);
            this.$stringDisplay = $('#animated-text', this.$parent);
            this.$stringSource = $("#text-list", this.$parent);
            var largeCTA = this;

            // big shout out to Matt from http://www.mattboldt.com/ for this, cheers.
            if(this.$stringDisplay.length > 0){
                this.$stringDisplay.typed({
                    //strings: ["First sentence.", "Second sentence."],
                    //stringsElement: null,
                    stringsElement: this.$stringSource,
                    // typing speed
                    typeSpeed: 1,
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
                    showCursor: true,
                    // character for cursor
                    cursorChar: "|",
                    // attribute to type (null == text)
                    attr: null,
                    // either html or text
                    contentType: 'html',
                    // call when done callback function
                    callback: function() {
                        $('.typed-cursor', largeCTA.$parent).empty().text('.').removeAttr('class');
                    },
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
                    onStringTyped: function() {
                    },
                    // callback for reset
                    resetCallback: function() {
                    }
                });
            }
        }
    };

    campus.login = {

        // initial set up
        init: function(){

            // assign variables
            this.$parentRow = $('.header-login');
            this.$openBtn = $('.toggle-btn', this.$parentRow);
            this.$loginFrm = $('.login-form', this.$parentRow);
            campus.login.delayedClose = null;

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
        },

        // open action
        openFrm: function(){
            var newHeight = this.$loginFrm.outerHeight() +  this.$parentRow.height();
            this.$parentRow.css('height', newHeight);
            this.$parentRow.addClass('open');

            // if Main Navigation is open, close it first
            if(campus.navigation.isOpen){
                this.$toggleBtn.trigger('click');
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
        }
    };

    campus.overlay = {

        init: function () {

            $('.openModal').on('click', function (e) {
                e.preventDefault();
                campus.overlay.showOverlay();
            });

            $('.hideModal').on('click', function (e) {
                e.preventDefault();
                campus.overlay.hideOverlay();
            });
        },


        showOverlay:function(){
            $('#campus-overlay').css('height', '100%');
        },

        hideOverlay: function(){
            $('#campus-overlay').css('height', '0');
        }
    };

    campus.navigation = {

        // initial set up
        init: function(){

            // elements of this component
            this.$parentRow = $('.header-title');
            this.$toggleBtn = $('.toggle-navigation', this.$parentRow);
            this.$buttonsContainer = $('.main-navigation', this.$parentRow);
            this.$buttons = $('.header-links', this.$parentRow);
            this.isOpen = false;
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
        },

        // open menu
        open: function(){
            this.$parentRow.addClass('open');
            this.isOpen = true;
            this.$toggleBtn.addClass('is-active');
            this.$buttonsContainer.height(this.$buttons.outerHeight());
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
        }
    };

    campus.institutions = {

        init: function(){
            // elements for this component
            this.$parentRow = $('.institutions-search');
            this.$form = $('#select-institution-form', this.$parentRow);
            this.$input = $('#institution-name', this.$parentRow);
            this.listMax = 5;
            this.basUrl = 'institution.html?id=';
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

    campus.productsLists = {

        init: function(){
            // instantiate and assign variables
            this.$list = $('.products-list');
            this.$titles = $('.list-title', this.$list);
            this.$navbar = $('.products-navigation');
            this.$buttons = $('a', this.$navbar);
            var productsList = this;

            this.$titles.each(function(i, obj){
                $(obj).on('click', function(){
                    var index = productsList.$titles.index($(obj));
                    productsList.setPosition(index);
                })
            });

            this.$buttons.each(function(i, obj){
                $(obj).on('click', function(e){
                    e.preventDefault();
                    var index = productsList.$buttons.index($(obj));
                    productsList.setPosition(index);
                })
            });
        },

        setPosition: function(position){
            // controls buttons
            this.$buttons.parents('li').removeClass('active');
            this.$buttons.eq(position).parents('li').addClass('active');

            // controls header and copy display
            this.$list.removeClass('active');
            this.$list.eq(position).addClass('active');

            // scroll to header if visible
            if(this.$navbar.css('display') === 'none'){
                //console.log(this.$buttons.eq(position));
                $('html, body').animate({
                    scrollTop: this.$list.eq(position).offset().top
                }, 500);
            }
        }
    };

    campus.productImageSwitcher = {

        init: function(){
            // elements for this component
            this.$parent = $('.product-detail');
            this.$miniCarousel = $('.product-image-carousel', this.$parent);
            
            this.$miniCarousel.each(function(i, obj){
                var $buttons = $('[data-image-target]', $(obj));
                $buttons.on('click', function(e){
                    e.preventDefault();
                    var $targetImage = $('.' + $(this).attr('data-image-target'));
                    var imagePath = $('img', $(this)).attr('src');
                    var imageAlt = $('img', $(this)).attr('alt');
                    $targetImage.attr('src', imagePath);
                    $targetImage.attr('alt', imageAlt);
                    $buttons.removeClass('active');
                    $(this).addClass('active');
                });
            });
        }
    };

    campus.FAQs = {
        init: function(){
            this.buttons = $('.faqs-list a').not('.questions a');
            this.buttons.each(function(i, obj){
                $(obj).on('click', function(e){
                    e.preventDefault();
                    $(obj).parents('li').addClass('active').find('> a i').removeClass('fa-caret-right').addClass('fa-caret-down');
                    $(obj).parents('li').siblings().removeAttr('class').find('> a i').addClass('fa-caret-right').removeClass('fa-caret-down');

                })
            });
        }
    };

    campus.buttonToggles = {
        init: function(){
            this.buttons = $('[data-btn-state]');
            this.buttons.each(function(i, obj){
                $(obj).on('click', function(){
                    var state = $(obj).attr('data-btn-state');
                    if(state == 'positive'){
                        $(obj).attr('data-btn-state', 'negative');
                    } else {
                        $(obj).attr('data-btn-state', 'positive');
                    }
                    $(obj).blur();
                })
            })
        }
    };

    campus.init = function () {

        // all init here
        campus.environment.init();
        campus.login.init();
        campus.navigation.init();
        campus.institutions.init();
        campus.productsLists.init();
        campus.productImageSwitcher.init();
        campus.buttonToggles.init();
        campus.largeCTA.init();
        campus.overlay.init();
        campus.FAQs.init();

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