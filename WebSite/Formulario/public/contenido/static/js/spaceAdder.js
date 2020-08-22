$(function () {
    // Remove button click
    $(document).on(
        'click',
        '[data-role="dynamic-fields"] > .form-inline [data-role="remove"]',
        function (e) {
            e.preventDefault();
            $(this).closest('.form-inline').remove();
        }
    );
    // Add button click
    //
    $(document).on(
        'click',
        '[data-role="dynamic-fields"] > .form-inline [data-role="add"]',
        function (e) {
            e.preventDefault();
            //console.log("Entro a la funcion");

            var container = $(this).closest('[data-role="dynamic-fields"]');
            new_field_group = container.children().filter('.form-inline:first-child').clone();
            new_field_group.find('input').each(function () {
                $(this).val('');
                $(this).attr("id", $(this).attr('hint') + "input" + $('#inputCounter').val());
            });

            new_field_group.find('label').each(function () {
                $(this).attr("for", $(this).attr('hint') + "input" + $('#inputCounter').val());
                $('#inputCounter').val(parseInt($('#inputCounter').val()) + 1);
            });

            new_field_group.children().each(function(){
                if( $('#inputCounter').val() >= 1 ){
                    $(this).css("display", "block");
                }
            });

            container.append(new_field_group);

        }
    );
});