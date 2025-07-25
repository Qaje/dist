<?php

namespace App\Repositories;

use App\Models\Asistence;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Picqer\Barcode\BarcodeGeneratorPNG;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class AsistenceRepository
 */
class AsistenceRepository extends BaseRepository
{
  protected $fieldSearchable = [
        'name',
        'code',
        'service_cost',
        'service_price',
        'service_unit',
        'order_tax',
        'tax_type',
        'description',
        'notes',
        'is_active',
        'created_at',
    ];

    protected $allowedFields = [
        'name',
        'code',
        'service_cost',
        'service_price',
        'service_unit',
        'order_tax',
        'tax_type',
        'description',
        'notes',
        'is_active',
    ];

    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    public function model(): string
    {
        return Asistence::class;
    }

    /**
     * @return LengthAwarePaginator|Collection|mixed
     */
    public function storeAsistence($input)
    {
        try {
            DB::beginTransaction();
            $service = $this->create($input);
            DB::commit();
            return $service;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return LengthAwarePaginator|Collection|mixed
     */
    public function updateAsistence($input, $id)
    {
        try {
            DB::beginTransaction();
            $service = $this->update($input, $id);
            DB::commit();
            return $service;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

}
