(function() {
	var support = { animations : Modernizr.cssanimations },
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		animClassNames = ['fxSoftScale', 'fxPressAway', 'fxSideSwing', 'fxFortuneWheel', 'fxSwipe', 'fxPushReveal', 'fxSnapIn', 'fxLetMeIn', 'fxStickIt', 'fxArchiveMe', 'fxVGrowth', 'fxSlideBehind', 'fxSoftPulse', 'fxEarthquake', 'fxCliffDiving']
		container = document.getElementById( 'container' ),
		items = container.querySelector( 'ul.itemwrap' ).children,
		current = 0,
		itemsCount = items.length,
		isAnimating = false;

	function init() {
		changeEffect(animClassNames[11]);
	}


	function changeEffect(className) {
		container.className = container.className.replace(/\bfx.*?\b/g, '');
		classie.addClass( container, className);
	}

	function navigate( dir ) {
		if( isAnimating ) return false;
		isAnimating = true;
		var cntAnims = 0;

		var currentItem = items[ current ];

		if( dir === 'next' ) {
			current = current < itemsCount - 1 ? current + 1 : 0;
		}
		else if( dir === 'prev' ) {
			current = current > 0 ? current - 1 : itemsCount - 1;
		}

		var nextItem = items[ current ];

		var onEndAnimationCurrentItem = function() {
			this.removeEventListener( animEndEventName, onEndAnimationCurrentItem );
			classie.removeClass( this, 'current' );
			classie.removeClass( this, dir === 'next' ? 'navOutNext' : 'navOutPrev' );
			++cntAnims;
			if( cntAnims === 2 ) {
				isAnimating = false;
			}
		}

		var onEndAnimationNextItem = function() {
			this.removeEventListener( animEndEventName, onEndAnimationNextItem );
			classie.addClass( this, 'current' );
			classie.removeClass( this, dir === 'next' ? 'navInNext' : 'navInPrev' );
			++cntAnims;
			if( cntAnims === 2 ) {
				isAnimating = false;
			}
		}

		if( support.animations ) {
			currentItem.addEventListener( animEndEventName, onEndAnimationCurrentItem );
			nextItem.addEventListener( animEndEventName, onEndAnimationNextItem );
		}
		else {
			onEndAnimationCurrentItem();
			onEndAnimationNextItem();
		}

		classie.addClass( currentItem, dir === 'next' ? 'navOutNext' : 'navOutPrev' );
		classie.addClass( nextItem, dir === 'next' ? 'navInNext' : 'navInPrev' );
	}

	init();
	
	setInterval(function(){
		
		//index = parseInt(Math.random()* 15, 10);
		//changeEffect(animClassNames[index]);

		navigate( 'next' );
	}, 8000)
})();