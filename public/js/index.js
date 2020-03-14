"use strict";

$(function() {
    if( location.search ) {

        var status = location.search.split('=')[1];

        var msg = status === "success" ? '<div class="alert alert-success mt-5">Payment was successful.</div>' : '<div class="alert alert-danger mt-5">Payment failed.</div>';

        $( "#paypal-form" ).append( msg );

    }

    $( "#paypal-form" ).on( "submit", function( e ) {
        e.preventDefault();
        var amount = $( "#amount" ).val();
        var amt = $.trim( amount ).replace( ",", "." );

        if( !isNaN( Number( amt ) ) ) {
            $.post( "/checkout", { amount: amt }, function( response ) {
                if( response.url ) {
                    window.location = response.url;
                }
            });
        }
    });
});