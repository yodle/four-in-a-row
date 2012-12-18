window.yodle = window.yodle || {};
window.yodle.ui = window.yodle.ui || {};
window.yodle.ui.search = (function ($) {

    /////////////////////////////////
    // Private methods and functions
    /////////////////////////////////

    function formatSearchField($field){
        // If field does not have a wrapper
        if ($field.parent('.field-wrapper').length === 0){
            $field.wrap('<div class="field-wrapper"></div>');
        }

        // Targets the field's field-wrapper
        var $fieldWrap = $field.parent('.field-wrapper');

        // Add class of select to wrapper to allow styling
        $fieldWrap.addClass('search');
    }

    function initButtonActivation($field, $button) {
        $button.prop('disabled', true);
        $field.on('keyup paste', function(){
            var $this = $(this);

            // In order to catch the pasted value, the function needs to be deferred to a future loop
            setTimeout(function() {
                if ($this.val().trim() === ''){
                    $button.prop('disabled', true);
                }
                else {
                    $button.prop('disabled', false);
                }
            }, 10);

            
        });
    }

    /////////////////////////////////
    // Public methods and functions
    /////////////////////////////////
    return {
        // Initializes the function. This format's the field and initializes the keyup event.  
        format : function ($selector) {
            var $field = $($selector).find("input[type=search]");

            formatSearchField($field);

            // Initialize button activation if there's a button;
            var $button = $($selector).find("[type=submit]");

            if ($button.length !== 0) {
                initButtonActivation($field, $button);
            }
            
        }
    };
})(jQuery);