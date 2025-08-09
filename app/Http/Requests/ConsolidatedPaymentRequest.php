<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConsolidatedPaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'reference' => 'required|string|max:255',
            'payment_date' => 'required|date',
            'payment_type' => 'required|integer|in:1,2,3,4,5', // Ajusta según tus tipos de pago
            'amount' => 'required|numeric|min:0.01',
            'consolidated_sales' => 'required|array|min:1',
            'consolidated_sales.*.id' => 'required|integer|exists:sales,id',
            'consolidated_sales.*.grand_total' => 'required|numeric|min:0',
            'consolidated_sales.*.paid_amount' => 'required|numeric|min:0',
            'customer_id' => 'required|integer|exists:customers,id',
            'payment_allocation' => 'required|array|min:1',
            'payment_allocation.*.sale_id' => 'required|integer|exists:sales,id',
            'payment_allocation.*.allocated_amount' => 'required|numeric|min:0',
            'total_allocated' => 'required|numeric|min:0',
            'remaining_payment' => 'nullable|numeric|min:0',
            'is_consolidated' => 'boolean'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'reference.required' => 'The reference field is required.',
            'payment_date.required' => 'The payment date is required.',
            'payment_date.date' => 'The payment date must be a valid date.',
            'payment_type.required' => 'The payment type is required.',
            'payment_type.in' => 'The selected payment type is invalid.',
            'amount.required' => 'The amount field is required.',
            'amount.numeric' => 'The amount must be a number.',
            'amount.min' => 'The amount must be greater than 0.',
            'consolidated_sales.required' => 'At least one sale must be provided.',
            'consolidated_sales.array' => 'The consolidated sales must be an array.',
            'consolidated_sales.min' => 'At least one sale must be provided.',
            'customer_id.required' => 'The customer ID is required.',
            'customer_id.exists' => 'The selected customer does not exist.',
            'payment_allocation.required' => 'Payment allocation is required.',
            'payment_allocation.array' => 'Payment allocation must be an array.',
            'total_allocated.required' => 'Total allocated amount is required.',
            'total_allocated.numeric' => 'Total allocated must be a number.'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'payment_date' => 'payment date',
            'payment_type' => 'payment type',
            'customer_id' => 'customer',
            'consolidated_sales' => 'sales',
            'payment_allocation' => 'payment allocation',
            'total_allocated' => 'total allocated amount'
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validación personalizada: el monto total asignado no debe exceder el monto del pago
            if ($this->has('amount') && $this->has('total_allocated')) {
                $amount = (float) $this->input('amount');
                $totalAllocated = (float) $this->input('total_allocated');

                if ($totalAllocated > $amount) {
                    $validator->errors()->add('total_allocated', 'The total allocated amount cannot exceed the payment amount.');
                }
            }

            // Validar que la suma de allocations coincida con total_allocated
            if ($this->has('payment_allocation') && $this->has('total_allocated')) {
                $allocations = $this->input('payment_allocation', []);
                $sumAllocations = collect($allocations)->sum('allocated_amount');
                $totalAllocated = (float) $this->input('total_allocated');

                if (abs($sumAllocations - $totalAllocated) > 0.01) { // Permitir diferencia de 1 centavo por redondeo
                    $validator->errors()->add('payment_allocation', 'The sum of individual allocations must match the total allocated amount.');
                }
            }
        });
    }
}
