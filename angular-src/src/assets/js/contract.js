(function($) {
    $(document).ready(() => {
    $.fn.checkFileType = function(options) {
        var defaults = {
            allowedExtensions: [],
            success: function() {},
            error: function() {}
        };
        options = $.extend(defaults, options);

        return this.each(function() {

            $(this).on('change', function() {
                var value = $(this).val(),
                    file = value.toLowerCase(),
                    extension = file.substring(file.lastIndexOf('.') + 1);

                if ($.inArray(extension, options.allowedExtensions) == -1) {
                    options.error();
                    $(this).focus();
                } else {
                    options.success();

                }

            });

        });
    };
});

})(jQuery);

$(function() {
    $(document).ready(() => {
    $('#contractFile').checkFileType({
        allowedExtensions: ['pdf'],
        success: function() {
            $("div #upload-contract #message").hide();
        },
        error: function() {
            $("div #upload-contract #message").hide();
            $("div #upload-contract").append(`
                <div id="message" style="color: red; font-size: 14px;">Duhet ngarkuar në formatin pdf!</div>
            `);
            $(this).val('');
        }
    });
    $('.buttonText').text('Ngarko kontratën');
    });
});