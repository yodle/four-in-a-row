// ===============================
//		YODLE MODAL
// ===============================
// Overview
// -------------------------------
// Yodle Modal is a utility to easily facilitate the display of modals. Given the ID of an HTML element (or non-hidden 
// if desired) you can pass the elementID to the modal.open() function:
// 
// yodle.ui.modal.open('#elementID');
//
// <a href="#" onclick="yodle.ui.modal.open('#elementID');">Open as Modal</a>
//	
// This utility waits until the modal.open() funtion is called before performing any modifications to the page 
// structure. This is because it is forseeable there will be a number of ajax calls required to populate the
// modals which would slow the page load down significantly.
// 
// When modal.open() is called the function first checks to see if the function has already been called by checking
// for the existence of the extra div stucture required for the display of the modal. If it has already been
// wrapped the object is returned without re-wrapping it. If the ID hasn't been wrapped the extra div structure is
// wrapped around the HTML identified by the ID. The content is also made visible since it will normally have been hidden.
// All future showing and hiding of the modal is controlled by the new wrapper; however, the developer only needs to 
// call the open() and close() funtions with the original elementID.
//
// Open() and close() functions can additionally specify a callback function. This is useful for using
// ajax to load content into a modal dynamically.
//
//
// Interaction Specification
// --------------------------------
// Modals are used to force a user to choose a specific (modal) action without being able to press escape 
// or click outside of the modal to dismiss it. 
//
// If it is desired to present information in a non-modal fashion (allowing the dismissal by pressing the escape
// key, clicking outside of the information window or clicking on a close 'x' in the upper corner) use yodle.lightbox.
//
//
// Functions
// --------------------------------
//
// function open(elementID [, callback])
// 
// -- Allows the user to specify the ID to open and optionally provide a callback function.
//
//
// function close(elementID [, callback])
//
// -- Allows the user to specify the ID to close and optionally provide a callback function.
//
//
// Requirements
// ---------------------------------
// Requires Jquery 1.4.2
//
//
// Change Log
// ---------------------------------
// 2012-05-08 — MJL — Initial creation of the yodle.ui.modal utility.
// 2012-05-09 — MJL — Made the module Jquery 1.4.2 compatible by changing the location where the 
// 					  width of the modal is calculated (1.4.2 only calculates the width of visible elements)
// 2012-05-15 - PRM - Removed the dependency of element from having the class of yo-modal or yo-lightbox,
//					  these classes are now added through the plugin.
//

var yodle = window.yodle || {};
	yodle.ui = window.yodle.ui || {};

yodle.ui.modal = (function() {
	/////////////////////////////////
	// Private methods and functions
	////////////////////////////////
	var offsetMargin = 15 * 2; // This is the margin offset for the 956 grid 
	var modalSuffix = '-yoModalized'; // Add this suffix to the identified IDs for yodle.ui.modal div wrappers
	
	// Wrap the given ID with the div structure necessary for displaying the modals and lightboxes
	function wrapAndPosition(elementId){
		
		// Detach the ID from the page for manipulation
		var _modal = $(elementId).detach();
		
		// Append to the bottom of the page
		$('body').append(_modal);
		
		// Display the content in the identified ID (this will normally have been hidden)
		_modal.show();
		
		// Wrap the ID in a new div that controls it's on/off behavior from this point forward. We create 
		// a new ID appended with the modalSuffix variable
		_modal.wrap('<div id="' + _modal.attr("id") + modalSuffix + '" class="yo-modal-container" / >');
				
		// Append a div that functions as the overlay (washed out background)
		$(elementId + modalSuffix).append('<div class="yo-modal-overlay"></div>');

		// Add Class of Yo-Modal for specification
		$(elementId).addClass('yo-modal');
		
		// Reposition the modal given its width
	   	var _modalWidth = _modal.width() + offsetMargin;
	   	//_modal.css({width: _modalWidth, 'margin-left': '-' + _modalWidth/2 + 'px' }); //* REMOVED setting width - conflicted with mobile *//

	   	// Automatic Default Styles
	   	$(".yo-modal-container").hide();
	   	$(".yo-modal-overlay").css({'position': 'fixed', 'top': '0', 'left': '0', 'margin': '0', 'padding': '0', 'width': '100%', 'height': '100%', 'z-index': '997'});
	}
	
	/////////////////////////////////
	// Public methods and functions
	////////////////////////////////
	return { 
		// This function takes an HTML id and wraps it with the required div structure to display it as a modal
		open: function(elementId, callback){
			// To leave the original IDs intact, we create(d) a wrapper ID with an easily identifiable suffix
			var _modalizedID =  elementId + modalSuffix;
			
			// Attempt to pull up the wrapped ID
			var _modal = $(_modalizedID);
			
			// Check to see if the ID has already been wrapped and exits; if not, wrap it.
			if(_modal.length == 0 ) {
				wrapAndPosition(elementId);
				// Pull up the variable that is newly wrapped
			 	_modal = $(_modalizedID);
			}

			// Reposition the modal relative to the top of the screen
	   		var _modalTopPosition = $(window).scrollTop() + 120 + 'px';
	   		$(elementId).css('top', _modalTopPosition);
			
			// Run callbacks if provided
			if(callback != undefined) {
				callback();
			}
				
			// Display the modal
			_modal.fadeIn();
				
			// Return the modal for chaining
			return _modal;
		},
	
	
		// This funtion closes the modal
		close: function(elementId, callback){
			$(elementId + modalSuffix).fadeOut();
			
			// Run callbacks if provided
			if(callback != undefined) {
				callback();
			}
		}

	}; // End Public	
})();