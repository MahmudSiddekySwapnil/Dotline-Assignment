function currency_round_2_digit(amount_float) {
    let with2Decimals = amount_float.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    return with2Decimals;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
}

function remove_url_param(url, param_name) {
    let main_parts = url.split("?");
    main_parts[1].split("");
}

function setup_job_notification(url) {
    let already_notified_jobs = [];
    let status_rows = [];
    let markup = jQuery('<div id="notification_div" class="small" style="position: fixed; bottom: 0; z-index: 1000;"><button id="notification_button"><i class="fa fa-bell"></i></button></div>');
    let get_data = () => {
        $.ajax({
            type: "GET",
            url: url,
            data: {},
            dataType: "json",
            beforeSend: function () {
                //modal_loader();
            },
            complete: function () {
                //modal_loader_hide();
            },
            success: function (data) {
                status_rows = data.rows;
                // now do a one time notification for success and failed jobs
                data.rows.forEach((row) => {
                    if (!already_notified_jobs.includes(row.id) && (row.status === 'ended' || row.status === 'failed')) {
                        modal_alert('task ' + row.status + ' ' + row.msg);
                        already_notified_jobs.push(row.id);
                    }
                });
            }
        });
    };

    let interval_id = null;
    markup.on('click', function () {
        modal_alert('<div class="" style="font-size: 1rem;"><table class="table table-bordered table-striped dataTable"><thead><tr><td>type</td><td>status</td><td>result</td></tr></thead><tbody>' + status_rows.map((row) => {
            return '<tr><td>' + row.type + '</td><td>' + row.status + '</td><td>' + row.msg + '</td></tr>';
        }).join('') + '</tbody></table></div>');
    }).on('click', function () {
        get_data();
        if (!interval_id) {
            console.log('setInterval notification fetch');
            interval_id = setInterval(get_data, 1000 * 30);
            setTimeout(() => {
                console.log('clearInterval notification fetch');
                clearInterval(interval_id);
                interval_id = null;
            }, 1000 * 60 * 5);
        }
    }).one('click', () => {
        get_data();
    });

    jQuery('.content-header').after(markup);
}

function modal_alert(content, options) {
    let modal_html = '<div id="com_resgef_modal_alert" class="modal" tabindex="-1" role="dialog" style="z-index: 1250">\n' +
        '  <div class="modal-dialog" role="document">\n' +
        '    <div class="modal-content">\n' +
        '      <div class="modal-header" style="padding: 0.4rem;">\n' +
        '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
        '          <span aria-hidden="true">&times;</span>\n' +
        '        </button>\n' +
        '      </div>\n' +
        '      <div class="modal-body text-center" style="font-size: 1.6rem;">\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>';
    if (!jQuery('#com_resgef_modal_alert').length) {
        jQuery('body').append(modal_html);
    }

    if (jQuery('#com_resgef_modal_alert').hasClass('show')) {
        jQuery('#com_resgef_modal_alert').modal('hide');
    }

    jQuery('#com_resgef_modal_alert div.modal-body').empty().html(content);

    jQuery('#com_resgef_modal_alert').modal({keyboard: true, backdrop: 'static', show: true});

    jQuery('#com_resgef_modal_alert').on('hidden.bs.modal', function () {
        if (options && options.hasOwnProperty('hide_callback')) {
            options.hide_callback();
        }
    })
}

function modal_error(text, options) {
    modal_alert('<div class="text-danger text-center" style="font-size: x-large">' + text + '</div>', options);
}

function modal_loader() {
    let modal_html = '<div id="com_resgef_modal_loader" class="modal" tabindex="-1" role="dialog" style="z-index: 1200">\n' +
        '  <div class="modal-dialog" role="document">\n' +
        '    <div class="modal-content" style="height: 200px;">\n' +
        '      <div class="modal-body text-center d-flex align-items-center justify-content-center" >\n' +
        '        <div class="" style=""><i class="fa fa-spinner fa-spin fa-2x"></i></div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>';
    if (!jQuery('#com_resgef_modal_loader').length) {
        jQuery('body').append(modal_html);
    }
    jQuery('#com_resgef_modal_loader').modal({keyboard: false, backdrop: 'static', show: true});
}

function modal_loader_hide() {
    jQuery('#com_resgef_modal_loader').modal('hide');
}

function inline_loader(jQuery_element, id) {
    jQuery_element.after('<i class="fa fa-spinner fa-spin com_resgef_inline_loader" id="' + id + '"></i>');
}

function inline_loader_close(jQuery_element, id) {
    jQuery_element.siblings('#' + id + '').remove();
}

/**
 * merge source object values into target, matching by keys; preferring values from 'source' i.e., if a 'source' key doesn't exist or value for the key is empty
 * @return {Object}
 * @param default_opts
 * @param provided_opts
 */
function merge_option_objects(default_opts, provided_opts) {
    for (const [key, default_value] of Object.entries(default_opts)) {
        if (provided_opts.hasOwnProperty(key)) {
            default_opts[key] = provided_opts[key];
        }
    }
    return default_opts;
}

/**
 *
 * @param {String} content
 * @param {CallableFunction} confirm_callback
 * @param {String} [footer='']
 * @param {String} [button_name='yes']
 * @param {Object} [user_input] array of objects, each object should have keys 'type', 'name', 'label'
 * @param {Object} options {container: jQuery('#myelementid')}
 * @return jquery
 */
function modal_confirm(content, confirm_callback, footer, button_name, user_input, options) {
    let modal_html = '<div id="" class="modal com_resgef_modal_confirm" tabindex="-1" role="dialog">\n' +
        '  <div class="modal-dialog modal-dialog-scrollable" role="document">\n' +
        '    <div class="modal-content">\n' +
        '      <div class="modal-header">\n' +
        '        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="padding: 0.4rem;">\n' +
        '          <span aria-hidden="true" style="padding: 5px 10px;">&times;</span>\n' +
        '        </button>\n' +
        '      </div>\n' +
        '      <div class="modal-body">\n' +
        '       <div class="modal-body-content text-center" style="font-size: 1.4rem;"></div>\n' +
        '       <div class="user-input" style="margin-top: 30px;"></div>' +
        '           <div style="float: right;margin-top: 20px;margin-right: 10px;">' +
        '           <i class="fa fa-spinner fa-spin proceed_spinner" style="display: none;"></i>' +
        '           <button type="button" class="btn btn-outline-info btn-yes" style="padding: 0 30px;">Yes</button>' +
        '           </div>\n' +
        '      </div>\n' +
        '       <div class="modal-footer"></div>' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>';

    // define default options
    let _default_options = {
        container: jQuery('body'),
        modalize: true
    };

    // populate into user provided options object(if key doesn't exist or value empty for the key) from default values
    options = options ? options : {};
    for (const [key, default_value] of Object.entries(_default_options)) {
        if (!options.hasOwnProperty(key)) {
            options[key] = default_value;
        }
    }

    if (jQuery('.com_resgef_modal_confirm').hasClass('show')) { // no two modals at a time
        jQuery('.com_resgef_modal_confirm').modal('hide');
    }
    let modal_dom = jQuery(modal_html);

    modal_dom.hide_modal = () => {
        modal_dom.modal('hide');
    };

    /**
     *
     * @return {boolean}
     */
    modal_dom.form_valid = () => {
        let name_value_pairs = modal_dom.get_input_list();
        let has_empty_value = false;
        jQuery.each(name_value_pairs, (propname, propval) => {
            has_empty_value = !modal_dom.validate_input(propname);
        });

        return !has_empty_value;
    };

    /**
     * Validate an input element
     * @param input_name
     * @return {boolean} false if no value and required a value, true otherwise
     */
    modal_dom.validate_input = (input_name) => {
        let element = modal_dom.find(`[name="${input_name}"]`);
        if (!element.val()) {
            if (element.prop('required')) { // required and has no value
                element.removeClass('is-valid').addClass('is-invalid');
                return false;
            }
        } else { // has value
            element.removeClass('is-invalid').addClass('is-valid');
        }
        return true;
    };

    /**
     *
     * @returns {{}}
     */
    modal_dom.get_input_list = () => {
        let name_value_pairs = {};
        modal_dom.find('div.user-input :input').each((index, element) => {
            let name = jQuery(element).attr('name');
            name_value_pairs[name] = modal_dom.get_input(name);
        });

        return name_value_pairs;
    };
    modal_dom.get_input = (name) => {
        let element = modal_dom.find(`[name="${name}"]`);
        let value;
        if (element.attr('type') === 'file' && element.val()) {
            value = element[0].files[0];
        } else {
            value = element.val();
        }
        return value;
    };
    modal_dom.set_input = (name, value) => {
        modal_dom.find(`[name="${name}"]`).val(value);
    };
    modal_dom.set_input_feedback = (name, text) => {
        modal_dom.find(`[name="${name}"]`).removeClass('is-invalid').addClass('is-valid');
        modal_dom.find(`[name="${name}"]`).siblings('.valid-feedback').text(text);
    };
    modal_dom.set_input_error = (name, text) => {
        modal_dom.find(`[name="${name}"]`).removeClass('is-valid').addClass('is-invalid');
        modal_dom.find(`[name="${name}"]`).siblings('.invalid-feedback').text(text);
    };
    modal_dom.show_loader = () => {
        modal_dom.find('.proceed_spinner').show();
    };
    modal_dom.hide_loader = () => {
        modal_dom.find('.proceed_spinner').hide();
    };
    modal_dom.set_footer = (text) => {
        modal_dom.find('div.modal-footer').empty().text(text);
    };

    modal_dom.find('.btn-yes').text(button_name ? button_name : 'Yes');
    modal_dom.find('div.modal-body-content').empty().html(content);
    modal_dom.set_footer(footer ? footer : '');

    if (user_input) {
        // generate markup
        let user_input_markup = '';
        user_input.forEach((entry) => {
            let disabled_text = entry.disabled ? 'disabled' : '';
            let required_text = entry.disabled ? '' : 'required';
            if (entry.type === 'text') {
                user_input_markup += '<div class="form-row mb-3"><div class="col"><label>' + entry.label + '</label><input ' + disabled_text + ' ' + required_text + ' class="form-control" type="text" name="' + entry.name + '"><div class="valid-feedback"></div><div class="invalid-feedback">field empty</div></div></div>';
            } else if (entry.type === 'date') {
                user_input_markup += '<div class="form-row mb-3"><div class="col"><label>' + entry.label + '</label><input required class="form-control" type="date" name="' + entry.name + '"><div class="valid-feedback"></div><div class="invalid-feedback">empty date</div></div></div>';
            } else if (entry.type === 'select') {
                let options = '<option value="">--</option>' + entry.options.map((opt) => '<option value="' + opt.id + '" ' + (opt.selected ? 'selected' : '') + '>' + opt.name + '</option>');
                user_input_markup += '<div class="form-row mb-3"><div class="col"><label>' + entry.label + '</label><select required class="form-control" name="' + entry.name + '">' + options + '</select><div class="valid-feedback"></div><div class="invalid-feedback">no option selected</div></div></div>';
            } else if (entry.type === 'file') {
                user_input_markup += '<div class="form-row mb-3"><div class="col"><label>' + entry.label + '</label><input required class="form-control-file" type="file" name="' + entry.name + '" ' + (entry.multiple ? 'multiple' : '') + '><div class="valid-feedback"></div><div class="invalid-feedback">no file selected</div></div></div>';
            }
        });
        // set markup
        modal_dom.find('div.user-input').empty().html('<form class="needs-validation" novalidate>' + user_input_markup + '</form>');
        // set event handlers
        user_input.forEach((entry) => {
            let element = modal_dom.find(`[name="${entry.name}"]`);
            element.on('change', () => {
                modal_dom.validate_input(entry.name);
            });
            if (entry.onchange) {
                element.on('change', (_event) => {
                    entry.onchange(_event, modal_dom);
                });
            }
        });
    }

    options.container.append(modal_dom);

    modal_dom.on('click', '.btn-yes', function () {
        //modal_dom.remove();
        console.log('yes button');
        //modal_dom.show_loader();
        confirm_callback(modal_dom);
        return true;
    }).on('hidden.bs.modal', function (e) {
        console.log('hidden');
        modal_dom.off('click', '.btn-yes');
        modal_dom.remove();
    });

    if (options.modalize) {
        modal_dom.modal({keyboard: false, backdrop: 'static', show: true});
    } else {
        modal_dom.removeClass('modal').removeAttr('tabindex');
        modal_dom.find('.close').remove();
    }

    return modal_dom;
}

/**
 * Pure AJAX file upload
 * @param {String} action_url
 * @param {Object} data
 * @param {CallableFunction} file_preprocessor
 * @param {CallableFunction} response_callback
 * thanks: https://makitweb.com/how-to-upload-image-file-using-ajax-and-jquery/
 * @param {Object} options
 */
function file_upload(action_url, data, file_preprocessor, response_callback, options) {
    jQuery('body').find('#ajax_like_file_upload_div').remove();
    let hidden_inputs = '';
    jQuery.each(data, (prop, val) => {
        hidden_inputs += `<input type="hidden" name="${prop}" value="${val}" />`;
    });
    let markup = jQuery('<div id="ajax_like_file_upload_div" class="" style="display: none">' +
        '<form method="post" enctype="multipart/form-data" action="' + action_url + '">\n' +
        '<input type="file" name="file" value="">\n' +
        hidden_inputs +
        '<input type="submit" id="ajax_like_file_upload_submit">\n' +
        '</form>' +
        '</div>');
    jQuery('#ajax_like_file_upload_div').remove();
    options = merge_option_objects({
        ajax_upload: true
    }, options ? options : {});
    //console.dir(options);

    const input = markup.find('input[type="file"]');
    input.unbind('click');
    input.one('change', function (e) {
        if (options.ajax_upload) {
            let fd = new FormData();
            fd.set('_token', data['csrf_token']);
            delete data['csrf_token'];
            Object.keys(data).forEach(key => {
                fd.set(key, data[key]);
            });
            /** @type FileList */
            let files = jQuery(e.target)[0].files;
            if (file_preprocessor) {
                file_preprocessor(files[0]);
            }
            if (!action_url) {
                return null;
            }
            // Check file selected or not
            if (files.length > 0) {
                fd.set('file', files[0]);
                $.ajax({
                    url: action_url,
                    type: 'post',
                    data: fd,
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    error: function () {
                        modal_error('Error: file upload fail!');
                    },
                    complete: function () {
                        input.val('');
                    },
                    success: function (response) {
                        response_callback(response);
                    },
                });
            } else {
                alert("Please select a file.");
            }
        } else { // regular http upload
            markup.find('form').submit();
        }
    });

    jQuery('body').append(markup);
    input.trigger('click');
}

function get(url, data, success_callback) {
    $.ajax({
        type: "GET",
        url: url,
        data: data,
        dataType: "json",
        beforeSend: function () {

        },
        complete: function () {

        },
        success: function (resp_data) {
            success_callback(resp_data);
        }
    });
}

function post(url, data, success_callback) {
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: "json",
        beforeSend: function () {

        },
        complete: function () {

        },
        success: function (resp_data) {
            success_callback(resp_data);
        }
    });
}

async function excel_file_to_array(file, callback) {
    const data = await file.arrayBuffer();
    /* data is an ArrayBuffer */
    const workbook = XLSX.read(data);
    /* DO SOMETHING WITH workbook HERE */
    let arr = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1});
    callback(arr);
}

/**
 * as the title says, starting from zero. e.g., A/a: 0, B/b: 1 etc
 * @param {String} char
 * @returns {number}
 */
function alphabet_index(char) {
    return char.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
}

/**
 *
 * @param arr
 * @returns []
 */
function array_unique(arr) {
    return arr.filter((value, index, self) => {
        return self.indexOf(value) === index
    });
}
