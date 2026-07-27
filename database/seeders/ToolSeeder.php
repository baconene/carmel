<?php

namespace Database\Seeders;

use App\Models\Tool;
use Illuminate\Database\Seeder;

class ToolSeeder extends Seeder
{
    public function run(): void
    {
        Tool::create([
            'name' => 'CCS Interval Read XML Generator',
            'slug' => 'ccs-generator',
            'description' => 'Generate realistic Oracle CCS interval read XML payloads for testing meter payload processing',
            'icon' => 'Zap',
            'route' => '/tools/ccs-generator',
            'category' => 'xml',
            'active' => true,
            'order' => 1,
        ]);
    }
}
