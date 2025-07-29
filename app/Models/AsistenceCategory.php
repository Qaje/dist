<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class AsistenceCategory extends BaseModel implements HasMedia,JsonResourceful
{
    use HasFactory, HasJsonResourcefulData,InteractsWithMedia;

    protected $table = "asistence_categories";

    const JSON_API_TYPE = 'asistence-categories';

    public const PATH = 'asistence-category';

    protected $fillable = [
        'name',
        'description',
        'is_active'
    ];

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
        $this->load('asistenceCategory');

        $fields = [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_active' => $this->is_active,
        ];

        // Incluir relaciones si están cargadas
        if ($this->relationLoaded('asistenceCategory')) {
            $fields['asistenceCategory'] = $this->asistenceCategory->prepareAttributes();
        }

        return $fields;
    }

//    public static function getIdFilterFields(): array
//    {
//        return ['id'];
//    }

    public static function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:asistence_categories,name',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ];
    }
//
//    public static function updateRules($id): array
//    {
//        return [
//            'name' => 'required|string|max:255|unique:asistence_categories,name,' . $id,
//            'description' => 'nullable|string|max:1000',
//            'is_active' => 'boolean',
//        ];
//    }
//
//    // Scopes útiles para el CRUD
//    public function scopeActive($query)
//    {
//        return $query->where('is_active', true);
//    }
//
//    public function scopeWithAsistencesCount($query)
//    {
//        return $query->withCount('asistences');
//    }

//     public function prepareLinks()
// {
//     return [
//         'asistences' => route('asistence-categories.asistences', $this),
//         // otros enlaces...
//     ];
// }
}
