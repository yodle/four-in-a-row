// ===============================
//		YODLE LIGHTBOX
// ===============================
// Overview
// -------------------------------
// Yodle Lightbox is a utility to easily facilitate the display of lightboxes. Given the ID of an HTML 
// element (or non-hidden if desired) you can pass the elementID to the lightbox.open() function:
// 
// yodle.ui.lightbox.open('#elementID');
//
// <a href="#" onclick="yodle.ui.lightbox.open('#elementID');">Open as Lightbox</a>
//	
// This utility waits until the lightbox.open() funtion is called before performing any modifications to the page 
// structure. This is because it is forseeable there will be a number of ajax calls required to populate the
// lightbox which would slow the page load down significantly.
// 
// When light.open() is called the function first checks to see if the function has already been called by checking
// for the existence of the extra div stucture required for the display of the lightbox. If it has already been
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
// Lightboxes are used to display information doesn't require direct user action. It can be dismissed by clicking
// outside of the lightbox, pressing the escape key or clicking on the 'X' in the upper, right-hand corner of the 
// lightbox.
// 
// If the information requires explicit user action (choosing yes/no, confirming a delete, etc) use yodle.ui.modal.
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
// Requires yodle.ui.modal
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

yodle.ui.lightbox = (function() {
	/////////////////////////////////
	// Private methods and functions
	////////////////////////////////

	// Function to bind the item to close and the escape key
	function bindEscape(elementId){
		$(document).keyup(function(e){
			if (e.keyCode == 27) {
				yodle.ui.lightbox.close(elementId);
			}
		});	
	}

	// Function to prepend close button and bind it to close
	function createCloseButton(elementId){
		// If there is no element with a class of yo-modal-close, create it
		if ($(elementId).find(".yo-lightbox-close").val() == undefined) {
			$(elementId).prepend("<div class='yo-lightbox-close' style='z-index:52; cursor:pointer;'></div>");
		}

		// Allow the user to click on the close button dismiss the lightbox
		closeOnClick(".yo-lightbox-close", elementId);
	}
	
	// Function to close lightbox on trigger click
	function closeOnClick(elementId, wrapperId){
		$(elementId).click(function(){
			yodle.ui.lightbox.close(wrapperId);
		});
	}

	/////////////////////////////////
	// Public methods and functions
	////////////////////////////////
	return { 
		open: function(elementId, callback){
			var _lightbox = yodle.ui.modal.open(elementId, callback);

			// Change Class to from yo-modal to yo-lightbox for specification
			$(elementId).removeClass('yo-modal').addClass('yo-lightbox');

			// Here is a good place to add extra lightbox specific events, look and feel, etc.
		
			// Allow the user to click on the modal overlay to dismiss the lightbox
			closeOnClick(".yo-modal-overlay", elementId);
			
			// Create a close button and allow the user to click on the button to dismiss the lightbox
			createCloseButton(elementId);
			
			// Allow the user to escape the lightbox by pressing the escape key
			bindEscape(elementId);
			
			// Return the lightbox for chaining
			return _lightbox; 
		},
	
		// Close the lightbox
		close: function(elementId, callback){
			yodle.ui.modal.close(elementId, callback);

			// Unbind the escape key
			$(document).unbind("keyup");
		}

	}; // End Public
})();