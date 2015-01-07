$(document).ready(function () {
    ClearField();
    ClearField2()
});

function ClearField() {
    var fields = $('.submit-form input[type="text"]');
    fields.each(function () {
        var this_field = $(this);
        var default_value = this_field.val();
        this_field.focus(function () {
            if (this_field.val() == default_value) {
                this_field.val("");
            }
        });
        this_field.blur(function () {
            if (this_field.val() == "") {
                this_field.val(default_value);
            }
        });
    });
}

function ClearField2() {
    var fields = $('.contact-form input[type="text"]');
    fields.each(function () {
        var this_field = $(this);
        var default_value = this_field.val();
        this_field.focus(function () {
            if (this_field.val() == default_value) {
                this_field.val("");
            }
        });
        this_field.blur(function () {
            if (this_field.val() == "") {
                this_field.val(default_value);
            }
        });
    });
}