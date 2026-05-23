/*
 * Visitor Counter - Portfolio Mai Phuc Qui
 *
 * Strategy:
 *  - Uses countapi.xyz (free, no-backend counter API)
 *  - Namespace: "phucqui-portfolio" / key: "visits"
 *  - Uses sessionStorage to detect a *new* session (browser tab opened).
 *    Each unique page-load in a new browser session increments the counter once.
 *  - Falls back to localStorage total if the API is unreachable.
 */

(function () {
    'use strict';

    /* ---- Config -------------------------------------------------- */
    var NAMESPACE = 'phucqui-portfolio';
    var KEY       = 'visits-v1';
    var API_BASE  = 'https://api.countapi.xyz';
    var WIDGET    = document.getElementById('visitor-counter');
    var COUNT_EL  = document.getElementById('vc-number');
    var SESSION_KEY = 'vc_visited';
    var LOCAL_KEY   = 'vc_cached_count';

    if (!WIDGET || !COUNT_EL) return;

    /* ---- Utility: animate number from 0 to target --------------- */
    function animateCount(target) {
        var start    = 0;
        var duration = 1600;          // ms
        var startTs  = null;

        // Parse cached value as starting point for smoother animation
        var cached = parseInt(localStorage.getItem(LOCAL_KEY), 10);
        if (cached && cached > 0 && cached <= target) {
            start = Math.max(0, target - Math.min(target, 80));
        }

        function step(ts) {
            if (!startTs) startTs = ts;
            var progress = Math.min((ts - startTs) / duration, 1);
            // Ease-out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(start + (target - start) * eased);
            COUNT_EL.textContent = current.toLocaleString('en-US');
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                COUNT_EL.textContent = target.toLocaleString('en-US');
            }
        }
        requestAnimationFrame(step);
    }

    /* ---- Show widget with entrance animation --------------------- */
    function showWidget(count) {
        COUNT_EL.classList.remove('updating');
        animateCount(count);
        localStorage.setItem(LOCAL_KEY, count);

        // Trigger CSS entrance
        setTimeout(function () {
            WIDGET.classList.add('is-visible');
        }, 400);
    }

    /* ---- Show cached count immediately while API loads ----------- */
    function showCached() {
        var cached = parseInt(localStorage.getItem(LOCAL_KEY), 10);
        if (cached && cached > 0) {
            COUNT_EL.textContent = cached.toLocaleString('en-US');
            WIDGET.classList.add('is-visible');
        } else {
            COUNT_EL.textContent = '—';
            setTimeout(function () { WIDGET.classList.add('is-visible'); }, 400);
        }
    }

    /* ---- Determine whether to hit the "hit" (increment) or "get" endpoint */
    var isNewSession = !sessionStorage.getItem(SESSION_KEY);

    // Show placeholder immediately
    COUNT_EL.classList.add('updating');
    showCached();

    if (isNewSession) {
        // Mark session so refreshes in the same tab don't double-count
        sessionStorage.setItem(SESSION_KEY, '1');

        // Increment counter
        fetch(API_BASE + '/hit/' + NAMESPACE + '/' + KEY)
            .then(function (res) {
                if (!res.ok) throw new Error('API error ' + res.status);
                return res.json();
            })
            .then(function (data) {
                if (typeof data.value === 'number') {
                    showWidget(data.value);
                } else {
                    throw new Error('Unexpected response');
                }
            })
            .catch(function () {
                // Fallback: just show cached value
                var cached = parseInt(localStorage.getItem(LOCAL_KEY), 10) || 0;
                showWidget(cached + 1);
                localStorage.setItem(LOCAL_KEY, cached + 1);
            });
    } else {
        // Returning visitor in same session — only read, don't increment
        fetch(API_BASE + '/get/' + NAMESPACE + '/' + KEY)
            .then(function (res) {
                if (!res.ok) throw new Error('API error ' + res.status);
                return res.json();
            })
            .then(function (data) {
                if (typeof data.value === 'number') {
                    showWidget(data.value);
                } else {
                    throw new Error('Unexpected response');
                }
            })
            .catch(function () {
                var cached = parseInt(localStorage.getItem(LOCAL_KEY), 10) || 0;
                showWidget(cached);
            });
    }

})();
