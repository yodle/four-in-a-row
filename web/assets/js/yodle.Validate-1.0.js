/*!
 * Yodle Validate w/ Tooltip
 * Copyright (c) 2012
 * Version: 1.0
 * Requires: jQuery v1.7.1 or later
 */

function yodleValidate(container, callBackFunction){
	/* Variables */
	var $container = $(container),
		$formInputField = $container.find("input, textarea, select").not("input[type=radio], input[type=checkbox], input[type=submit], input[type=button]"),
		$formRadioCheckboxField = $container.find("input[type=radio], input[type=checkbox]"),
		$formSearchField = $container.find("input[type=search]"),
		timer, country; 
 	

	/* Assign Country */
	country = $container.attr("data-country");
	// Make US the default country
	if (country == '' || country == undefined){
		country = 'US';
	}


 	/* Add Attribute 'novalidate' to Form */
 	$container.attr("novalidate", "novalidate");

 	/* subFunction Calls */
	validateEach();
	helpTipAnimation(); //Animation for Tooltips
	


	$container.on("submit", function() {
		submit = "";

		validateEach("onSubmit");
		if (submit == "yes") {
			if (callBackFunction != undefined){
				return callBackFunction($container.attr("id"));
			} else {
				return true;
			}
			
		} else {
			return false;
		}
	});


	function validateEach(onSubmit){

		/*=== Radio and Checkbox Field Wrap ===*/
		if (onSubmit != 'onSubmit') {
			var testingArg = $.makeArray();
			var i = 0;

			$(container).each(function(){
				$(this).find("input[type=radio], input[type=checkbox]").each(function(index) {
					testingArg[index] = $(this).attr("name");
					//alert($(this).parent("label").html());
				});

				test = $.unique(testingArg);

				$.each(test, function(index) {
					if ($(container + ' input[name="'+ test[index] +'"]').parents(".yv-formField").html() == null) {
						$(container + ' input[name="'+ test[index] +'"]').parent().wrapAll('<div class="yv-formField" />');
					}
				});
			});
		} //End of Radio and Checkbox Field Wrap

		$formRadioCheckboxField.parents(".yv-formField").each(function(index) {
			$radioCheckboxFieldWrap = $(this)
			if (onSubmit != 'onSubmit' && $(this).find(".fieldCaption").length == 0) {
				$(this).append('<div class="fieldCaption"></div>');
			}
			//alert($radioCheckboxFieldWrap.html())
			$this = $(this);
			$fieldCaption = $this.find(".fieldCaption");
			helperText = $this.find("input").attr("data-helperText");
			required = $this.find("input").attr("required");
			formFieldWidth = $this.outerWidth(); // Sets outer width 
			formFieldHeight = $this.outerHeight();
			formFieldHeightExtended = formFieldHeight +18;

			if (helperText != '' && helperText != null && onSubmit != 'onSubmit') {
				$fieldCaption.addClass("helperText");
				$fieldCaption.html(helperText);
				$this.height(formFieldHeightExtended - 2);
			} else {
				$this.css({"background-color" : "transparent", "border-color" : "transparent"})
				$this.height(formFieldHeight - 2);
			}

			//$this.width(formFieldWidth - 2)

			if (required == "required" && onSubmit != "onSubmit" && $(this).parents('.formfield').find('.yv-required-field').length == 0) {
			    $this.parent("fieldset").children("legend").append('<span class="yv-required-field">*</span>');
			}
			
			/* Submit Validation */
			if (onSubmit == "onSubmit") {
				if (validateField("onSubmit") == false){
					submit = "no";
				}
				else if (submit != "no") {
					submit = "yes";
				}
			} 

			/* On Checkbox or Radio select */
			$(this).on("change", function() {
				$radioCheckboxFieldWrap = $(this)
				$fieldCaption = $(this).find(".fieldCaption")
				formFieldWidth = $(this).outerWidth() // Sets outer width 
				formFieldHeight = $(this).outerHeight() -2;
				formFieldHeightExtended = formFieldHeight +18;
				required = $(this).find("input").attr("required")
				helperText = $(this).find("input").attr("data-helperText")

				validateField("onChange");
			});

			/* Validates the fields */
			function validateField(eventType) {
				/* If Not Selected */
				if(eventType == "onSubmit"){
					if(required == 'required') {
			    		if($radioCheckboxFieldWrap.find("label input:checked").val() == null){
			    			isInvalid("required");
			    			return false;
			    		}
			    		else {
			    			isNeither();
			    			return true;
			    		}
			    	} else {
			    		isNeither();
			    	}
				} else if (eventType == "onChange") {
					if(required == 'required') {
			    		if($radioCheckboxFieldWrap.find("input:checked").val() == null){
			    			isInvalid("required");
			    			return false;
			    		}
			    		else {
			    			isNeither();
			    			return true;
			    		}
			    	} else if($radioCheckboxFieldWrap.is(".invalid")) {
			    		isNeither();
			    	}
				} else {
					isNeither();
				}
			}

			/* Valid Entry */
			function isValid() {
				$radioCheckboxFieldWrap.removeClass("invalid").addClass("valid");
				$fieldCaption.removeClass("helperText");
			} // End isValid
			
			/* Invalid Entry */
			function isInvalid(errorType) {
				//$fieldWrap.removeClass("valid").addClass("invalid");
				if (!$radioCheckboxFieldWrap.is(".invalid")) {
					if ($fieldCaption.is(".helperText")) {
						$fieldCaption.removeClass("helperText");
					} else {
						$radioCheckboxFieldWrap.animate({"height": formFieldHeightExtended}, 300 );
					}
					$radioCheckboxFieldWrap.removeClass("valid").addClass("invalid");
					
				}
				$fieldCaption.html('Required.');
			} //End isInvalid

			/* Default View */
			function isNeither() {
				if ($radioCheckboxFieldWrap.is(".invalid")) {
					$radioCheckboxFieldWrap.animate({"height": (formFieldHeight -18)}, 300 );
					$fieldCaption.html('');
				}
				$radioCheckboxFieldWrap.removeClass("invalid").removeClass("valid");
			}//End isNeither

		}); //End of Radio and Checkbox Field Wrap

		/* Search Field */
		$formSearchField.each(function() {
			$inputField = $(this)

			/* Disable Submit Button if Search Field is empty */
			$inputField.on("keyup", function() {
				if ($(this).val() == '') {
					$(this).parents("form").find("button[type=submit], input[type=submit]").attr("disabled", "disabled");
				} else {
					$(this).parents("form").find("button[type=submit], input[type=submit]").removeAttr("disabled");
				}
			});

			$(this).parents("form").find("button[type=submit], input[type=submit]").attr("disabled", "disabled")
		});

		/* Input Field Validation */
		$formInputField.each(function() {
			$inputField = $(this)
			$fieldWrap = $(this).parents(".yv-formField")
			required = $(this).attr("required")
			inputFieldHeightExtended = (+$(this).outerHeight() + 22)
			helperText = $(this).attr("data-helperText")
			helpTip = $(this).attr("data-helpTip")
			type = $(this).attr("type")
			$fieldCaption = $fieldWrap.children(".fieldCaption")
			fieldName = $(this).attr("name")
			fieldId = $(this).attr("id")
			
			/* Submit Validation */
			if (onSubmit == "onSubmit") {
				if (validateField("blur") == false){
					//alert("There's an error.");
					submit = "no";
				}
				else if (submit != "no") {
					submit = "yes";
				}
			} 
			/* For all "text" inputs */
			else if ((type == 'url' || type == 'tel' || type == 'email' || type == 'text' || type == 'password' || type == 'zip' || type == 'postalCode' || type == 'search' || type == 'number' || $(this).is('textarea') || $(this).is('select')) && $fieldWrap.html() == null) {

				/* Add Bottom border to input */
				$(this).css("border", "none");
				$(this).css("border-bottom", "1px solid");
				inputFieldWidth = $(this).outerWidth()
				inputFieldHeight = $(this).outerHeight()
				
				/* Form Field Wrap */
				$(this).wrap('<div class="yv-formField">');  

				$fieldWrap = $(this).parent(".yv-formField")

				$fieldWrap.height(inputFieldHeight - 1); //Sets Width and Height for fieldWrapper
				
				$fieldWrap.append('<div class="fieldCaption"></div>'); 

				/* Help Icon Tooltip Generator */
				if (helpTip != null && helpTip != '') {
					$fieldWrap.prepend('<div class="helpTip"><div class="helpTipContent">' + helpTip + '<span class="helpTip-pointer"></span></div></div>');
					//alert($fieldWrap.find(".helpTip .helpTipContent").outerWidth());
					$helpTipContent = $fieldWrap.find(".helpTip .helpTipContent")
					$helpTipContent.css({"left" : -$helpTipContent.outerWidth()+28, "top" : -$helpTipContent.outerHeight()-18 })
				}
			} 

			/* Automatically add asterisk after a label who's field is required */
			if (required && onSubmit != "onSubmit" && type != 'search' && $(this).parents('.formfield').find('.yv-required-field').length == 0) {
				$("label[for="+ fieldId +"]").append('<span class="yv-required-field">*</span>');
				//alert(required);
			}

			/* On Field Focus */
			$(this).on("focus", function() {
				$inputField = $(this)
				$fieldWrap = $(this).parent(".yv-formField")
				inputFieldHeightExtended = (+$(this).outerHeight() + 22)
				helperText = $(this).attr("data-helperText")
				helpTip = $(this).attr("data-helpTip")
				type = $(this).attr("type")
				required = $(this).attr("required")
				$fieldCaption = $fieldWrap.children(".fieldCaption")

				/* Generate Helper Text */
				generateHelperText("focus");

				/* On Focus Border Color */
				$fieldWrap.addClass("yv-focus");

				$inputField.on("keyup", function() {
					clearTimeout(timer);
					timer = setTimeout(function() {
						if ($inputField.val() != '') {
							validateField("keyup");
						} else {
							isNeither();
							generateHelperText("keyup");
							return true;
						}

					}, 800);
				});

				$inputField.on("change", function() {
					clearTimeout(timer);
					timer = setTimeout(function() {
						if ($inputField.val() != '') {
							validateField("keyup");
						} else if (required != "required" && helperText == "") {
							isNeither();
							generateHelperText("keyup");
							return true;
						}

					}, 800);
				});
				
			});
			
			
			/* On Field Blur */
			$(this).on("blur", function() {
				validateField("blur");
				$fieldWrap.removeClass("yv-focus");
			});
			
			/* Generates Helper Text Content */
			function generateHelperText(eventType) { 
				if (!$fieldWrap.is(".valid") && !$fieldWrap.is(".invalid")) {
					$fieldCaption.addClass("helperText");
					$fieldCaption.html(helperText);
				}
				if (eventType != "blur" && helperText != null && $fieldCaption.is(".helperText") && $fieldWrap.height() != inputFieldHeightExtended) {
					$fieldWrap.animate({"height": inputFieldHeightExtended}, 300 );
				}
				else if (eventType == "blur" && $fieldCaption.is(".helperText") && $fieldWrap.height() == inputFieldHeightExtended) {
					$fieldWrap.animate({"height": (inputFieldHeightExtended -23)}, 300 );
				} 
			}
			
			/* Validates the fields */
			function validateField(eventType) {
				/* Remove all spaces from inputField */
				$trimmedInputField = $inputField.val().replace(/^\s+|\s+$/g, '');

				/* If Empty */ 
				if ($trimmedInputField == "") {
					/* If Required -> tag as invalid */
					if (required == "required") {
						isInvalid("required");
						return false;
					} 
					/* If Optional -> return to neutral state */
					else {
						isNeither();
						generateHelperText(eventType);
						return true;
					}
				} 
				/* If Filled */
				else {
					/* If Valid Entry AND Type Attribute is NOT "Text", "Search", or UNDEFINED -> tag as invalid */
					if( !entryValidation($inputField.val(), type) && type != "text" && type != "search" && type != null && type != "hidden" && !$inputField.is("select") && !$inputField.is("textarea")) { 
						isInvalid(type);
						return false;
					}
					/* If else -> tag as valid */
					else {
						isValid();
						return true;
					}
				}
			}
			
			/* Valid Entry */
			function isValid() {
				$fieldWrap.removeClass("invalid").addClass("valid");
				$fieldCaption.removeClass("helperText");
				if ($fieldWrap.height() == inputFieldHeightExtended) { 
					//alert(inputFieldHeight);
					$fieldWrap.animate({"height": (inputFieldHeightExtended -23)}, 300 );
				}
				$fieldCaption.html('');
			} // End isValid
			
			/* Invalid Entry */
			function isInvalid(errorType) {
				$fieldWrap.removeClass("valid").addClass("invalid");
				$fieldCaption.removeClass("helperText");
				$fieldWrap.animate({"height": inputFieldHeightExtended}, 300 );
				$fieldCaption.html(errorMessage(errorType));
			} //End isInvalid

			/* Default View */
			function isNeither() {
				if (helperText != '' && helperText != null || !$fieldWrap.is(".invalid")) {
					$fieldWrap.removeClass("invalid").removeClass("valid");
				}
			}//End isNeither

		}); //End formInputField.each() function

		/* Error Message */
		function errorMessage(errorType) {
			/* Treat US Postal Codes as Zip */
			if (errorType == 'postalCode' && country == 'US'){
				errorType = "zip";
			}

			switch(errorType) {
				case 'required':
					return 'Required.';
				; //end required
				case 'email':
					return 'Invalid email address.';
				;
				case 'tel':
					return 'Invalid phone number.';
				;
				case 'url':
					return 'Invalid web URL.';
				;
				case 'zip':
					return 'Invalid zip code.';
				;
				case 'postalCode':
					return 'Invalid postal code.';
				;
				case 'number':
					return 'Invalid number.';
				;
			}
		} // End errorMessage

		/* RegExp */
		function entryValidation(entry, type) {
			if (type == 'postalCode'){
				type = type + '-' + country;
			}


			switch(type) {
				case 'email':
					var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
					return pattern.test(entry);
				;
				case 'tel':
					var pattern = new RegExp(/^([0-9]( |-|.)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-|.)?([0-9]{3}( |-|.)?[0-9]{4}|[a-zA-Z0-9]{7})$/);
					return pattern.test(entry);
				;
				case 'url':
					var pattern = new RegExp(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/);
					return pattern.test(entry);
				;
				case 'zip':
					var pattern = new RegExp(/^\d{5}([\-]\d{4})?$/);
					return pattern.test(entry);
				;
				case 'number':
					var pattern = new RegExp(/^\d+/);
					return pattern.test(entry);
				;

				// Postal Code By Country
				case 'postalCode-US':
					var pattern = new RegExp(/^\d{5}([\-]\d{4})?$/);
					return pattern.test(entry);
				;
				case 'postalCode-CA':
					var pattern = new RegExp(/^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy]{1}\d{1}[A-Za-z]{1} *\d{1}[A-Za-z]{1}\d{1}$/);
					return pattern.test(entry);
				;
			}
		};
	}

	function helpTipAnimation() {
		$(".helpTip").hover(function() {
			$content = $(this).children(".helpTipContent")
				currentPos = $content.position()
			
				//alert(currentPos.top);
			$content.css('opacity', 0).show();
			$content.stop().animate({"top": -$content.outerHeight()-8, "opacity": "1"}, 300 );
			
		},
		function() {
			$content = $(this).children(".helpTipContent")

			$content.stop().animate({"top": -$content.outerHeight()-18, "opacity": "0"}, 300, function() {
				$(this).hide();
			} );
		}
		);

	}
}