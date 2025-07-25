<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AsistenceCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function asistences()
    {
        return $this->hasMany(Asistence::class, 'asistence_category_id');
    }

    public function prepareAttributes(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
