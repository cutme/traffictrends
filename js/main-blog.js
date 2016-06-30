/*jshint expr:true */

document.addEventListener("touchstart", function(){}, true);

function debouncer(func, timeout) {
	var timeoutID;
	timeout = timeout || 200;
	return function() {
		var scope = this,
			args = arguments;
		clearTimeout(timeoutID);
		timeoutID = setTimeout(function() {
			func.apply(scope, Array.prototype.slice.call(args));
		}, timeout);
	};
}
jQuery(function($) {
	function exist(o) {
		var d = ($(o).length > 0) ? true : false;
		return d;
	}

	function window_smaller_than(n) {
		var d = ($(window).width() < n) ? true : false;
		return d;
	}
	var L = {
		topline: function() {
			var b = $(window),
				el = $('.c-topline');
				
			function init_black() {
				el.removeClass('is-white');
				el.addClass('is-scrolling is-black');
			}
			
			function init_white() {
				el.removeClass('is-scrolling is-white');
				el.addClass('is-black');
				
				// sprawdz, czy jestesmy na blogu i mamy foto				
				if ( $('.c-top__post--photo').length > 0 ) {
					el.removeClass('is-scrolling is-black');
					el.addClass('is-white');
				}
				
				
			}

			function init() {
				b.scrollTop() > 100 ? init_black() : init_white();
			}
			$(window).on('scroll', function() {
				init();
			});
			init();
		},
		init: function() {
			L.topline();
		}
	};
	var N = {
		mobileNav: function() {
			var t = $('.c-nav-trigger'),
				n = $('.c-nav-primary'),
				b = $('body'),
				status = false;

			function fromRightSide() {
				function showNav() {
					value = 0, n.show(), status = true;
				}

				function hideNav() {
					value = -280, status = false;
				}
				
				def = (status === false) ? showNav() : hideNav();
				
				n.animate({
					right: value
				}, {
					duration: 500,
					easing: 'easeOutCubic',
					complete: function() {
						b.toggleClass('is-blurred');
						status === false && hideNav();
					}
				});				
			}
			
			function openSubmenuOnMobile() {
				$('a', n).on('click', function(e) {	
					if ( $(this).next('.sub-menu').length > 0 ) {
						e.preventDefault();
						$(this).next('.sub-menu').slideToggle().toggleClass('is-visibe');				
					}
				});
			}
			
			t.unbind('click').on('click', function(e) {
				e.preventDefault();				
				b.toggleClass('no-overflow');
				$(this).toggleClass('is-active');
				fromRightSide();
			});
			
			
			openSubmenuOnMobile();
			
			$(window).resize(debouncer(function(e) {
				if (window_smaller_than(941)) {
					n.attr('style', '');
					$('.sub-menu').attr('style', '');
				} else {
					$('body').removeClass('is-blurred');
				}
			}));

		},
		init: function() {
			N.mobileNav();
		}
	};
	
	$(document).ready(function() {
		L.init();
		N.init();
	});
});