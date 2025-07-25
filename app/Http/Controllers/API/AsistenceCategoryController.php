<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\AppBaseController;
use App\Http\Resources\AsistenceCategoryResource;
use App\Repositories\AsistenceCategoryRepository;

class AsistenceCategoryController extends AppBaseController
{

    private $asistenceCategoryRepository;

    public function __construct(AsistenceCategoryRepository $asistenceCategoryRepository)
    {
        $this->asistenceCategoryRepository = $asistenceCategoryRepository;
    }


    public function show($id): AsistenceCategoryResource
    {
        //$asistenceCategory = AsistenceCategory::find($id);
        $asistenceCategory = $this->asistenceCategoryRepository->find($id);

        if (!$asistenceCategory) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        return new AsistenceCategoryResource($asistenceCategory);
    }
}
