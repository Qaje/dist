<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateAsistenceCategoryRequest;
use App\Http\Requests\UpdateAsistenceCategoryRequest;
use App\Http\Resources\AsistenceCategoryResource;
use App\Models\AsistenceCategory;
use App\Repositories\AsistenceCategoryRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\AsistenceCategoryCollection;
use Illuminate\Http\Resources\Json\ResourceCollection;

class AsistenceCategoryController extends AppBaseController
{
    private $asistenceCategoryRepository;

    public function __construct(AsistenceCategoryRepository $asistenceCategoryRepository)
    {
        $this->asistenceCategoryRepository = $asistenceCategoryRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AsistenceCategoryCollection
    {
        $perPage = getPageSize($request);
        $asistenceCategories = $this->asistenceCategoryRepository->paginate($perPage);
        AsistenceCategoryResource::usingWithCollection();

        return new AsistenceCategoryCollection($asistenceCategories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateAsistenceCategoryRequest $request)
    {
        $input = $request->all();
        $asistenceCategory = $this->asistenceCategoryRepository->storeAsistenceCategory($input);

        return new AsistenceCategoryResource($asistenceCategory);
        // try {
        //     $validated = $request->validate(AsistenceCategory::rules());

        //     $category = AsistenceCategory::create($validated);

        //     return new AsistenceCategoryResource($category);

        // } catch (ValidationException $e) {
        //     return response()->json([
        //         'message' => 'Error de validación',
        //         'errors' => $e->errors()
        //     ], 422);
        // } catch (\Exception $e) {
        //     return response()->json([
        //         'message' => 'Error al crear la categoría',
        //         'error' => $e->getMessage()
        //     ], 500);
        // }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): AsistenceCategoryResource
    {
        $asistenceCategory = $this->asistenceCategoryRepository->with(['asistences'])->find($id);

        if (empty($asistenceCategory)) {
            return $this->sendError('Asistence Category not found');
        }

        //return $this->sendResponse(new AsistenceCategoryResource($asistenceCategory), 'Asistence Category retrieved successfully');
        return new AsistenceCategoryResource($asistenceCategory);
    }
    // {
    //     try {
    //         // Cargar relaciones si se solicita
    //         if ($request->has('with_asistences')) {
    //             $asistenceCategory->load('asistences');
    //         }

    //         if ($request->has('with_count')) {
    //             $asistenceCategory->loadCount('asistences');
    //         }

    //         return new AsistenceCategoryResource($asistenceCategory);

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Error al obtener la categoría',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAsistenceCategoryRequest $request, AsistenceCategory $asistenceCategory): AsistenceCategoryResource
    {
        $this->asistenceCategoryRepository->updateAsistenceCategory($request->all(), $asistenceCategory->id);

        $asistenceCategory->refresh();

        return new AsistenceCategoryResource($asistenceCategory);
        // try {
        //     $validated = $request->validate(
        //         AsistenceCategory::updateRules($asistenceCategory->id)
        //     );

        //     $asistenceCategory->update($validated);

        //     return new AsistenceCategoryResource($asistenceCategory->fresh());

        // } catch (ValidationException $e) {
        //     return response()->json([
        //         'message' => 'Error de validación',
        //         'errors' => $e->errors()
        //     ], 422);
        // } catch (\Exception $e) {
        //     return response()->json([
        //         'message' => 'Error al actualizar la categoría',
        //         'error' => $e->getMessage()
        //     ], 500);
        // }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AsistenceCategory $asistenceCategory): JsonResponse
    {
        $this->asistenceCategoryRepository->delete($asistenceCategory->id);

        return $this->sendSuccess('Asistence Category deleted successfully');
        // try {
        //     // Verificar si tiene asistencias asociadas
        //     if ($asistenceCategory->asistences()->count() > 0) {
        //         return response()->json([
        //             'message' => 'No se puede eliminar la categoría porque tiene asistencias asociadas'
        //         ], 409);
        //     }

        //     $asistenceCategory->delete();

        //     return response()->json([
        //         'message' => 'Categoría eliminada exitosamente'
        //     ], 200);

        // } catch (\Exception $e) {
        //     return response()->json([
        //         'message' => 'Error al eliminar la categoría',
        //         'error' => $e->getMessage()
        //     ], 500);
        // }
    }

    /**
     * Get asistences for a specific category
     */
    // public function asistences(Request $request, AsistenceCategory $asistenceCategory)
    // {
    //     try {
    //         $query = $asistenceCategory->asistences();

    //         // Filtros adicionales para las asistencias
    //         if ($request->has('is_active')) {
    //             $query->where('is_active', $request->boolean('is_active'));
    //         }

    //         if ($request->has('search')) {
    //             $search = $request->get('search');
    //             $query->where(function($q) use ($search) {
    //                 $q->where('name', 'like', "%{$search}%")
    //                   ->orWhere('code', 'like', "%{$search}%")
    //                   ->orWhere('description', 'like', "%{$search}%");
    //             });
    //         }

    //         $perPage = $request->get('per_page', 15);
    //         $asistences = $query->paginate($perPage);

    //         return response()->json($asistences);

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Error al obtener las asistencias de la categoría',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    // /**
    //  * Toggle active status
    //  */
    // public function toggleStatus(AsistenceCategory $asistenceCategory)
    // {
    //     try {
    //         $asistenceCategory->update([
    //             'is_active' => !$asistenceCategory->is_active
    //         ]);

    //         return new AsistenceCategoryResource($asistenceCategory->fresh());

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Error al cambiar el estado de la categoría',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }
}
