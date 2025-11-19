<?php

namespace App\Http\Controllers;

use App\Models\Preset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PresetController extends Controller
{
    
    public function index()
    {
        try {
            $presets = Preset::all();
            return response()->json([
                'success' => true,
                'data' => $presets,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching presets',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'devices' => 'required|array',
            'devices.*.type' => 'required|in:light,fan',
            'devices.*.name' => 'required|string',
            'devices.*.settings' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $preset = Preset::create($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Preset created successfully',
                'data' => $preset,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating preset',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    
    public function show($id)
    {
        try {
            $preset = Preset::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $preset,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Preset not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

   
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'devices' => 'sometimes|array',
            'devices.*.type' => 'sometimes|in:light,fan',
            'devices.*.name' => 'sometimes|string',
            'devices.*.settings' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $preset = Preset::findOrFail($id);
            $preset->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Preset updated successfully',
                'data' => $preset,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating preset',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

   
    public function destroy($id)
    {
        try {
            $preset = Preset::findOrFail($id);
            $preset->delete();
            return response()->json([
                'success' => true,
                'message' => 'Preset deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting preset',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    
    public function load($id)
    {
        try {
            $preset = Preset::findOrFail($id);
            return response()->json([
                'success' => true,
                'message' => 'Preset loaded successfully',
                'data' => $preset,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error loading preset',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
