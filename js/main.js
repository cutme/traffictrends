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
		d = ($(o).length > 0) ? true : false;
		return d;
	}

	function fixEl(el) {
		var pos = $(el).position(),
			b = $('body');
		$(window).on('scroll', function() {
			b.scrollTop() >= pos.top ? b.addClass('fixed') : b.removeClass('fixed');
		});
	}

	function window_smaller_than(n) {
		var d = ($(window).width() < n) ? true : false;
		return d;
	}
	var L = {
		googleMap: function() {
			function initMap() {
				var myLatLng = {
					lat: parseFloat($('#map').attr('data-lat')),
					lng: parseFloat($('#map').attr('data-lng'))
				};
				var map = new google.maps.Map(document.getElementById('map'), {
					zoom: 19,
					center: myLatLng,
					scrollwheel: false,
					draggable: false
				});
				var marker = new google.maps.Marker({
					position: myLatLng,
					map: map,
					title: 'Hello World!'
				});
				google.maps.event.addDomListener(window, 'resize', function() {
					map.setCenter(myLatLng);
				});
				marker.setMap(map);
			}
			$.getScript('https://www.google.com/jsapi', function() {
				google.load('maps', '3', {
					other_params: 'sensor=false&libraries=places',
					callback: function() {
						initMap();
					}
				});
			});
		},
		modernizrSupport: function() {
			var m = Modernizr.addTest('svgasimg', document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'));

			function replaceSvgImg() {
				var i = document.getElementsByTagName("img"),
					j, y;
				for (j = i.length; j--;) {
					y = i[j].src;
					if (y.match(/svg$/)) {
						i[j].src = y.slice(0, -3) + 'png';
					}
				}
			}
			m.svgasimg ? true : replaceSvgImg();
		},
		topline: function() {
			var b = $('body'),
				el = $('.c-topline');

			function init() {
				b.scrollTop() > 100 ? el.addClass('is-scrolling') : el.removeClass('is-scrolling');
			}
			$(window).on('scroll', function() {
				init();
			});
			init();
		},
		init: function() {
			exist('.c-google-map') && L.googleMap();
			L.modernizrSupport();
			L.topline();
		}
	};
	var N = {
		mobileNav: function() {
			var t = $('.c-nav-trigger'),
				n = $('.c-nav-primary'),
				b = $('body'),
				status = false;
				
	/*
var e = $('.c-nav-primary');
			    e.detach();
			    b.prepend(e);
*/

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
				
				$(window).resize(debouncer(function(e) {
					if (window_smaller_than(941)) {
						n.attr('style', '');
						$('.sub-menu').attr('style', '');
					} else {
						$('body').removeClass('is-blurred');
					}
				}));
			}
			
			function openSubmenuOnMobile() {
				$('a', n).on('click', function(e) {	
					if ( $(this).next('.sub-menu').length > 0 ) {
						e.preventDefault();
						$(this).next('.sub-menu').slideToggle().toggleClass('is-visibe');				
					};
				})
			}
			
			t.unbind('click').on('click', function(e) {
				e.preventDefault();				
				b.toggleClass('no-overflow');
				$(this).toggleClass('is-active');
				fromRightSide();				
				openSubmenuOnMobile();
			});

		},
		init: function() {
			N.mobileNav();
		}
	}
	var S = {
		reviews: function() {
			var owl = $('.c-reviews .owl-carousel');
			owl.owlCarousel({
				dots: false,
				loop: true,
				items: 1,
				loop: true,
				nav: true,
				navText: ['', ''],
				smartSpeed: 450
			});
		},
		init: function() {
			exist('.c-reviews') && S.reviews();
		}
	}
	$(document).ready(function() {
		L.init();
		N.init();
		S.init();
	});
});