<?php

namespace App\Http\Controllers;

use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DeviceController extends Controller
{
    
    public function index()
    {
        try {
            $devices = Device::all();
            return response()->json([
                'success' => true,
                'data' => $devices,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching devices',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:light,fan',
            'name' => 'required|string|max:255',
            'settings' => 'required|array',
            'position_x' => 'nullable|integer',
            'position_y' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $device = Device::create($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Device created successfully',
                'data' => $device,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating device',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    
    public function show($id)
    {
        try {
            $device = Device::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $device,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Device not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|in:light,fan',
            'name' => 'sometimes|string|max:255',
            'settings' => 'sometimes|array',
            'position_x' => 'nullable|integer',
            'position_y' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $device = Device::findOrFail($id);
            $device->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Device updated successfully',
                'data' => $device,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating device',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

   
    public function destroy($id)
    {
        try {
            $device = Device::findOrFail($id);
            $device->delete();
            return response()->json([
                'success' => true,
                'message' => 'Device deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting device',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

   
    public function destroyAll()
    {
        try {
            Device::truncate();
            return response()->json([
                'success' => true,
                'message' => 'All devices deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting devices',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
