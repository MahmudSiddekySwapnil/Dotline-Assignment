// require helpers.js
function hold_trx(url, invoice_no, success_callback) {
    $.ajax({
        type: "POST",
        url: url,
        data: {invoice_no: invoice_no, action: 'hold'},
        dataType: "json",
        beforeSend: function () {
            // modal_loader();
        },
        complete: function () {
            // modal_loader_hide();
        },
        success: function (response_data) {
            success_callback(response_data);
            // modal_alert(response_data['msg']);
        }
    });
}

/**
 * Make request to unhold a trx
 * @param unhold_url
 * @param invoice_no
 * @param success_callback
 */
function unhold_trx(unhold_url, invoice_no, success_callback) {
    $.ajax({
        type: "POST",
        url: unhold_url,
        data: {invoice_no: invoice_no, action: 'unhold'},
        dataType: "json",
        beforeSend: function () {
            // modal_loader();
        },
        complete: function () {
            // modal_loader_hide();
        },
        success: function (response_data) {
            success_callback(response_data);
            // modal_alert(response_data['msg']);
        }
    });
}
