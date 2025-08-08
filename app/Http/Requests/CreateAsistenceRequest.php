<?php

namespace App\Http\Requests;

use App\Models\Asistence;
use Illuminate\Foundation\Http\FormRequest;

class CreateAsistenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Obtener las reglas base del modelo
        $rules = Asistence::rules();

        // Agregar reglas específicas para imagen
        $rules['image'] = [
            'nullable',
            'image',
            'mimes:jpeg,png,jpg,gif,webp',
            'max:5120', // 5MB en kilobytes
            'dimensions:min_width=100,min_height=100,max_width=4000,max_height=4000'
        ];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'code.unique' => __('messages.error.code_taken'),
            'images.*.max' => __('messages.error.images_max_size'),

            // Mensajes específicos para imagen
            'image.image' => 'El archivo debe ser una imagen válida.',
            'image.mimes' => 'La imagen debe ser de formato: JPEG, PNG, JPG, GIF o WebP.',
            'image.max' => 'La imagen no puede superar los 5MB.',
            'image.dimensions' => 'La imagen debe tener entre 100x100 y 4000x4000 píxeles.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convertir string booleanos a boolean si vienen del frontend
        if ($this->has('is_active')) {
            $this->merge([
                'is_active' => $this->boolean('is_active'),
            ]);
        }

        // Limpiar campos numéricos vacíos
        $numericFields = [
            'asistence_cost',
            'asistence_price',
            'estimated_duration',
            'order_tax',
            'sale_unit'
        ];

        foreach ($numericFields as $field) {
            if ($this->has($field) && $this->get($field) === '') {
                $this->merge([$field => null]);
            }
        }
    }
}
