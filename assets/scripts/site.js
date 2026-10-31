/* ReactWithCode: pricing/currency, contact form, WhatsApp click tracking. */
(function () {
	'use strict';

	/* ------------------------------------------------------------------
	   EDIT PRICES HERE. This is the only place prices live in JS.
	   The static HTML (data-price="...") shows the USD value so the page
	   works without JavaScript; keep the USD numbers there in sync.
	   Currency is chosen automatically from the visitor's country (Indonesia = IDR, everywhere else = USD).
	   Use null for a price you haven't set: the page shows [PRICE_USD] /
	   [PRICE_IDR] until you replace it.
	------------------------------------------------------------------ */
	var CONFIG = {
		formats: {
			USD: { locale: 'en-US', currency: 'USD' },
			IDR: { locale: 'id-ID', currency: 'IDR' }
		},
		prices: {
			'store-development': { USD: 400, IDR: 7000000 },
			'custom-app':        { USD: 500, IDR: 8000000 },
		},
		/* Crossed-out "compare at" prices, shown next to the price when set.
		   Leave null to show no compare price. Must be higher than the price above. */
		comparePrices: {
			'store-development': { USD: 600, IDR: 9000000 },
			'custom-app':        { USD: 800, IDR: 10000000 }
		},
		geoTimeoutMs: 2500
	};

	/* ---------- currency detection (automatic, by visitor country) ---------- */
	function hostCountry() {
		var meta = document.querySelector('meta[name="visitor-country"]');
		var code = meta && meta.getAttribute('content');
		return code ? code.trim().toUpperCase() : '';
	}

	function fetchWithTimeout(url, parse) {
		var controller = window.AbortController ? new AbortController() : null;
		var timer = setTimeout(function () { if (controller) controller.abort(); }, CONFIG.geoTimeoutMs);
		return fetch(url, { cache: 'no-store', signal: controller ? controller.signal : undefined })
			.then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return parse(res); })
			.then(function (code) { clearTimeout(timer); return code; }, function (err) { clearTimeout(timer); throw err; });
	}

	/* Resolves to an ISO country code from the visitor's IP, or '' on any failure. */
	function lookupCountryByIp() {
		return fetchWithTimeout('https://www.cloudflare.com/cdn-cgi/trace', function (res) {
			return res.text().then(function (t) { var m = /^loc=([A-Z]{2})$/m.exec(t); return m ? m[1] : ''; });
		}).catch(function () {
			return fetchWithTimeout('https://api.country.is/', function (res) {
				return res.json().then(function (d) { return (d.country || '').toUpperCase(); });
			});
		}).catch(function () { return ''; });
	}

	function currencyFor(country) {
		return country === 'ID' ? 'IDR' : 'USD';
	}

	/* ---------- rendering ---------- */
	function formatPrice(value, code) {
		var f = CONFIG.formats[code];
		return new Intl.NumberFormat(f.locale, {
			style: 'currency',
			currency: f.currency,
			maximumFractionDigits: 0
		}).format(value);
	}

	function renderPrices(code) {
		var nodes = document.querySelectorAll('[data-price]');
		Array.prototype.forEach.call(nodes, function (node) {
			var entry = CONFIG.prices[node.getAttribute('data-price')];
			var value = entry ? entry[code] : null;
			if (value === null || value === undefined) {
				node.textContent = '[PRICE_' + code + ']';
				node.classList.add('placeholder');
			} else {
				node.textContent = formatPrice(value, code);
				node.classList.remove('placeholder');
			}
		});
	}

	function renderCompare(code) {
		var nodes = document.querySelectorAll('[data-compare]');
		Array.prototype.forEach.call(nodes, function (node) {
			var key = node.getAttribute('data-compare');
			var compare = CONFIG.comparePrices[key] && CONFIG.comparePrices[key][code];
			var price = CONFIG.prices[key] && CONFIG.prices[key][code];
			if (compare && price && compare > price) {
				node.textContent = formatPrice(compare, code);
				node.hidden = false;
			} else {
				node.hidden = true;
			}
		});
	}

	function setCurrency(code) {
		renderPrices(code);
		renderCompare(code);
	}

	function initCurrency() {
		renderCompare('USD');
		/* USD is already in the HTML. Only switch if we are confident the visitor is in Indonesia. */
		var country = hostCountry();
		if (country) { if (currencyFor(country) === 'IDR') setCurrency('IDR'); return; }
		/* IP only: if the lookup fails (blocked, offline, slow) the visitor stays on USD. */
		lookupCountryByIp().then(function (code) {
			if (currencyFor(code) === 'IDR') setCurrency('IDR');
		});
	}

	/* ---------- contact form ---------- */
	function initForm() {
		var form = document.getElementById('contact-form');
		if (!form) return;
		var status = document.getElementById('form-status');
		var submit = form.querySelector('button[type="submit"]');

		function show(kind, text) {
			status.className = 'form-status is-' + kind;
			status.textContent = text;
		}
		function invalid(field, text) {
			field.setAttribute('aria-invalid', 'true');
			show('error', text);
			field.focus();
		}

		form.addEventListener('submit', function (event) {
			event.preventDefault();
			Array.prototype.forEach.call(form.elements, function (el) { el.removeAttribute && el.removeAttribute('aria-invalid'); });

			var name = form.elements.name, email = form.elements.email, message = form.elements.message;
			if (!name.value.trim()) return invalid(name, 'Please enter your name.');
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) return invalid(email, 'Please enter a valid email address.');
			if (message.value.trim().length < 10) return invalid(message, 'Please write a few words about your project (at least 10 characters).');

			submit.disabled = true;
			show('info', 'Sending...');

			fetch(form.action, {
				method: 'POST',
				headers: { 'Accept': 'application/json' },
				body: new FormData(form)
			}).then(function (res) {
				if (!res.ok) throw new Error('HTTP ' + res.status);
				form.reset();
				show('success', 'Thanks, your message was sent. I reply within 24 hours.');
				if (window.turnstile && typeof window.turnstile.reset === 'function') window.turnstile.reset();
			}).catch(function () {
				show('error', 'Sorry, your message could not be sent. Please try again, or book a call or message me on WhatsApp instead.');
			}).then(function () {
				submit.disabled = false;
			});
		});
	}

	/* ---------- WhatsApp click event (only if analytics already exists) ---------- */
	function initWhatsApp() {
		document.addEventListener('click', function (event) {
			var link = event.target.closest && event.target.closest('[data-whatsapp]');
			if (!link) return;
			if (typeof window.gtag === 'function') {
				window.gtag('event', 'whatsapp_click', { link_location: link.getAttribute('data-whatsapp') });
			}
		});
	}

	/* ---------- hero typing animation ----------
	   The full text stays in the DOM (readable by search engines and screen readers) and keeps
	   its space from the start, so nothing jumps while it types. Skipped for reduced motion. */
	function prepareTyping(el) {
		var text = el.textContent;
		var sr = document.createElement('span');
		sr.className = 'sr-only';
		sr.textContent = text;
		var typed = document.createElement('span');
		typed.className = 'typing-done';
		typed.setAttribute('aria-hidden', 'true');
		var rest = document.createElement('span');
		rest.className = 'typing-rest';
		rest.setAttribute('aria-hidden', 'true');
		rest.textContent = text;
		el.textContent = '';
		el.appendChild(sr);
		el.appendChild(typed);
		el.appendChild(rest);
		return { el: el, text: text, typed: typed, rest: rest, speed: parseInt(el.getAttribute('data-typing'), 10) || 25 };
	}

	/* Human-like rhythm: uneven keystrokes, a small hesitation after some spaces. */
	function nextDelay(base, justTyped) {
		var delay = base * (0.5 + Math.random());
		if (justTyped === ' ' && Math.random() < 0.25) delay += 140 + Math.random() * 120;
		return delay;
	}

	function runTyping(item) {
		return new Promise(function (resolve) {
			var i = 0;
			item.el.classList.add('is-typing');
			(function step() {
				i += 1;
				item.typed.textContent = item.text.slice(0, i);
				item.rest.textContent = item.text.slice(i);
				if (i < item.text.length) {
					setTimeout(step, nextDelay(item.speed, item.text.charAt(i - 1)));
				} else {
					item.el.classList.remove('is-typing');
					resolve();
				}
			})();
		});
	}

	function initTyping() {
		var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-typing]'));
		if (!nodes.length) return;
		if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		/* hide all the text first so later lines don't flash in full before their turn */
		var items = nodes.map(prepareTyping);
		items.reduce(function (chain, item) {
			return chain.then(function () { return runTyping(item); });
		}, new Promise(function (resolve) { setTimeout(resolve, 350); }));
	}

	function init() {
		initTyping();
		initCurrency();
		initForm();
		initWhatsApp();
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();
