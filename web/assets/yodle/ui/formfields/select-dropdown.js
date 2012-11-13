window.yodle = window.yodle || {};
window.yodle.ui = window.yodle.ui || {};
window.yodle.ui.selectDropdown = (function ($) {

	/////////////////////////////////
    // Private methods and functions
    /////////////////////////////////

    function fieldValue($field){
        var $fieldWrap = $field.parent('.field-wrapper');
        var $fieldValue;

        // Determine what the current value of the field is. 
        if ($fieldWrap.has('select option:selected')){
            // If there's an option already selected assign that value to $fieldValue
            $fieldValue = $fieldWrap.find('select option:selected').text();
        } else {
            // If no option has been selected, assign $fieldValue the first option on the list (default value)
            $fieldValue = $fieldWrap.find('select option').eq(0).text();
        }

        return $fieldValue;
    }

    function formatSelectField($field){
        // If field does not have a wrapper
        if ($field.parent('.field-wrapper').length === 0){
            $field.wrap('<div class="field-wrapper"></div>');
        }

        // Targets the field's field-wrapper
        var $fieldWrap = $field.parent('.field-wrapper');

        // Add class of select to wrapper to allow styling
        $fieldWrap.addClass('select');

        // If it currently has no div with a class of selected-option, append it
        if ($fieldWrap.find('.select-option').length === 0) {
            var $selectedOption = $('<div class="select-option"></div>');
            $selectedOption.text(fieldValue($field));
            $fieldWrap.append($selectedOption);
        }
    }

    function updateSelectField($field) {
        var $selectWrap = $field.parent('.select');
        var $selectOption = $field.siblings('.select-option');
        
        $selectOption.text(fieldValue($field));
        //console.log(fieldValue($field));
    }

	/////////////////////////////////
    // Public methods and functions
    /////////////////////////////////
    return {
        // Initializes the function. 
        format : function (selector) {
            var $field = $(selector).find("select"); // find all select fields

            $field.each(function (){
                var $this = $(this);
                
                // Formats select fields
                formatSelectField($this); 
            })

            // Updates select field when form resets
            $('form').on('reset', function(){
                setTimeout(function() {
                    updateSelectField($this);
                }, 500);
            });
            
            // Update select field when option has been selected
            $(selector).on('change keyup', 'select', function(){
                updateSelectField($(this));
            });
        }
    };
})(jQuery);