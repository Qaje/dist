<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AsistenceCategory extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    const JSON_API_TYPE = 'asistence-categories';
    public const PATH = 'asistence-category';

    protected $fillable = ['name', 'description', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function asistences()
    {
        return $this->hasMany(Asistence::class, 'asistence_category_id');
    }

    public function prepareLinks(): array
    {
        return [
            'self' => route('asistence-categories.show', $this),
            // 'asistences' => route('asistence-categories.asistences', $this),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description ?? '',
            'is_active' => $this->is_active ?? true,
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
        ];

        // Incluir relaciones si están cargadas
        if ($this->relationLoaded('asistences')) {
            $fields['asistences'] = $this->asistences->map(function ($asistence) {
                return $asistence->prepareAttributes();
            });
        }

        return $fields;
    }

    public static function getIdFilterFields(): array
    {
        return ['id'];
    }

    public static function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:asistence_categories,name',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ];
    }

    public static function updateRules($id): array
    {
        return [
            'name' => 'required|string|max:255|unique:asistence_categories,name,' . $id,
            'description' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ];
    }

    // Scopes útiles para el CRUD
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeWithAsistencesCount($query)
    {
        return $query->withCount('asistences');
    }

//     public function prepareLinks()
// {
//     return [
//         'asistences' => route('asistence-categories.asistences', $this),
//         // otros enlaces...
//     ];
// }
}
