<html>
<head>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="{{asset('custom/font-awesome-4.7.0/css/font-awesome.min.css')}}">
    <link rel="stylesheet" href="{{asset('plugins/fontawesome-free/css/all.min.css')}}">
    <!-- Theme style -->
    <link rel="stylesheet" href="{{asset('dist/css/adminlte.min.css')}}">
    <script src="{{asset('plugins/jquery/jquery.min.js')}}"></script>
    <!-- Bootstrap 4 -->
    <script src=" {{asset('plugins/bootstrap/js/bootstrap.bundle.min.js')}}"></script>
    <link rel="stylesheet" type="text/css" href="{{asset('plugins/DataTables/datatables.min.css')}}"/>
    <script type="text/javascript" src="{{asset('plugins/DataTables/datatables.min.js')}}"></script>
    <script type="text/javascript" src="https://cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/vfs_fonts.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/buttons/1.3.1/js/buttons.html5.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/buttons/2.2.3/js/buttons.print.min.js"></script>
    <link rel="stylesheet" href="front_assets/css/custom.css">

</head>
<body>

<div class="container-fluid">
    <div class="row">
        <div class="col-lg-12">
            <div class="card card-primary card-outline">
                <div class="card-body">
                    @include('SummaryContent')
                    <div class="col-12">
                        <div class="row">

                            <div class="col-lg-12">
                                <br>
                                <div class="card-body">
                                    <section class="content">
                                        <table id="users_table" class="table table-striped table-bordered"
                                               style="width:100% ">
                                            <thead>
                                            <tr>
                                                <th>NAME</th>
                                                <th>EMAIL</th>
                                                <th>PHONE</th>
                                                <th>GENDER</th>
                                                <th>ADDRESS</th>
                                            </tr>
                                            </thead>
                                        </table>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<script type="text/javascript" language="javascript">
    $(document).ready(function () {
        $('#users_table thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#users_table thead');
        $('#users_table').DataTable({
            buttons: {
                dom: {
                    button: {
                        className: 'btn btn-outline-info ml-2 mb-4'
                    }
                },
                buttons: [
                    {
                        extend: 'excel',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        titleAttr: 'Export Excel',
                        filename: 'users_list'
                    },
                    {
                        extend: 'csvHtml5',
                        text: '<i class="fa fa-file-csv"></i>',
                        titleAttr: 'Export CSV',
                        filename: 'users_list'
                    },
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fa fa-file-pdf-o"></i>',
                        titleAttr: 'Export PDF',
                        orientation: 'landscape',
                        pageSize: 'LEGAL',
                        filename: 'users_list',
                    },
                    {
                        extend: 'print',
                        text: '<i class="fa fa-print"></i>',
                        titleAttr: 'Print',
                        title: 'users_list'
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-files-o"></i>',
                        titleAttr: 'Copy Data to Clipboard',
                    }
                ],
            },
            orderCellsTop: true,
            // fixedHeader: true,
            "language": {
                searchPlaceholder: "Search In Table Data",
                search: "",
            },
            searching: true,
            pageLength: 25,
            order: [[3, 'desc']], //making default sort and order on column 6
            columnDefs: [
                // {orderable: false, targets: 3}
            ], //restricting sort and order on column 8

            ajax: {
                url: "{{url('data/data_list')}}",
            },
            // serverSide: true,
            processing: true,
            dom: '<"toolbar">RlBfrtip',
            initComplete: function () {
                $("#users_table").wrap("<div style='overflow-x:auto; width:100%;'> </div>"); //to make the table horizontally scrollable
                var api = this.api();
                // For each column
                api
                    .columns()
                    .eq(0)
                    .each(function (colIdx) {
                        // Set the header cell to contain the input element
                        var cell = $('.filters th').eq(
                            $(api.column(colIdx).header()).index()
                        );
                        var title = $(cell).text();
                        $(cell).html('<input type="text" placeholder="' + title + '" />');
                        // On every keypress in this input
                        $(
                            'input',
                            $('.filters th').eq($(api.column(colIdx).header()).index())
                        )
                            .off('keyup change')
                            .on('change', function (e) {
                                // Get the search value
                                $(this).attr('title', $(this).val());
                                var regexr = '({search})'; //$(this).parents('th').find('select').val();

                                var cursorPosition = this.selectionStart;
                                // Search the column for that value
                                api
                                    .column(colIdx)
                                    .search(
                                        this.value != ''
                                            ? regexr.replace('{search}', '(((' + this.value + ')))')
                                            : '',
                                        this.value != '',
                                        this.value == ''
                                    )
                                    .draw();
                            })
                            .on('keyup', function (e) {
                                e.stopPropagation();

                                $(this).trigger('change');
                                $(this)
                                    .focus()[0]
                                    .setSelectionRange(cursorPosition, cursorPosition);
                            });
                    });
            },
            "columns": [
                {data: "name"},
                {data: "email"},
                {data: "phone_number"},
                {data: "gender"},
                {data: "address"},
            ],
        });
    });
</script>
<script src="front_assets/js/custom.js"></script>

</body>
</html>
