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
    ];

    public function model(): string
    {
        return AsistenceCategory::class;
    }

}
