<?php

namespace App\Http\Controllers;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateServiceCategoryRequest;
use App\Http\Requests\UpdateServiceCategoryRequest;
use App\Http\Resources\ServiceCategoryResource;
use App\Models\ServiceCategory;
use App\Repositories\ServiceCategoryRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceCategoryAPIController extends AppBaseController
{
    private $serviceCategoryRepository;

    public function __construct(ServiceCategoryRepository $serviceCategoryRepository)
    {
        $this->serviceCategoryRepository = $serviceCategoryRepository;
    }

    /**
     * Display a listing of the Service Categories.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = getPageSize($request);
        $search = $request->filter['search'] ?? '';
        $serviceCategories = $this->serviceCategoryRepository->paginate($perPage, ['*'], 'page', null, $search);

        ServiceCategoryResource::usingWithCollection();

        return $this->sendResponse(
            ServiceCategoryResource::collection($serviceCategories),
            'Service Categories retrieved successfully'
        );
    }

    /**
     * Store a newly created Service Category in storage.
     */
    public function store(CreateServiceCategoryRequest $request): JsonResponse
    {
        $input = $request->all();
        $serviceCategory = $this->serviceCategoryRepository->create($input);

        return $this->sendResponse(
            new ServiceCategoryResource($serviceCategory),
            'Service Category saved successfully'
        );
    }

    /**
     * Display the specified Service Category.
     */
    public function show($id): JsonResponse
    {
        $serviceCategory = $this->serviceCategoryRepository->find($id);

        if (empty($serviceCategory)) {
            return $this->sendError('Service Category not found');
        }

        return $this->sendResponse(
            new ServiceCategoryResource($serviceCategory),
            'Service Category retrieved successfully'
        );
    }

    /**
     * Update the specified Service Category in storage.
     */
    public function update(UpdateServiceCategoryRequest $request, ServiceCategory $serviceCategory): JsonResponse
    {
        $input = $request->all();
        $serviceCategory = $this->serviceCategoryRepository->update($input, $serviceCategory->id);

        return $this->sendResponse(
            new ServiceCategoryResource($serviceCategory),
            'Service Category updated successfully'
        );
    }

    /**
     * Remove the specified Service Category from storage.
     */
    public function destroy(ServiceCategory $serviceCategory): JsonResponse
    {
        // Verificar si hay servicios asociados
        if ($serviceCategory->services()->exists()) {
            return $this->sendError('Cannot delete Service Category. There are services associated with this category.');
        }

        $this->serviceCategoryRepository->delete($serviceCategory->id);

        return $this->sendSuccess('Service Category deleted successfully');
    }
}
