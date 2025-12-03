/*
	Miniport by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$nav = $('#nav');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('#nav a, .scrolly').scrolly({
			speed: 1000,
			offset: function() { return $nav.height(); }
		});

	// Scroll reveal animations.
		const animatedElements = document.querySelectorAll('.scroll-animate');
		const prefersReducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

		if (animatedElements.length) {
			if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
				const observer = new IntersectionObserver(function(entries) {
					entries.forEach(function(entry) {
						if (entry.isIntersecting) {
							entry.target.classList.add('is-visible');
						} else {
							entry.target.classList.remove('is-visible');
						}
					});
				}, {
					threshold: 0.15,
					rootMargin: '0px 0px -5% 0px'
				});

				animatedElements.forEach(function(element) {
					observer.observe(element);
				});
			} else {
				animatedElements.forEach(function(element) {
					element.classList.add('is-visible');
				});
			}
		}

})(jQuery);