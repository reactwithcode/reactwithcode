function makeWords() {
	var words = [
		{
			text: 'html5',
			weight: 12,
		},
		{
			text: 'css3',
			weight: 12,
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
			weight: 12.5,
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
			weight: 12.3,
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
			weight: 13,
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
			weight: 11.3,
		},
		{
			text: 'tailwind',
			weight: 11.3,
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
			'am a Shopify Developer.',
			'am a Front-End Developer.',
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

	var modal1 = document.getElementById('myModal1');
	var btn1 = document.getElementById("myBtn1");
	var modal2 = document.getElementById('myModal2');
	var btn2 = document.getElementById("myBtn2");
	var span = document.getElementsByClassName("close")[0];
	var android = navigator.userAgent.match(/Android/i);
	var iphone = navigator.userAgent.match(/iPhone/i);

	var stopVideo = function ( ) {
		var iframe = document.querySelector( 'iframe');
		var video = document.querySelector( 'video' );
		if ( iframe ) {
			var iframeSrc = iframe.src;
			iframe.src = iframeSrc;
		}
		if ( video ) {
			video.pause();
		}
	};

	btn1.onclick = function() {
		android || iphone ? window.location.href = "https://youtu.be/OsvmDhEa1pI?si=Do0MtKMLEKeAOMt6"
		: modal1.style.display = "block";
	}

	span.onclick = function() {
		modal1.style.display = "none";
		modal2.style.display = "none";
		stopVideo();
	}

	btn2.onclick = function() {
		android || iphone ? window.location.href = "https://youtu.be/dXAr-UGoRHg?si=WF5uVVkwUgsonCE7"
		: modal2.style.display = "block";
	}

	window.onclick = function(event) {
		if (event.target == modal1 || event.target == modal2) {
			modal1.style.display = "none";
			modal2.style.display = "none";
			stopVideo();
		}
	}