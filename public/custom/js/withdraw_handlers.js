/* Need helpers.js */

// the jQuery DataTable object, this datatable is for withdraw request builder ui
let dataTable = null;
// for the withdrawal-able transactions list
var dataTable_current_offset = null; // you can get current state
// for the withdrawal-able transactions list
var dataTable_current_limit = null; // you can get current state
// for the withdrawal-able trx list
var dataTable_recordsTotal = null;
// for the withdrawal-able trx list
var dataTable_recordsFiltered = null;

window.withdrawable_trx_list = [];
var withdraw_summary = {};

function navigate_to_tab_create_withdraw_request() {
    jQuery('#tab_create_withdraw_request').removeClass('active').addClass('active').attr('aria-current', 'page');
    jQuery('#tab_import_withdraw_request').removeClass('active').removeAttr('aria-current');
    jQuery('#tab_import_withdraw_settings').removeClass('active').removeAttr('aria-current');
    jQuery('#tab_import_refund_and_chargeback').removeClass('active').removeAttr('aria-current');
    jQuery('#pan_import_withdraw_request').hide();
    jQuery('#pan_import_withdraw_settings').hide();
    jQuery('#pan_import_refund_and_chargeback').hide();
    jQuery('#pan_create_withdraw_request').show();
}

function navigate_to_tab_import_withdraw_request() {
    jQuery('#tab_import_withdraw_request').removeClass('active').addClass('active').attr('aria-current', 'page');
    jQuery('#tab_create_withdraw_request').removeClass('active').removeAttr('aria-current');
    jQuery('#tab_import_withdraw_settings').removeClass('active').removeAttr('aria-current');
    jQuery('#tab_import_refund_and_chargeback').removeClass('active').removeAttr('aria-current');
    jQuery('#pan_import_withdraw_request').show();
    jQuery('#pan_create_withdraw_request').hide();
    jQuery('#pan_import_withdraw_settings').hide();
    jQuery('#pan_import_refund_and_chargeback').hide();
}

function navigate_to_tab_import_withdraw_settings() {
    jQuery('#tab_import_withdraw_settings').removeClass('active').addClass('active').attr('aria-current', 'page');
    jQuery('#tab_import_withdraw_request').removeClass('active').removeAttr('aria-current');
    jQuery('#tab_create_withdraw_request').removeClass('active').removeAttr('aria-current');
    jQuery('#tab_import_refund_and_chargeback').removeClass('active').removeAttr('aria-current');
    jQuery('#pan_import_withdraw_settings').show();
    jQuery('#pan_import_withdraw_request').hide();
    jQuery('#pan_create_withdraw_request').hide();
    jQuery('#pan_import_refund_and_chargeback').hide();
}

function navigate_to_tab_import_refund_and_chargeback() {
    jQuery('#tab_import_refund_and_chargeback').removeClass('active').addClass('active').attr('aria-current', 'page');
    jQuery('#tab_create_withdraw_request').removeClass('active').removeAttr('aria-current');
    jQuery('#tab_import_withdraw_request').removeClass('active').removeAttr('aria-current');
    jQuery('#tab_import_withdraw_settings').removeClass('active').removeAttr('aria-current');
    jQuery('#pan_import_refund_and_chargeback').show();
    jQuery('#pan_create_withdraw_request').hide();
    jQuery('#pan_import_withdraw_request').hide();
    jQuery('#pan_import_withdraw_settings').hide();
}

function setup_withdraw_settings_import() {
    jQuery('#withdraw_settings_file').change(async (_event) => {
        if (!_event.target.value) {
            return false;
        }
        /** @type {File} file */
        let excel_file = Array.from(_event.target.files)[0];
        console.log(`reading file ${_event.target.value}`);

        // excel read options
        /** @type {Number} starting from zero */
        let excel_data_first_row = 1;
        let excel_storeid_column = 0;
        let excel_withdraw_settings_column = 4;

        modal_loader();
        /** @type {ArrayBuffer} */
        const data = await excel_file.arrayBuffer();
        const workbook = XLSX.read(data);
        const excel_rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1, defval: ""});
        let data_rows = excel_rows.slice(excel_data_first_row);
        data_rows = data_rows.filter(row => row[excel_storeid_column]);
        data_rows = data_rows.map((row) => {
            return [row[excel_storeid_column], row[excel_withdraw_settings_column]];
        });
        post(window.app.urls.withdraw_settings_save_url, {withdraw_settings_list: data_rows}, (resp) => {
            modal_loader_hide();
            modal_alert("Success");
        });
    });
}

function load_default_withdrawable_list() {
    jQuery('#merchant_id').val('126').trigger('change');
    jQuery('#store_id').on('merchantStoreSelectionLoaded', function (e) {
        jQuery(this).find('option').not(':empty').each((index, option) => {
            if (jQuery(option).val()) {
                jQuery(option).attr('selected', true);
            }
        });
        //jQuery(this).val();
        function startDate(){
            const timestamp = Date.now();
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()-3).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
            console.log(formattedDate, date ); // Output: "2023-07-08"
        }
        function endDate(){
            const timestamp = Date.now();
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
            console.log(formattedDate, date ); // Output: "2023-07-08"
        }
        jQuery('#startDate').val(startDate());
        jQuery('#endDate').val(endDate());
    });
}

function get_selected_merchant_id() {
    return $.map($('#merchant_id').select2('data'), (e) => {
        return e.id;
    })[0];
}

function get_selected_store_id() {
    return $('#store_id').val();
}

function get_selected_start_date() {
    return $('#startDate').val();
}

function get_selected_end_date() {
    return $('#endDate').val();
}

function get_search_field_name() {
    return jQuery('#search_withdrawable_trx_by select').val();
}

function show_list_download_upload_buttons() {
    jQuery('#download_upload_buttons').show();
}

function show_trx_actions() {
    jQuery('#selected_trx_actions').show();
}

function hide_list_download_upload_buttons() {
    jQuery('#download_upload_buttons').hide();
}

function selectMerchantStore(mid, url) {
    $.ajax({
        type: "GET", url: url + mid, success: function (data) {
            var selOpts = "<option value=''>--select an Option--</option>";
            for (i = 0; i < data.data.length; i++) {
                selOpts += "<option value='" + data.data[i]['id'] + "'>" + data.data[i]['username'] + "</option>";
            }
            $('.storid').html(selOpts);
            jQuery('#store_id').trigger({type: 'merchantStoreSelectionLoaded'});
        }
    });
}

// function jQueryDataTableWrapper() {
//
// }
//
// const withdrawable_trx_list_datatable = new jQueryDataTableWrapper();

function load_trx_list_with_datatable(data_url, config) {
    dataTable = jQuery('#myDataTable').on('draw.dt', function (e, settings, json) {
        show_list_download_upload_buttons();
        show_trx_actions();
        modal_loader_hide();
    }).one('preInit.dt', function (e, settings) {
        //show_amount_details(withdraw_summary_url);
    }).on('preXhr.dt', function (e, settings, data) {
        data.search.field = window.app.withdrawable_trx_datatable.search_by;
        return data;
    }).one('xhr.dt', function (e, settings, json) {
        modal_loader_hide();
    }).on('init.dt', function () {
        modal_loader_hide();
    }).on('page.dt', function () {
        modal_loader();
    }).on('length.dt', function () {
        modal_loader();
    }).DataTable({
        language: {
            //searchPlaceholder: "Search By Trx ID",
            search: '',
        }, select: false, destroy: true, search: {
            return: true
        }, ordering: true, serverSide: true, processing: true, pageLength: 1000, lengthMenu: [100, 300, 1000, 3000, 10000, 50000], columns: config.withdrawable_trx_datatable.columnDefs, order: [[2, 'desc']], ajax: {
            "url": data_url, "data": {
                merchant_id: get_selected_merchant_id(), store_id: get_selected_store_id(), start_date: get_selected_start_date(), end_date: get_selected_end_date(), date_format_php: 'Y-m-d'
            }, "dataSrc": function (response) {
                dataTable_recordsTotal = response.recordsTotal;
                dataTable_recordsFiltered = response.recordsFiltered;
                dataTable_current_offset = response.offset;
                dataTable_current_limit = response.limit;
                window.withdrawable_trx_list = response.data;
                return response.data.map((row) => {
                    return ['<input type="checkbox">', row.invoice_no, row.trx_created_at, row.method_name, row.bank_trx_id, row.amount_received, row.commission_amount, row.merchant_payable, row.hold_status, row.comment, row.withdrawable_ready === 1 ? 'yes' : 'no',];
                });
            },
        }, preDrawCallback: function () {
            modal_loader();
        }
    });
}

/**
 * This method only loads dataTable at current pagination state.
 * Important: It does not reload figures summary
 */
function reload_datatable_current_page() {
    modal_loader();
    dataTable.ajax.reload(function () {
        modal_loader_hide();
    }, false);
}

/**
 * Programmatically update a row in the jQuery dataTable
 * @param {Object} update keys should be invoice_no, values should be update spec, i.e., another object with target column name=>value pair. e.g., {'GOL2322323h': {hold: 'Yes', withdrawable: 'no'}}
 */
function datatable_rows_update(update) {
    let table = jQuery('#myDataTable').DataTable();
    let invoice_no_column_index = table.column('invoice_no:name').index();
    table.rows(function (idx, data) {
        return Object.keys(update).includes(data[invoice_no_column_index]);
    }).every(function () {
        let data = this.data();
        let row_invoiceid = this.data()[invoice_no_column_index];
        /** @type Object */
        let update_spec = update[row_invoiceid];
        Object.keys(update_spec).forEach((key) => {
            let value_to_set = update_spec[key];
            let index_for_set = table.column(`${key}:name`).index();
            data[index_for_set] = value_to_set;
        });
        this.data(data);
    });
}

/**
 *
 * @param url
 * @param invoices
 * @param action_type
 * @param callback
 * @deprecated
 */
function trx_hold_status_update(url, invoices, action_type, callback) {
    modal_confirm('Proceed ' + action_type + ' for ' + invoices.length + ' transactions?', function (modal_dom) {
        post(url, {'trx_invoice_no_comma_sep': invoices.join(','), action: action_type}, function (response_data) {
            show_amount_details(withdraw_summary_url);
            let update_spec = {};
            response_data['trx_info'].forEach((row) => {
                update_spec[row.invoice_no] = {is_hold: row.is_hold, withdrawable: row.withdrawable};
            });
            datatable_rows_update(update_spec);
            modal_dom.hide_modal();
            modal_alert(`${response_data['msg']}: ${response_data['_affected_count']} entries updated`);
            callback(response_data);
        });
    });
}

/**
 *
 * @returns {*[]} array of selected invoice_no
 */
function withdrawable_trx_select_all() {
    jQuery('#myDataTable td.cell_select_checkbox input').each(function (index, element) {
        jQuery(element).prop('checked', true);
    });
}

function withdrawable_trx_unselect_all() {
    jQuery('#myDataTable td.cell_select_checkbox input').each(function (index, element) {
        jQuery(element).prop('checked', false);
    });
}

function withdrawable_trx_selected_invoice_no() {
    return jQuery('#myDataTable td.cell_select_checkbox input').map(function (index, element) {
        if (jQuery(element).is(':checked')) {
            let dataTable = jQuery('#myDataTable').DataTable();
            let dt_row = dataTable.row(jQuery(element).closest('tr')[0]);
            let dt_row_data = dt_row.data();
            let invoice_no = dt_row_data[dataTable.column('invoice_no:name').index()];
            return invoice_no;
        }
    }).get();
}

/**
 *
 * @param data_url
 * @deprecated
 */
function load_refund_and_chargeback_trx_list_with_datatable(data_url) {
    dataTable = jQuery('#refund_and_chargeback_DataTable').one('draw.dt', function (e, settings, json) {
        //show_list_download_upload_buttons();
    }).one('preInit.dt', function (e, settings) {
        //show_amount_details(withdraw_summary_url);
    }).one('preXhr.dt', function (e, settings, data) {
        //modal_loader();
    }).one('xhr.dt', function (e, settings, json) {
        //modal_loader_hide();
    }).DataTable({
        destroy: true,
        searching: false,
        ordering: false,
        serverSide: true,
        processing: true,
        paging: false,
        pageLength: 10,
        lengthMenu: [10, 50],
        columnDefs: [{orderable: false, targets: [0, 3]},],
        columns: [{"name": "invoice_no", searchable: true, title: "Sp Invoice ID"}, {"name": "trx_created_at", searchable: false, title: "Trx Date"}, {"name": "method_name", searchable: false, title: "Trx Method"}, {
            "name": "bank_trx_id",
            searchable: false,
            title: "Trx Ref"
        }, {"name": "amount_received", searchable: false, title: "Transacted Amount"}, {"name": "commission_amount", searchable: false, title: "Commission Amt"}, {
            "name": "row.refund_code",
            searchable: false,
            title: "Refund Code"
        }, {"name": "refund_amount", searchable: false, title: "Refund Amt"}, {"name": "chargeback_amount", searchable: false, title: "Chargeback Amt"}, {"name": "merchant_payable", searchable: false, title: "Merchant Payable"}, {
            "name": "type",
            searchable: false,
            title: "Type"
        },],
        order: [[1, 'desc']],
        ajax: {
            "url": data_url, "data": {
                merchant_id: get_selected_merchant_id(), store_id: get_selected_store_id(), start_date: get_selected_start_date(), end_date: get_selected_end_date(),
            }, "dataSrc": function (response) {
                return response.data.map((row) => {
                    return [row.invoice_no, row.trx_created_at, row.method_name, row.bank_trx_id, numberWithCommas(row.amount_received), numberWithCommas(row.commission_amount), row.refund_code, numberWithCommas(row.refund_amount), numberWithCommas(row.chargeback_amount), numberWithCommas(row.merchant_payable), row.is_refund ? 'Refund(' + row.refund_status_text + ')' : 'Chargeback',];
                });
            },
        }
    });
}

function show_amount_details(withdraw_summary_url) {
    const loader_id = (new Date()).getTime();
    $.ajax({
        type: "GET", url: withdraw_summary_url, dataType: "json", data: {
            merchant_id: get_selected_merchant_id(), store_id: get_selected_store_id(), start_date: get_selected_start_date(), end_date: get_selected_end_date()
        }, beforeSend: function () {
            inline_loader(jQuery('#summary_total_amount'), loader_id);
        }, complete: function () {
            inline_loader_close(jQuery('#summary_total_amount'), loader_id);
        }, success: function (response) {
            window.withdraw_summary = response;
            /*
            $('#alltime_total_trx_count').val(response['alltime_count']);
            $('#alltime_total_amount_received').val(numberWithCommas(response['alltime_total_amount_received']));
            $('#withdraw_requested_amount_received').val(numberWithCommas(response['withdraw_requested_amount_received']));
            $('#withdraw_settled_amount_received').val(numberWithCommas(response['withdraw_settled_amount_received']));
            $('.hold-com-amount').val(numberWithCommas(response['hold_total_commission_amt']));
            $('#except_hold_total_commission_amt').val(numberWithCommas(response['except_hold_total_commission_amt']));
             */
            $('#summary_total_amount').val(numberWithCommas(response['withdrawable_total_amount_received']));
            $('#summary_total_hold_amount').val(numberWithCommas(response['hold_total_amount_received']));
            $('#summary_net_amount').val(numberWithCommas(response['withdrawable_total_amount_received'] - response['hold_total_amount_received']));
            $('#summary_total_commission_amount').val(numberWithCommas(response['withdrawable_total_commission_amt']));
            $('#summary_total_chargeback_amount').val(numberWithCommas(response['chargeback_total_amount']));
            $('#summary_total_refund_amount').val(numberWithCommas(response['refund_total_amount']));
            $('#summary_total_payable_amount').val(numberWithCommas(response['withdrawable_ready_merchant_payable']));
        }
    });
}

function create_withdraw_request(url, success_callback) {
    if (withdraw_summary['payable_amount'] <= 0) {
        alert('Error: Payable amount is zero!');
        return false;
    }
    $.ajax({
        type: "GET", url: url, dataType: "json", data: {
            merchant_id: get_selected_merchant_id(), store_id: get_selected_store_id(), start_date: get_selected_start_date(), end_date: get_selected_end_date(), background_worker: window.background_worker
        }, beforeSend: function () {
            modal_loader();
        }, complete: function () {
            modal_loader_hide();
        }, success: function (response) {
            success_callback(response);
        }
    });
}

function export_list(maker_url, follow_pagination = true) {
    let merchant_id = get_selected_merchant_id();
    let store_id = jQuery('#store_id').val();
    if (!merchant_id || !store_id) {
        modal_alert('Select merchant and store');
        return;
    }
    let payload = {
        //background_worker: !follow_pagination && dataTable_recordsFiltered > window.excel_row_limit_for_download_thru_browser,
        merchant_id: get_selected_merchant_id(), store_id: get_selected_store_id(), start_date: get_selected_start_date(), end_date: get_selected_end_date()
    };
    if (follow_pagination) {
        payload.start = dataTable_current_offset;
        payload.length = dataTable_current_limit;
    }
    modal_loader();
    $.ajax({
        type: "GET", url: maker_url, data: payload, beforeSend: function () {
            modal_loader();
        }, complete: function () {
            modal_loader_hide();
        }, success: function (download_url) {
            window.open(download_url, '_blank');
        }
    });
}

/************************************* withdraw request listing *************************************/

// this datatable variables are for withdraw request listing
let withdraw_listing_dataTable = null; // the jQuery DataTable object

// bellow two variables are for memory, i.e.,  Excel download by pagination
var withdraw_listing_dataTable_current_offset = null; // you can get current state // TODO this with datatable js api
var withdraw_listing_dataTable_current_limit = null; // you can get current state // TODO this with datatable js api

function load_withdraw_list_with_datatable(data_url) {
    withdraw_listing_dataTable = $('#myDataTable')
        .one('preXhr.dt', function (e, settings, data) {
            modal_loader();
        }).one('draw.dt', function (e, settings) {
            modal_loader_hide();
        }).one('init.dt', function (e, settings, json) {
            if (json.data.length) {
                //show_list_download_upload_buttons();
            } else {
                //hide_list_download_upload_buttons();
            }
        }).DataTable({
            language: {
                search: "Search By Settlement Request ID or Merchant Name"
            },
            destroy: true,
            searching: true,
            search: {
                return: true
            },
            ordering: true,
            serverSide: true,
            processing: true,
            pageLength: 50,
            lengthMenu: [10, 50, 100],
            columnDefs: [{orderable: false, targets: [0, 1, 6, 14, 16]},],
            order: [[8, 'desc']],
            columns: [{"name": "download", searchable: false, className: "cell_download_button", title: 'Download'},
                {"name": "invoice_id", searchable: true, className: "cell_invoice_id", title: 'Settlement Request ID'},
                {"name": "merchant_name", searchable: false, title: 'Merchant'},
                {"name": "store_username", searchable: false, title: 'Store'},
                {"name": "date_from", searchable: false, title: 'From Date'},
                {"name": "date_to", searchable: false, title: 'Reporting Date'},
                {"name": "trx_count", searchable: false, title: 'Trx Count'},
                {"name": "status", searchable: false, title: 'Settlement Request Status'},
                {"name": "created_at", searchable: false, title: 'Settlement Request Created At'},
                {"name": "create_user_full_name", searchable: false, title: 'Settlement Request Created By'},
                {"name": "approved_at", searchable: false, title: 'Settlement Request Approved at'},
                {"name": "deny_at", searchable: false, title: 'Settlement Request Denied At'},
                {"name": "received_amount", searchable: false, title: 'Received Amount'},
                {"name": "commission_amount", searchable: false, className: "", title: 'Commission Amount'},
                {"name": "hold_amount", searchable: false, className: "", title: 'Hold Amount'},
                {"name": "payable_amount", searchable: false, className: "", title: 'Payable Amount'},
                {"name": "actions", searchable: false, className: "withdrawlist_td_action", title: 'Actions'},], //dom: "lriptp",
            ajax: {
                "url": data_url, "data": {
                    merchant_id: get_selected_merchant_id(), store_id: get_selected_store_id(), start_date: $('#startDate').val(), end_date: $('#endDate').val(),
                }, "dataSrc": function (response) {
                    withdraw_listing_dataTable_current_offset = response.offset;
                    withdraw_listing_dataTable_current_limit = response.limit;

                    if (!response.data.length) {
                        //modal_alert('No data available');
                    }

                    return response.data.map((row) => {
                        return ['<button title="Download transactions list excel"><i class="fa fa-download" data-action="download"></i></button>' +
                        (row.attachment_url ? `<a class="ml-4" href="${row.attachment_url}" target="_blank" title="Fund disbursement invoice"><i class="fa fa-link"></i></a>` : ''), '<a href="' + row.url + '">' +
                        row.invoice_id + '</a>', row.merchant_name, row.store_username, row.date_from, row.date_to, row.transactions_count,
                            row.status_text, row.created_at, row.create_user_full_name, row.approved_at, row.deny_at, row.received_amount,
                            row.commission_amount, row.hold_amount, row.payable_amount, '' +
                            (row.status === 1 ? '<button class="btn-outline-primary" type="button" data-action="accept" title="accept settlement request"><i class="fa fa-check-double"></i></button>' +
                                '<button class="ml-2 btn-outline-danger" type="button" data-action="reject" title="reject settlement request" ><i class="fa fa-times"></i></button>' : '')
                            + (row.status === 2 ? '' : '') + (row.status === 3 ? '' : '') + (row.status === 4 ? '' : '') + '',];
                    });
                },
            }
        });
    return withdraw_listing_dataTable;
}

function reload_withdraw_listing_datatable_current_page() {
    modal_loader();
    withdraw_listing_dataTable.ajax.reload(function () {
        modal_loader_hide();
    }, false);
}

function accept_withdraw_request(url, data, success_callback) {
    $.ajax({
        type: "POST", url: url, data: data, dataType: "json", beforeSend: function () {
            modal_loader();
        }, complete: function () {
            modal_loader_hide();
        }, success: function (resp) {
            success_callback(resp);
        }
    });
}

function reject_withdraw_request(url, withdraw_invoice_id, success_callback) {
    $.ajax({
        type: "POST", url: url, data: {invoice_id: withdraw_invoice_id}, dataType: "json", beforeSend: function () {
            modal_loader();
        }, complete: function () {
            modal_loader_hide();
        }, success: function (data) {
            success_callback(data);
        }
    });
}

function disburse_withdraw_request(url, withdraw_invoice_id, success_callback) {
    $.ajax({
        type: "POST", url: url, data: {invoice_id: withdraw_invoice_id}, dataType: "json", beforeSend: function () {
            modal_loader();
        }, complete: function () {
            modal_loader_hide();
        }, success: function (data) {
            success_callback(data);
        }
    });
}

/**
 * Export the trx list of a withdraw request, in excel format
 * @param maker_url
 * @param invoice_id
 */
function export_withdraw_trx_list(maker_url, invoice_id) {
    modal_loader();
    $.ajax({
        type: "GET", url: maker_url, data: {
            invoice_id: invoice_id
        }, beforeSend: function () {
            modal_loader();
        }, complete: function () {
            modal_loader_hide();
        }, success: function (download_url) {
            window.open(download_url, '_blank');
        }
    });
}

function merge_withdraw_requests(url, withdraw_invoice_ids, success_callback) {
    $.ajax({
        type: "POST", url: url, data: {withdraw_invoice_ids: withdraw_invoice_ids}, dataType: "json", beforeSend: function () {
            modal_loader();
        }, complete: function () {
            modal_loader_hide();
        }, success: function (data) {
            success_callback(data);
        }
    });
}

/******************************************************* Withdraw Request Trx Listing *********************************************************/

var withdraw_request_trx_list_dataTable_recordsTotal = null;
var withdraw_request_trx_list_dataTable_recordsFiltered = null;
var withdraw_request_trx_list_dataTable_current_offset = null;
var withdraw_request_trx_list_dataTable_current_limit = null;

/**
 *
 * @param data_url
 * @param invoice_id
 * @return {*|jQuery}
 */
function load_withdraw_request_trx_list_with_datatable(data_url, invoice_id) {
    return jQuery('#withdraw_req_trx_list_datatable').on('draw.dt', function (e, settings, json) {
        show_list_download_upload_buttons();
        //show_trx_actions();
        modal_loader_hide();
    }).one('preInit.dt', function (e, settings) {
    }).on('preXhr.dt', function (e, settings, data) {
        modal_loader();
        data.search_by = window.app.withdraw_request_trxlist_datatable.search_by;
        return data;
    }).one('xhr.dt', function (e, settings, json) {
        modal_loader_hide();
    }).on('init.dt', function (event) {
        modal_loader_hide();
        /** get the name of which column user clicked upon */
        let table = jQuery(event.target).DataTable();

        /** now remove the existing search field selection and rebuild a new one */
        jQuery(event.target).siblings('.dataTables_filter').prepend(() => {
            let options = window.app.trxlist_datatable_columnDefs
                .filter(entry => !!entry.name && entry.searchable)
                .map((entry, _i) => `<option value="${entry.name}">${entry.title}</option>`).join(',');
            let search_markup = `<span>Search By <select name='search_by'><option value="">--</option>${options}</select></span>`;
            let search_element = jQuery(search_markup);
            search_element.find('select').on('change', (event) => {
                window.app.withdraw_request_trxlist_datatable.search_by = event.target.value;
            });
            return search_element;
        });
    }).on('change', 'select[name="search_by"]', (event) => {
        console.log('here');
    }).on('page.dt', function () {
        modal_loader();
    }).on('length.dt', function () {
        modal_loader();
    }).DataTable({
        language: {
            search: ""
        },
        select: true, // TODO use the select plugin
        buttons: ['excel'],
        destroy: true,
        searching: true,
        search: {
            return: true
        },
        ordering: true,
        serverSide: true,
        processing: true,
        pageLength: 1000,
        lengthMenu: [1000, 3000, 10000, 50000],
        paging: true,
        columnDefs: [{orderable: false, targets: [0, 3]},],
        order: [[1, 'desc']],
        columns: window.app.trxlist_datatable_columnDefs,
        ajax: {
            "url": data_url, "data": {
                invoice_id: invoice_id,
            }, "dataSrc": function (response) {
                withdraw_request_trx_list_dataTable_recordsTotal = response.recordsTotal;
                withdraw_request_trx_list_dataTable_recordsFiltered = response.recordsFiltered;
                withdraw_request_trx_list_dataTable_current_offset = response.offset;
                withdraw_request_trx_list_dataTable_current_limit = response.limit;
                //let column_names = response.data[0].keys();
                return response.data.map((row) => {
                    return [row.invoice_no, row.trx_created_at, row.method_name, row.bank_trx_id, row.amount_received, row.commission_amount, row.merchant_payable, row.hold_status, row.refund_status, row.chargeback_status,];
                });
            },
        },
        preDrawCallback: function () {
            modal_loader();
        }
    });
}
