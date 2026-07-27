<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use Illuminate\Http\Request;

class ToolController extends Controller
{
    public function index()
    {
        return Tool::active()
            ->orderBy('order')
            ->orderBy('name')
            ->get()
            ->map(fn($tool) => [
                'id' => $tool->id,
                'name' => $tool->name,
                'slug' => $tool->slug,
                'description' => $tool->description,
                'icon' => $tool->icon,
                'route' => $tool->route,
                'category' => $tool->category,
            ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('q', '');

        if (blank($query)) {
            return $this->index();
        }

        return Tool::active()
            ->search($query)
            ->orderBy('order')
            ->orderBy('name')
            ->get()
            ->map(fn($tool) => [
                'id' => $tool->id,
                'name' => $tool->name,
                'slug' => $tool->slug,
                'description' => $tool->description,
                'icon' => $tool->icon,
                'route' => $tool->route,
                'category' => $tool->category,
            ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:tools',
            'slug' => 'required|string|unique:tools',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'route' => 'required|string',
            'category' => 'required|string',
        ]);

        return Tool::create($validated);
    }
}
