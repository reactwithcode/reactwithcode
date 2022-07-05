function makeWords() {
	var words = [
		{
			text: 'html5',
			weight: 12.3,
		},
		{
			text: 'css3',
			weight: 12.5,
		},
		{
			text: 'sass',
			weight: 12,
		},
		{
			text: 'scss',
			weight: 12,
		},
		{
			text: 'javascript',
			weight: 13,
		},
		{
			text: 'typescript',
			weight: 12,
		},
		{
			text: 'jquery',
			weight: 11,
		},
		{
			text: 'liquid',
			weight: 13,
		},
		{
			text: 'programming',
			weight: 10,
		},
		{
			text: 'react',
			weight: 12,
		},
		{
			text: 'nextjs',
			weight: 12,
		},
		{
			text: 'redux',
			weight: 12,
		},
		{
			text: 'react native',
			weight: 12,
		},
		{
			text: 'nodejs',
			weight: 11,
		},
		{
			text: 'npm',
			weight: 10,
		},
		{
			text: 'web development',
			weight: 10,
		},
		{
			text: 'shopify development',
			weight: 10,
		},
		{
			text: 'mobile development',
			weight: 10,
		},
		{
			text: 'liquid',
			weight: 13,
		},
		{
			text: 'firebase',
			weight: 10,
		},
		{
			text: 'responsive design',
			weight: 10,
		},
		{
			text: 'bootstrap',
			weight: 12.3,
		},
		{
			text: 'tailwind',
			weight: 12.3,
		},
		/* ... */
	];
	return words;
}

function makeWordCloud(words) {
	$('.teaching-domains').jQCloud(words, { delay: 120 });
}

function displayWordCloud() {
	var count = 1;
	$(window).on('scroll', function () {
		var y_scroll_pos = window.pageYOffset;
		var scroll_pos_test = 2700; // set to whatever you want it to be
		var words = makeWords();
		if (y_scroll_pos > scroll_pos_test && count <= 1) {
			makeWordCloud(words);
			count++;
		}
	});
}

function designForm() {
	$('#my-modal form').addClass('my-form');
}

$(document).ready(function () {
	Typed.new('#writing-text', {
		strings: [
			'am a Front-End Developer.',
			'am a Mobile Developer.',
			'love everything about code.',
			'solve problems.',
		],
		// Optionally use an HTML element to grab strings from (must wrap each string in a <p>)
		stringsElement: null,
		// typing speed
		typeSpeed: 1,
		contentType: 'text',
		callback: function () {
			$('#writing-text').css({ color: '#fff', 'background-color': '#76D093' });
		},
		preStringTyped: function () {},
		onStringTyped: function () {},
	});

	displayWordCloud();
});
