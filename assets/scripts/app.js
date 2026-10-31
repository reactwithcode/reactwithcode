function designForm() {
	$('#my-modal form').addClass('my-form');
}

function implementVariantLogic() {
	posthog.onFeatureFlags(function() {
		var variant = posthog.getFeatureFlag('upwork-lead-flow');
		var ctaButton = document.querySelector('#footer-cta .form-button') || document.querySelector('a.form-button');

		if (!ctaButton) return;

		if (variant === 'upwork-redirect') {
			ctaButton.textContent = 'Hire Me on Upwork';
			ctaButton.href = '#!';

			ctaButton.addEventListener('click', function(e) {
				e.preventDefault();
				posthog.capture('lead_clicked_upwork', {
					source: 'reactwithcode_contact_section',
					destination: 'upwork'
				});
				window.location.href = 'https://www.upwork.com/freelancers/~019baacca8fff0b3eb?mp_source=share';
			});
		} else {
			ctaButton.addEventListener('click', function() {
				posthog.capture('lead_submitted_contact_form', {
					source: 'reactwithcode_contact_section'
				});
			});
		}
	});
}

$(document).ready(function () {
	implementVariantLogic();
});

	var modal1 = document.getElementById('myModal1');
	var btn1 = document.getElementById("myBtn1");
	var modal2 = document.getElementById('myModal2');
	var btn2 = document.getElementById("myBtn2");
	var span1 = document.getElementsByClassName("close")[0];
	var span2 = document.getElementsByClassName("close")[1];
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

	span1.onclick = function() {
		modal1.style.display = "none";
		stopVideo();
	}

	span2.onclick = function() {
		modal2.style.display = "none";
		stopVideo();
	}

	btn2.onclick = function() {
		android || iphone ? window.location.href = "https://youtu.be/Z026MJbw9YA?si=31Vu6vER096cODd_"
		: modal2.style.display = "block";
	}

	window.onclick = function(event) {
		if (event.target == modal1 || event.target == modal2) {
			modal1.style.display = "none";
			modal2.style.display = "none";
			stopVideo();
		}
	}