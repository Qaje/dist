<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AsistenceCategoryPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear permisos para AsistenceCategory
        $permissions = [
            'manage_asistence_categories',
            'view_asistence_categories',
            'create_asistence_categories',
            'update_asistence_categories',
            'delete_asistence_categories',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web'
            ]);
        }

        // Asignar permisos a roles (ajustar según tus roles)
        $adminRole = Role::where('name', 'admin')->first();
        $managerRole = Role::where('name', 'manager')->first();

        if ($adminRole) {
            $adminRole->givePermissionTo($permissions);
        }

        if ($managerRole) {
            $managerRole->givePermissionTo([
                'manage_asistence_categories',
                'view_asistence_categories',
                'create_asistence_categories',
                'update_asistence_categories',
            ]);
        }
    }
}
