$(document).ready(function () {
	$('.main li:has(ul) > a').addClass('more');
	$('a.more').append('<span class="arrow">&nbsp;&nbsp;&raquo;</span>');
	$('.main li').hover(function () {
		$(this).find('ul:first').stop(true, true).animate({
			opacity : 'toggle',
			height : 'toggle'
		}, 50).addClass('active_list');
	}, function () {
		$(this).children('ul.active_list').stop(true, true).animate({
			opacity : 'toggle',
			height : 'toggle'
		}, 50).removeClass('active_list');
	});
});
