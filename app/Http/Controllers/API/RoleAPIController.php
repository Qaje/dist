<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleCollection;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Repositories\RoleRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleAPIController extends AppBaseController
{
    /**
     * @var RoleRepository
     */
    private $roleRepository;

    public function __construct(RoleRepository $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    public function index(Request $request): RoleCollection
    {
        $perPage = getPageSize($request);
        $roles = $this->roleRepository->withoutGlobalScope('tenant')->where('tenant_id', Auth::user()->tenant_id)->orWhere('name', Role::ADMIN)->paginate($perPage);
        RoleResource::usingWithCollection();

        return new RoleCollection($roles);
    }

    public function store(CreateRoleRequest $request): RoleResource
    {
        $input = $request->all();
        $role = $this->roleRepository->storeRole($input);

        return new RoleResource($role);
    }

    public function show(Role $role): RoleResource
    {
        return new RoleResource($role);
    }

    /**
     * @return RoleResource|JsonResponse
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        if ($role->name == Role::ADMIN) {
            return $this->sendError('Admin role Can\'t be updated.');
        }
        if ($role->name == Role::SUPER_ADMIN) {
            return $this->sendError('Super Admin role Can\'t be updated.');
        }

        $input = $request->all();
        $role = $this->roleRepository->updateRole($input, $role->id);

        return new RoleResource($role);
    }

    public function destroy($id): JsonResponse
    {
        /** @var Role $role */
        $role = Role::findorFail($id);
        if ($role->users->count()) {
            return $this->sendError(__('messages.error.role_cant_delete', ['role' => $role->display_name]));
        }
        $role->delete();

        return $this->sendSuccess('Role deleted successfully');
    }
}
