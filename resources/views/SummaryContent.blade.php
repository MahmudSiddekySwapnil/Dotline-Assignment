<div class="container">
    @if(session('success'))
        <div class="alert alert-success" id="success-message">
            {{ session('success') }}
        </div>
    @endif
    @if(session('error'))
        <div class="alert alert-success" id="error-message">
            {{ session('error') }}
        </div>
    @endif
    <div class="form-data">

        <form action="{{ route('processUpload') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <input type="file" name="file" class="btn btn-primary">
            <button type="submit" class="btn btn-primary">Upload</button>
        </form>

    </div>

    @if(session('summaryReport'))
        <h3>Summary Report:</h3>
        <ul>
            @foreach(session('summaryReport') as $key => $value)
                <li>{{ $key }}: {{ $value }}</li>
            @endforeach
        </ul>
    @endif

</div>
