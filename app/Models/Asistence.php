<?php
namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class Asistence extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'asistences';

    const JSON_API_TYPE = 'services';
    const PATH = 'service';

    protected $fillable = [
        'name',
        'code',
        'asistence_category_id',
        'asistence_cost',
        'asistence_price',
        'asistence_unit',
        'estimated_duration',
        'order_tax',
        'tax_type',
        'description',
        'notes',
        'sale_unit',
        'is_active',
        'image_path', // Campo para la ruta de la imagen
    ];

    protected $casts = [
        'asistence_cost' => 'float',
        'asistence_price' => 'float',
        'order_tax' => 'float',
        'is_active' => 'boolean',
    ];

    // Agregar estos campos calculados a las respuestas JSON
    protected $appends = ['image_url', 'has_image'];

    /**
     * Obtener la URL completa de la imagen
     */
    public function getImageUrlAttribute()
    {
        if (!$this->image_path) {
            return null;
        }

        // Asegurar que la URL incluya 'services/images/' si no lo tiene
        $imagePath = $this->image_path;

        // Si ya incluye 'services/images/', usar tal como está
        if (strpos($imagePath, 'services/images/') !== false) {
            return url($imagePath);
        }

        // Si no incluye la ruta completa, agregarla
        return url('services/images/' . $imagePath);
    }

    /**
     * Verificar si tiene imagen
     */
    public function getHasImageAttribute(): bool
    {
        return !empty($this->image_path);
    }

    /**
     * Obtener la ruta completa del archivo en el servidor
     */
    public function getImagePathFullAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        return Storage::disk('public')->path($this->image_path);
    }

    /**
     * Verificar si el archivo de imagen existe físicamente
     */
    public function imageExists(): bool
    {
        if (!$this->image_path) {
            return false;
        }

        return Storage::disk('public')->exists($this->image_path);
    }

    /**
     * Eliminar imagen física del servidor
     */
    public function deleteImage(): bool
    {
        if ($this->image_path && Storage::disk('public')->exists($this->image_path)) {
            $deleted = Storage::disk('public')->delete($this->image_path);

            if ($deleted) {
                $this->update(['image_path' => null]);
                return true;
            }
        }

        return false;
    }

    public function category()
    {
        return $this->belongsTo(AsistenceCategory::class, 'asistence_category_id');
    }

    public function saleUnit()
    {
        return $this->belongsTo(Unit::class, 'sale_unit');
    }

    public function prepareLinks(): array
    {
        return [
            'self' => route('asistences.show', $this),
            'category' => route('asistence-categories.show', $this->asistence_category_id),
        ];
    }

    public function prepareAttributes(): array
    {
        $this->load('category');

        $fields = [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'asistence_category_id' => $this->asistence_category_id,
            'asistence_cost' => $this->asistence_cost,
            'asistence_price' => $this->asistence_price,
            'asistence_unit' => $this->asistence_unit,
            'estimated_duration' => $this->estimated_duration,
            'order_tax' => $this->order_tax,
            'tax_type' => $this->tax_type,
            'description' => $this->description,
            'notes' => $this->notes,
            'sale_unit' => $this->sale_unit,
            'is_active' => $this->is_active,

            // Información de imagen
            'image_path' => $this->image_path, // Ruta relativa
            'image_url' => $this->image_url,   // URL completa accesible
            'has_image' => $this->has_image,   // Boolean si tiene imagen

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];

        if ($this->relationLoaded('category')) {
            $fields['category'] = $this->category->prepareAttributes();
        }

        if ($this->relationLoaded('saleUnit') && $this->saleUnit) {
            $fields['sale_unit_name'] = $this->saleUnit->name;
            $fields['sale_unit_data'] = [
                'id' => $this->saleUnit->id,
                'name' => $this->saleUnit->name,
                'short_name' => $this->saleUnit->short_name,
            ];
        }

        return $fields;
    }

    public static function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:100',
            'asistence_category_id' => 'required|exists:asistence_categories,id',
            'asistence_cost' => 'nullable|numeric|min:0',
            'asistence_price' => 'nullable|numeric|min:0',
            'asistence_unit' => 'nullable|string|max:50',
            'estimated_duration' => 'nullable|integer|min:0',
            'order_tax' => 'nullable|numeric|min:0',
            'tax_type' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
            'sale_unit' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            // Reglas para imagen
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'image_path' => 'nullable|string|max:500',
        ];
    }

    /**
     * Boot method para limpiar archivos al eliminar registro
     */
    protected static function boot()
    {
        parent::boot();

        // Eliminar imagen cuando se elimina la asistencia
        static::deleting(function ($asistence) {
            $asistence->deleteImage();
        });
    }
}
