<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\dummies;

class UploadController extends Controller
{
    /**
     * This method view the form and datatable for list
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     * @author Mahmud Siddeky Swapnil
     * @Date 08-06-2023
     */
    public function showForm()
    {
        return view('DataList');
    }

    /**
     * This method show data
     * @return array
     * @author Mahmud Siddeky Swapnil
     * @Date 08-06-2023
     */
    public function dataListShow()
    {
        $query = dummies::all();
        Log::info($query);
        return $returnedJson = array("data" => $query);
    }

    /**
     * This process csv file and insert in db also validate file data
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     * @author Mahmud Siddeky Swapnil
     * @Date 08-06-2023
     */


    public function processUpload(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:csv,txt',
            ]);

            if ($request->hasFile('file')) {
                $path = $request->file('file')->getRealPath();
                $data = array_map('str_getcsv', file($path));
                $uniqueData = collect($data)->unique();
                $headerSkipped = false;
                $totalData = count($uniqueData);
                $summaryReport = [
                    'Total Data' => $totalData - 1,
                    'Total Successfully Uploaded' => 0,
                    'Total Duplicate' => 0,
                    'Total Invalid' => 0,
                    'Total Incomplete' => 0,
                ];

                foreach ($uniqueData as $row) {
                    if (!$headerSkipped) {
                        $headerSkipped = true;
                        continue;
                    }

                    $validationResult = $this->validateData($row);
//                    $summaryReport['Total Data']++;

                    if ($validationResult['success']) {
                        $this->createDummyRecord($row);
                        $summaryReport['Total Successfully Uploaded']++;
                    } else {
                        $summaryReport[$validationResult['type']]++;
                    }
                }

                $successMessage = 'Data imported successfully.';
                $errorCount = $summaryReport['Total Duplicate'] + $summaryReport['Total Invalid'] + $summaryReport['Total Incomplete'];

                if ($summaryReport['Total Successfully Uploaded'] > 0) {
                    $successMessage .= ' Uploaded: ' . $summaryReport['Total Successfully Uploaded'];
                }

                if ($errorCount > 0) {
                    $errorMessage = 'Failed to import ' . $errorCount . ' records.';
                    return redirect()->back()->with('error', $errorMessage)->with('summaryReport', $summaryReport);
                } else {
                    return redirect()->back()->with('success', $successMessage)->with('summaryReport', $summaryReport);
                }
            }
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while processing the upload: ' . $e->getMessage());
        }

        return redirect()->back()->with('error', 'Please upload a CSV or TXT file.');
    }


    /**
     * @param $row
     * @return array|true[]
     */
    private function validateData($row)
    {
        $name = $row[0];
        $email = $row[1];
        $phone_number = $row[2];
        $gender = $row[3];
        $address = $row[4];

        if (!preg_match('/^(?:\+?88)?01[3-9]\d{8}$/', $phone_number)) {
            return ['success' => false, 'type' => 'Total Invalid'];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || dummies::where('email', $email)->exists()) {
            return ['success' => false, 'type' => 'Total Invalid'];
        }

        if (dummies::where('phone_number', $phone_number)->orWhere('email', $email)->exists()) {
            return ['success' => false, 'type' => 'Total Duplicate'];
        }

        if (empty($name) || empty($email) || empty($phone_number) || empty($gender) || empty($address)) {
            return ['success' => false, 'type' => 'Total Incomplete'];
        }

        return ['success' => true];
    }

    /**
     * @param $row
     * @return void
     */
    private function createDummyRecord($row)
    {
        $name = $row[0];
        $email = $row[1];
        $phone_number = $row[2];
        $gender = $row[3];
        $address = $row[4];

        dummies::create([
            'name' => $name,
            'email' => $email,
            'phone_number' => $phone_number,
            'gender' => $gender,
            'address' => $address
        ]);
    }


}
