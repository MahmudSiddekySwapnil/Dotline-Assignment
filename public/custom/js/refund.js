/**
 * sheetJS date field reading: https://stackoverflow.com/questions/53163552/format-date-with-sheetjs
 */
function setup_refund_list_import() {
    jQuery('#refund_list_file').change(async (_event) => {
        if (!_event.target.value) {
            return false;
        }
        /** @type {File} file */
        let excel_file = Array.from(_event.target.files)[0];
        console.log(`reading file ${_event.target.value}`);

        /** excel options */
        let excel_data_first_row = 1;
        let excel_refund_date_column = alphabet_index('A');
        let excel_bankid_column = alphabet_index('B');
        let excel_refund_status_column = alphabet_index('C');
        let excel_refund_amount_requested_column = alphabet_index('D');
        let excel_refund_amount_paid_column = alphabet_index('E');
        let excel_refund_remarks_column = alphabet_index('F');

        modal_loader();
        /** @type {ArrayBuffer} */
        const data = await excel_file.arrayBuffer();
        const workbook = XLSX.read(data, {cellText: false, cellDates: true});
        let excel_rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1, defval: ""});
        let data_rows = excel_rows.slice(excel_data_first_row);
        data_rows = data_rows.filter(row => row[excel_bankid_column] && row[excel_refund_amount_paid_column] && row[excel_refund_date_column]).map((row) => {
            return {
                date: row[excel_refund_date_column].toISOString ? row[excel_refund_date_column].toISOString() : '',
                bank_trx_id: row[excel_bankid_column],
                refund_code: row[excel_refund_status_column],
                amount_requested: row[excel_refund_amount_requested_column],
                amount_paid: row[excel_refund_amount_paid_column],
                remarks: row[excel_refund_remarks_column]
            };
        });
        //console.dir(data_rows);
        post(window.app.urls.refund_post_url, {refund_list_json: JSON.stringify(data_rows)}, (resp) => {
            modal_loader_hide();
            modal_alert("Success");
            let response_data_rows_indexed = {};
            resp.entries.forEach((entry) => {
                response_data_rows_indexed[entry['bank_trx_id']] = entry;
            });
            excel_rows = excel_rows.slice(excel_data_first_row).map((row, index) => {
                let response_entry = response_data_rows_indexed[row[excel_bankid_column]];
                if (response_entry) {
                    //console.dir(response_entry);
                    row.push(response_entry['invoice_no'] ? `found tx, sp_id:${response_entry['invoice_no']}` : 'not-found tx');
                    row.push(response_entry['has_refund'] ? 'refund exists' : '');
                }
                return row;
            });
            const worksheet = XLSX.utils.json_to_sheet(excel_rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
            XLSX.writeFile(workbook, 'import_report:' + excel_file.name);
        });
    });
    jQuery('#chargeback_list_file').change(async (_event) => {
        if (!_event.target.value) {
            return false;
        }
        /** @type {File} file */
        let excel_file = Array.from(_event.target.files)[0];
        console.log(`reading file ${_event.target.value}`);

        /** excel options */
        let excel_data_first_row = 1;
        let excel_bankid_column = alphabet_index('A');
        let excel_cb_actually_column = alphabet_index('N');
        let excel_cb_success = (text) => {
            return ['SUCCESS', 'REFUNDED', 'ChargeBack'].includes(text);
        };

        modal_loader();
        /** @type {ArrayBuffer} */
        const data = await excel_file.arrayBuffer();
        const workbook = XLSX.read(data);
        let excel_rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1, defval: ""});
        let data_rows = excel_rows.slice(excel_data_first_row).filter(row => row[excel_bankid_column]).map((row) => {
            return {
                bank_trx_id: row[excel_bankid_column]
            };
        });
        post(window.app.urls.chargeback_post_url, {chargeback_list_json: JSON.stringify(data_rows)}, (resp) => {
            modal_loader_hide();
            modal_alert("Success");
            let response_data_rows_indexed = {};
            resp.entries.forEach((entry) => {
                response_data_rows_indexed[entry['bank_trx_id']] = entry;
            });
            excel_rows = excel_rows.slice(excel_data_first_row).map((row, index) => {
                let response_entry = response_data_rows_indexed[row[excel_bankid_column]];
                if (response_entry) {
                    //console.dir(response_entry);
                    row.push(response_entry['invoice_no'] ? `found tx, sp_id:${response_entry['invoice_no']}` : 'not-found tx');
                    row.push(response_entry['has_chargeback'] ? 'chargeback exists' : '');
                }
                return row;
            });
            //console.dir(excel_rows);
            const worksheet = XLSX.utils.json_to_sheet(excel_rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
            XLSX.writeFile(workbook, 'import_report:' + excel_file.name);
        });
    });
}
