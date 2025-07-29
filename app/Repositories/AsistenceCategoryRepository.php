<?php

namespace App\Repositories;

use App\Models\AsistenceCategory;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Picqer\Barcode\BarcodeGeneratorPNG;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class AsistenceCategoryRepository
 */
class AsistenceCategoryRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'name',
        'description',
        'is_active',
        'created_at',
        'updated_at',
    ];

    protected $allowedFields =[
        'name',
        'description',
        'is_active'
    ];

    public function getFieldsSearchable():array
    {
        return $this->fieldSearchable;
    }

    public function model(): string
    {
        return AsistenceCategory::class;
    }

    public function storeAsistenceCategory($input)
    {
        try{
            DB::beginTransaction();
            $service = $this->create($input);
            DB::commit();
            return $service;
        }catch (eXception $e){
            DB:rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());

        }
    }

    public function updateAsistenceCategory($input, $id){
        try {
            DB::beginTransaction();
            $service = $this->update($input, $id);
            DB::commit();
            return $service;
        }catch (Exception $e){
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }


}
