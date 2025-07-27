<?php

namespace App\Http\Requests;

use App\Models\AsistenceCategory;
use Illuminate\Foundation\Http\FormRequest;

class CreateAsistenceCategoryRequest extends FormRequest
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
        $rules = AsistenceCategory::rules();
        // $rules['name'] = 'required|unique:asistence_categories,name';

        return $rules;
    }

    public function messages(): array
    {
        return [
            'code.unique' => __('messages.error.code_taken'),
            'images.*.max' => __('messages.error.images_max_size'),
        ];
    }
}
