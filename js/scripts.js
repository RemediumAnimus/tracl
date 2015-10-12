$(document).ready(function(){

	// fast click on touch devices
	FastClick.attach(document.body);

	// html5 placeholders support
	$('input, textarea').placeholder();

	// input masks
	$('input[type=tel]').mask('+7 (999) 999-99-99');

	// hide ie clear button appearing with mask
	$('input[type=tel]').on('focus', function(){
		$(this).addClass('ie-tel');
	});

	$('input[type=tel]').on('change keyup paste', function(){
		$(this).removeClass('ie-tel');
	});

	// form validation
	$('.js-form-validate').validate({
		errorClass: 'invalid',
		validClass: 'valid',
		errorElement: 'em',

		onfocusout: function(element) {
			$(element).valid();
		},
		highlight: function(element, errorClass, validClass) {
			$(element).addClass(errorClass).removeClass(validClass);
			$(element).parent().addClass(errorClass).removeClass(validClass);
		},
		unhighlight: function(element, errorClass, validClass) {
			$(element).removeClass(errorClass).addClass(validClass);
			$(element).parent().removeClass(errorClass).addClass(validClass);
		},

		ignore: '.ignore'
	});

	// slider
	// var slider = new Swiper('.js-slider', {
	// 	// effect: 'fade',
	// 	loop: true,
	// 	prevButton: '.js-slider__prev',
	// 	nextButton: '.js-slider__next',
	// 	pagination: '.js-slider__pagination',
	// 	bulletClass: 'b-slider__pagination__bullet',
	// 	bulletActiveClass: 'b-slider__pagination__bullet--active',
	// 	paginationBulletRender: function (index, className) {
	// 		return '<div class="'+className +'"><i></i></div>';
	// 	},
	// 	speed: 700
	// });

	// popup windows
	// $('.js-window-call').magnificPopup({
	// 	midClick: true,
	// 	overflowY: 'scroll',
	// 	removalDelay: 300,
	// 	mainClass: 'mfp-anim'
	// });

	// background video & audio
	var bgVid = $('.js-bg-video');
	var bgVidSauce = bgVid.prop('src');

	var bgAudio = $('.js-bg-audio');
	var bgAudioSauce = bgAudio.prop('src');

	function bgVideo(){

		if ( Modernizr.mq('(max-width: 979px)') ) {
			bgVid.prop({
				'src': '',
				'autoplay': false
			});

			bgAudio.prop({
				'src': '',
				'autoplay': false
			});
		} else {
			bgVid.prop({
				'src': bgVidSauce,
				'autoplay': true
			});

			bgAudio.prop({
				'src': bgAudioSauce,
				'autoplay': true
			});
		}

	}

	bgVideo();

	var resizeTimer;
	$(window).on('resize', function() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(bgVideo, 100);
	});

	// mute background audio
	var muteBtn = $('.js-bg-audio__mute');

	muteBtn.on('click', function(){

		if ( $(this).hasClass('active') ) {
			$(this).removeClass('active').prop('title', 'Выключить звук');
			bgAudio.get(0).play();
		} else {
			$(this).addClass('active').prop('title', 'Включить звук');
			bgAudio.get(0).pause();
		}

	});

    var menuBtn = $('.b-btn-round--menu');
    var mailBtn = $('.b-btn-round--mail');
    var phoneBtn = $('.b-btn-round--phone');

    if ($(window).width() > '480') {
        menuBtn.on('click', function (e) {
            e.preventDefault();

            $('.pop-up-menu').show().addClass("active");
            grid.windowClass = ".pop-up-menu";
            grid.showGrid();
        });

        phoneBtn.on('click', function (e) {
            e.preventDefault();

            $('.pop-up-phone').show().addClass("active");
            grid.windowClass = ".pop-up-phone";
            grid.showGrid();
            $('.pop-up-phone').find("input[type=tel]").focus();
        });

        mailBtn.on('click', function (e) {
            e.preventDefault();

            $('.pop-up-mail').show().addClass("active");
            grid.windowClass = ".pop-up-mail";
            grid.showGrid();
        });

        $('.close').click(function(){
            grid.removeGrid();
            $(this).closest(".pop-up-modal").removeClass("active");
        });
    }else{
        //popup окна на мобильных

        $('.open-popup-link').magnificPopup({
            type:'inline',
            midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
        });
    }



    var grid = {
        cellWidth: 240,
        timeout: 50,
        transformClass: 'transform',
        ready: true,
        windowClass:'.pop-up-modal',
        showGrid: function (){
            var windowClass = this.windowClass;
            if (!this.ready) {
                this.transformClass = 'transform-done';
            } else {
                this.transformClass = 'transform';
                this.timeout = 50;
            }
            var width = this.cellWidth;
            var anim = 0;
            var count = Math.ceil(parseInt($('.pop-up-modal').css('width'))/width);

            if ($(windowClass+' .grid').length<count) {
                for (var i=0; i<count; i++) {
                    $elem = $("<div class='grid'><div class='anim'></div></div>");
                    $('.pop-up-modal .grid-container').append($elem);
                }
            }
            var transform = this.transformClass;
            var showWindow = this.showWindow;

            if (!$('.pop-up-modal .anim').hasClass('transform-done')) {
                var timer = setInterval(function(){
                    $(windowClass+' .anim').eq(anim).addClass(transform);
                    anim != count ? anim++ : (clearInterval(timer),showWindow());
                },this.timeout);
            } else {
                $(windowClass+' .anim').addClass(transform);
            }

            if ($(windowClass+' .grid').length>count) {
                for (var j=$(windowClass+' .grid').length; j>count; j--) {
                    $(windowClass+' .grid').eq($(windowClass+' .grid').length-1).remove();
                }
            }

            this.ready = false;
        },
        removeGrid: function() {
            var windowClass = this.windowClass;
            var anim = $(windowClass+' .anim').length;
            $('.window').removeClass('slideExpandUp');
            $('.window').addClass('slideExpandDown').animate({'opacity':0},'slow',function(){
                $('.window').hide();
            });
            var timer = setInterval(function(){
                $(windowClass+' .anim').eq(anim).addClass('transform-back');
                $(windowClass+' .anim').eq(anim).removeClass('transform-done');
                if (anim==0) {
                    clearInterval(timer);
                    setTimeout(function(){
                        $(windowClass+'').hide();
                        $('.window').removeClass('slideExpandDown');
                        var count = $(windowClass+' .grid').length;
                        for(var i=0; i<=count; i++) {
                            $(windowClass+' .grid').eq(0).remove();
                        }
                    },500);

                } else {
                    anim--;
                }
            },this.timeout);
            this.ready = true;
        },
        showWindow: function() {
            $('.window').show().addClass('slideExpandUp').animate({'opacity':1});
        },

        helper: function() {
            var windowClass = this.windowClass;
            var width = this.cellWidth;
            var count = Math.ceil(parseInt($(windowClass+'').css('width'))/width);

            if ($(windowClass+' .grid').length<count) {
                for (var i=0; i<count; i++) {
                    $elem = $("<div class='grid'><div class='anim transform-done'></div></div>");
                    $(windowClass+' .grid-container').append($elem);
                }
            }
        }
    };


    $(window).resize(function(){
        if ($('.pop-up-modal.active').css('display')!='none') grid.helper();
        if (grid.ready) {
            $('.pop-up-modal .anim').removeClass('transform-done');
        }
        if ($('html').height()<600) {
            $('body').css('height','600px');
        }
        else if ($('html').height()>600){
            $('body').css('height','100%');
        }
    });

    $(".stock-item-btn").on("click", function (e) {
       $(this).hide();
        $(this).closest(".stock-item").find(".stock-item-form").show("slow");
    });
    $(".stock-item-form-close").on("click", function (e) {
        $(this).closest(".stock-item-form").hide("slow");
        $(this).closest(".stock-item").find(".stock-item-btn").fadeIn();
    });

    $('.select-country .name-list-item').on("mouseenter",function(e){
        var imgUrl = $(this).attr("data-picture");
        $(this).closest(".select-country-country-list").css({'backgroundImage':'url('+imgUrl+')'});
    });
    $('.select-country .name-list-item').on("click",function(e){
        var imgUrl = $(this).attr("data-picture");
        $(this).closest(".select-country-country-list").css({'backgroundImage':'url('+imgUrl+')'});
    });

    $('.select-country-control').on("click",function(e){
        $(this).closest(".select-country").find(".select-country-country-list").show();
    });

    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.country-change-next',
        prevButton: '.country-change-prev'
    });

    $(".person-count .person-count-control").on("click", function (e) {
        var control = this;

        $.each($(this).closest(".person-count").find(".person-count-control"), function (key,element) {
            $(element).removeClass("active");
        });
        $(this).addClass("active").closest(".person-count").find(".person-count-input").val($(this).attr("data-value"));

        if($(this).closest(".person-count").hasClass("person-count--children")) {
            $.each($(this).closest("form").find(".age-children select"), function (key, element) {
                $(element).hide().closest('.styled-select').hide();
                if ($(element).attr("data-id") <= $(control).attr("data-value")) {
                    $(element).show().closest('.styled-select').show();
                }
            });

            if($(this).closest(".person-count").find("input").val()<=0){
                $(".age-children").hide();
            }else{
                $(".age-children").show();
            }
        }
    });

    $(".person-count .person-count-clear").on("click", function (e) {
        var btn = this;
        var curBlock = $(btn).closest(".person-count");

        if($(btn).closest(".person-count").hasClass("person-count--children")) {

            $.each($(btn).closest(".person-count").find(".person-count-control"), function (key,element) {
                $(element).removeClass("active");
            });

            $(curBlock).find("input").val("");
            $.each($(this).closest("form").find(".age-children select"), function (key, element) {
                $(element).hide().closest('.styled-select').hide();
            });

            if($(curBlock).find("input").val()<=0){
                $(".age-children").hide();
            }else{
                $(".age-children").show();
            }
        }
    });

});
