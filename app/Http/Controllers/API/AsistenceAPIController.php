<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateAsistenceRequest;
use App\Http\Requests\UpdateAsistenceRequest;
use App\Http\Resources\AsistenceResource;
use App\Models\Asistence;
use App\Repositories\AsistenceRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\AsistenceCollection;
use Illuminate\Http\Resources\Json\ResourceCollection;

class AsistenceAPIController extends AppBaseController
{
     private $asistenceRepository;

    public function __construct(AsistenceRepository $asistenceRepository)
    {
        $this->asistenceRepository = $asistenceRepository;
    }

    /**
     * Display a listing of the Services.
     */
    public function index(Request $request): AsistenceCollection
    {
        $query = Asistence::with(['saleUnit']);


        $perPage = getPageSize($request);
        $asistences = $this->asistenceRepository;
        $asistences = $asistences->paginate($perPage);
        AsistenceResource::usingWithCollection();

        return new AsistenceCollection($asistences);
    }

    /**
     * Store a newly created Service in storage.
     */
    public function store(CreateAsistenceRequest $request)
    {
        $input = $request->all();
        $asistence = $this->asistenceRepository->storeAsistence($input);

        return new AsistenceResource($asistence);
    }

    /**
     * Display the specified Service.
     */
    public function show($id): AsistenceResource
    {
        $asistence = $this->asistenceRepository->with(['asistenceCategory'])->find($id);

        if (empty($asistence)) {
            return $this->sendError('Asistence not found');
        }

        //return $this->sendResponse(new AsistenceResource($asistence), 'Asistence retrieved successfully');
        return new AsistenceResource($asistence);
    }

    /**
     * Update the specified Asistence in storage.
     */
    public function update(UpdateAsistenceRequest $request, Asistence $asistence): AsistenceResource
    {
    // Actualiza el modelo
    $this->asistenceRepository->update($request->all(), $asistence->id);

    // Refresca el modelo para obtener los últimos datos
    $asistence->refresh();

    // Devuelve el recurso
    return new AsistenceResource($asistence);
        //return $this->sendResponse(new AsistenceResource($asistence), 'Asistence updated successfully');
    }

    /**
     * Remove the specified Asistence from storage.
     */
    public function destroy(Asistence $asistence): JsonResponse
    {
        $this->asistenceRepository->delete($asistence->id);

        return $this->sendSuccess('Asistence deleted successfully');
    }
}
