/*
	Portfolio - Mai Phuc Qui
	Enhanced with professional animations
*/

(function($) {

	var $window   = $(window),
	    $body     = $('body'),
	    $nav      = $('#nav');

	// Breakpoints
	breakpoints({
		xlarge: [ '1281px', '1680px' ],
		large:  [ '981px',  '1280px' ],
		medium: [ '737px',  '980px'  ],
		small:  [ null,     '736px'  ]
	});

	// Remove preload class after load
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Smooth scroll
	$('#nav a, .scrolly').scrolly({
		speed: 1000,
		offset: function() { return $nav.height(); }
	});

	// --- SCROLL PROGRESS BAR ---
	var $progressBar = $('<div id="scroll-progress"></div>').prependTo('body');

	function updateProgress() {
		var scrollTop  = $(window).scrollTop();
		var docHeight  = $(document).height() - $(window).height();
		var progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
		$progressBar.css('width', progress + '%');
	}

	// --- NAV SHRINK ON SCROLL ---
	function updateNav() {
		if ($(window).scrollTop() > 50) {
			$nav.addClass('scrolled');
		} else {
			$nav.removeClass('scrolled');
		}
	}

	$window.on('scroll', function() {
		updateProgress();
		updateNav();
	});

	updateProgress();
	updateNav();

	// --- TYPEWRITER EFFECT ---
	var nameEl = document.querySelector('.hero header h1:last-child strong');
	if (nameEl && window.matchMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		var fullText   = nameEl.textContent.trim();
		var cursor     = document.createElement('span');
		cursor.className = 'typewriter-cursor';
		nameEl.textContent = '';
		nameEl.appendChild(cursor);

		var charIndex = 0;
		var isDeleting = false;
		var pauseAfterType = 2800;
		var pauseAfterDelete = 500;

		function type() {
			if (!isDeleting) {
				// Typing phase
				nameEl.textContent = fullText.slice(0, charIndex + 1);
				nameEl.appendChild(cursor);
				charIndex++;
				if (charIndex === fullText.length) {
					isDeleting = true;
					setTimeout(type, pauseAfterType);
					return;
				}
				setTimeout(type, 80);
			} else {
				// Deleting phase
				nameEl.textContent = fullText.slice(0, charIndex - 1);
				nameEl.appendChild(cursor);
				charIndex--;
				if (charIndex === 0) {
					isDeleting = false;
					setTimeout(type, pauseAfterDelete);
					return;
				}
				setTimeout(type, 45);
			}
		}

		// Start typewriter after page reveal
		setTimeout(type, 900);
	}

	// --- SCROLL REVEAL ANIMATIONS ---
	var animatedElements = document.querySelectorAll('.scroll-animate');
	var prefersReducedMotion = window.matchMedia
		? window.matchMedia('(prefers-reduced-motion: reduce)')
		: { matches: false };

	if (animatedElements.length) {
		if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
			var observer = new IntersectionObserver(function(entries) {
				entries.forEach(function(entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
					} else {
						entry.target.classList.remove('is-visible');
					}
				});
			}, {
				threshold: 0.12,
				rootMargin: '0px 0px -5% 0px'
			});

			animatedElements.forEach(function(el) {
				observer.observe(el);
			});
		} else {
			animatedElements.forEach(function(el) {
				el.classList.add('is-visible');
			});
		}
	}

})(jQuery);