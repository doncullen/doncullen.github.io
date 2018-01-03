jQuery(document).ready(function($){
	var timelineBlocks = $('.cd-timeline-block'),
		offset = 0.8;

	//hide timeline blocks which are outside the viewport
	hideBlocks(timelineBlocks, offset);

	//on scolling, show/animate timeline blocks when enter the viewport
	$(window).on('scroll', function(){
		(!window.requestAnimationFrame) 
			? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
			: window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
	});

	function hideBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top > $(window).scrollTop()+$(window).height()*offset ) && $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
		});
	}

	function showBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top <= $(window).scrollTop()+$(window).height()*offset && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) && $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
		});
	}

	var $content = $('#jsonContent');
	var data = {
		rss_url: 'https://medium.com/feed/@doncullen'
	};
	$.get('https://api.rss2json.com/v1/api.json', data, function (response) {
		if (response.status == 'ok') {
			var output = '';
			$.each(response.items, function (k, item) {
				var visibleSm;
				output += '<div class="blog-post">';
				output += '<span class="date">' + item.pubDate + "</span>";
				var myElement = document.createElement("div");
				myElement.innerHTML = item.description;
				if (myElement.getElementsByTagName('img').length > 1) {
					var tagIndex = item.description.lastIndexOf('<img'); // Find where the img tag starts
					var srcIndex = item.description.substring(tagIndex).indexOf('src=') + tagIndex; // Find where the src attribute starts
					var srcStart = srcIndex + 5; // Find where the actual image URL starts; 5 for the length of 'src="'
					var srcEnd = item.description.substring(srcStart).indexOf('"') + srcStart; // Find where the URL ends
					var src = item.description.substring(srcStart, srcEnd); // Extract just the URL
					output += '<div class="blog-element"><img class="img-responsive" src="' + src + '" width="360px" height="240px"></div>';
				}
				output += '<div class="blog-content"><span class="blog-title"><a href="'+ item.link + '">' + item.title + '</a></span>';
				output += '<div class="post-meta"><span>By ' + item.author + '</span></div>';
				var yourString = item.description.replace(/<img[^>]*>/g,""); //replace with your string.
				var maxLength = 500
				var trimmedString = yourString.substr(0, maxLength);
				trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
				output += '<p>' + trimmedString + '...</p>';
				output += '</div></div>';
				return k < 3;
			});
			$content.html(output);
		}
	});
	$("#currentYear").html(new Date().getFullYear());
});