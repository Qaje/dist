<?php

namespace App\Repositories;

use App\Models\Asistence;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class AsistenceRepository
 */
class AsistenceRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'name',
        'code',
        'asistence_cost',
        'asistence_price',
        'asistence_unit',
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
        'asistence_cost',
        'asistence_price',
        'asistence_unit',
        'order_tax',
        'tax_type',
        'description',
        'notes',
        'is_active',
        'image_path',
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
     * Store a new assistance with optional image
     */
    public function storeAsistence($input)
    {
        try {
            DB::beginTransaction();

            // DEBUG: Ver datos originales
            \Log::info('=== DEBUG INICIO ===');
            \Log::info('Input original:', array_keys($input));

            // Manejar imagen si fue proporcionada
            if (isset($input['image'])) {
                \Log::info('Imagen detectada, procesando...');
                $imagePath = $this->uploadImage($input['image']);
                $input['image_path'] = $imagePath;

                \Log::info('Imagen procesada, path asignado:', ['image_path' => $imagePath]);
                unset($input['image']); // Remover el archivo del input
            } else {
                \Log::info('NO se detectó imagen en el input');
            }

            // DEBUG: Verificar que image_path esté en el input final
            \Log::info('Input final antes de create:', [
                'keys' => array_keys($input),
                'image_path' => isset($input['image_path']) ? $input['image_path'] : 'NO EXISTE'
            ]);

            // DEBUG: Verificar fillable del modelo
            $model = new \App\Models\Asistence();
            \Log::info('Fillable del modelo:', $model->getFillable());

            // Crear la asistencia
            $asistence = $this->create($input);

            // DEBUG: Verificar inmediatamente después de crear
            \Log::info('Asistencia creada - Verificación inmediata:', [
                'id' => $asistence->id,
                'image_path_directo' => $asistence->image_path,
                'image_path_raw' => $asistence->getRawOriginal('image_path'),
                'attributes' => $asistence->getAttributes()
            ]);

            // Refrescar desde DB para estar seguro
            $asistence->refresh();
            \Log::info('Después de refresh:', [
                'image_path' => $asistence->image_path
            ]);

            DB::commit();

            // Cargar relaciones
            $asistence->load(['category', 'saleUnit']);
            \Log::info('=== DEBUG FIN ===');

            return $asistence;

        } catch (Exception $e) {
            DB::rollBack();

            \Log::error('Error completo:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            // Limpiar imagen subida si hay error
            if (isset($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            throw new UnprocessableEntityHttpException("Error al crear la asistencia: " . $e->getMessage());
        }
    }

    /**
     * Update an assistance with optional image handling
     */
    public function updateAsistence($input, $id)
    {
        try {
            DB::beginTransaction();

            $asistence = $this->find($id);

            if (!$asistence) {
                throw new Exception("Asistencia no encontrada con ID: {$id}");
            }

            $oldImagePath = $asistence->image_path;

            // Manejar eliminación de imagen si se solicita
            if (isset($input['remove_image']) && $input['remove_image']) {
                if ($oldImagePath) {
                    Storage::disk('public')->delete($oldImagePath);
                }
                $input['image_path'] = null;
            }

            // Manejar nueva imagen si fue proporcionada
            if (isset($input['image'])) {
                // Eliminar imagen anterior si existe
                if ($oldImagePath) {
                    Storage::disk('public')->delete($oldImagePath);
                }

                // Subir nueva imagen
                $imagePath = $this->uploadImage($input['image']);
                $input['image_path'] = $imagePath;
            }

            // Remover campos que no van a la base de datos
            unset($input['image'], $input['remove_image']);

            // Actualizar la asistencia
            $asistence = $this->update($input, $id);

            DB::commit();

            // Cargar relaciones
            $asistence->load(['category', 'saleUnit']);

            return $asistence;

        } catch (Exception $e) {
            DB::rollBack();

            // Limpiar nueva imagen si hay error
            if (isset($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            throw new UnprocessableEntityHttpException("Error al actualizar la asistencia: " . $e->getMessage());
        }
    }

    /**
     * Upload image and return the path
     */
    private function uploadImage($imageFile): string
    {
        try {
            // DEBUG: Verificar configuración
            \Log::info('DEBUG - Upload config:', [
                'public_disk_root' => Storage::disk('public')->path(''),
                'public_disk_url' => Storage::disk('public')->url(''),
            ]);

            // Crear directorio si no existe
            if (!Storage::disk('public')->exists('services/images')) {
                Storage::disk('public')->makeDirectory('services/images');
                \Log::info('DEBUG - Directorio creado: services/images');
            }

            // Generar nombre único para el archivo
            $fileName = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();

            // IMPORTANTE: Usar el disco 'public' correctamente
            $path = $imageFile->storeAs('services/images', $fileName, 'public');

            // DEBUG: Verificar que se guardó correctamente
            $fullPath = Storage::disk('public')->path($path);
            $exists = Storage::disk('public')->exists($path);

            \Log::info('DEBUG - Imagen guardada:', [
                'relative_path' => $path,
                'full_path' => $fullPath,
                'exists' => $exists,
                'url' => Storage::disk('public')->url($path)
            ]);

            return $path;

        } catch (Exception $e) {
            \Log::error('DEBUG - Error en uploadImage:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new Exception("Error al subir la imagen: " . $e->getMessage());
        }
    }

    /**
     * Delete assistance with its image
     */
    public function delete($id): bool
    {
        try {
            $asistence = $this->find($id);

            if (!$asistence) {
                return false;
            }

            DB::beginTransaction();

            // Eliminar imagen si existe
            if ($asistence->image_path) {
                Storage::disk('public')->delete($asistence->image_path);
            }

            // Eliminar la asistencia
            $result = parent::delete($id);

            DB::commit();

            return $result;

        } catch (Exception $e) {
            DB::rollBack();

            throw new UnprocessableEntityHttpException("Error al eliminar la asistencia: " . $e->getMessage());
        }
    }
}
