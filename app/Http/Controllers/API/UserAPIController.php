<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateChangePasswordRequest;
use App\Http\Requests\UpdateUserProfileRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\POSRegister;
use App\Models\Role;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;
use App\Models\UserStore;
use App\Repositories\UserRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Class UserAPIController
 */
class UserAPIController extends AppBaseController
{
    /** @var UserRepository */
    private $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function index(Request $request): UserCollection
    {
        $perPage = getPageSize($request);
        $users = $this->userRepository->getUsers($perPage);
        UserResource::usingWithCollection();

        return new UserCollection($users);
    }

    public function store(CreateUserRequest $request): UserResource
    {
        $input = $request->all();
        $user = $this->userRepository->storeUser($input);

        return new UserResource($user);
    }

    public function show($id): UserResource
    {
        $loginUserId = Auth::id();
        $userStore = UserStore::where('user_id', $loginUserId)->first();
        $storeUserId = $userStore ? $userStore->store->user_id : $loginUserId;
        $allStoreTenants = Store::where('user_id', $storeUserId)->pluck('tenant_id')->toArray();

        if (!empty($allStoreTenants)) {
            $query = $this->userRepository->withoutGlobalScope('tenant')
                ->whereIn('tenant_id', $allStoreTenants);
        } else {
            $query = $this->userRepository;
        }

        $user = $query->find($id);

        return new UserResource($user);
    }

    /**
     * @return UserResource|JsonResponse
     */
    public function update(UpdateUserRequest $request, $user)
    {
        $loginUserId = Auth::id();
        $userStore = UserStore::where('user_id', $loginUserId)->first();
        $storeUserId = $userStore ? $userStore->store->user_id : $loginUserId;
        $allStoreTenants = Store::where('user_id', $storeUserId)->pluck('tenant_id')->toArray();

        if (!empty($allStoreTenants)) {
            $query = $this->userRepository->withoutGlobalScope('tenant')
                ->whereIn('tenant_id', $allStoreTenants);
        } else {
            $query = $this->userRepository;
        }
        $user = $query->find($user);

        if (Auth::id() == $user->id) {
            return $this->sendError(__('messages.error.user_cant_updated'));
        }
        $input = $request->all();
        $user = $this->userRepository->updateUser($input, $user->id);

        return new UserResource($user);
    }

    public function destroy($user): JsonResponse
    {
        $loginUserId = Auth::id();
        $userStore = UserStore::where('user_id', $loginUserId)->first();
        $storeUserId = $userStore ? $userStore->store->user_id : $loginUserId;
        $allStoreTenants = Store::where('user_id', $storeUserId)->pluck('tenant_id')->toArray();

        if (!empty($allStoreTenants)) {
            $query = $this->userRepository->withoutGlobalScope('tenant')
                ->whereIn('tenant_id', $allStoreTenants);
        } else {
            $query = $this->userRepository;
        }
        $user = $query->find($user);

        if (Auth::id() == $user->id) {
            return $this->sendError(__('messages.error.user_cant_delete'));
        }

        $user->delete();

        return $this->sendSuccess('User deleted successfully');
    }

    public function editProfile(): UserResource
    {
        $user = Auth::user();

        return new UserResource($user);
    }

    public function updateProfile(UpdateUserProfileRequest $request): UserResource
    {
        $input = $request->all();
        $updateUser = $this->userRepository->updateUserProfile($input);

        return new UserResource($updateUser);
    }

    public function changePassword(UpdateChangePasswordRequest $request): JsonResponse
    {
        $input = $request->all();
        try {
            $this->userRepository->updatePassword($input);

            return $this->sendSuccess(__('messages.success.password_updated'));
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }

    public function updateLanguage(Request $request): JsonResponse
    {
        $language = $request->get('language');
        $user = Auth::user();
        $user->update([
            'language' => $language,
        ]);

        return $this->sendResponse($user->language, 'Language Updated Successfully');
    }

    public function config(Request $request)
    {
        $user = Auth::user();

        $checkSubscription = false;
        $storeModal = false;
        $isSuperAdmin = true;
        $isSubUser = false;

        if (!$user->hasRole(Role::SUPER_ADMIN)) {
            $isSuperAdmin = false;
            if ($user->hasRole(Role::ADMIN) && $user->subscriptions->count() > 0) {
                $activeSubscription = Subscription::where('user_id', $user->id)->where('status', Subscription::ACTIVE)->first();
                if (!empty($activeSubscription)) {
                    $checkSubscription = $activeSubscription->end_date <= Carbon::now();
                }
            } else {
                $isSubUser = true;
                $store = Store::where('tenant_id', $user->tenant_id)->first();
                $activeSubscription = Subscription::where('user_id', $store->user_id)->where('status', Subscription::ACTIVE)->first();
                if (!empty($activeSubscription)) {
                    $checkSubscription = $activeSubscription->end_date <= Carbon::now();
                }
                if (Store::where('tenant_id', $user->tenant_id)->where('status', 1)->exists()) {
                    $storeModal = false;
                } else {
                    $userStores = UserStore::where('user_id', $user->id)->get();
                    if ($userStores->count() > 0) {
                        foreach ($userStores as $userStore) {
                            if ($userStore->store->status == 1) {
                                $storeModal = false;
                                $user->update([
                                    'tenant_id' => $userStore->store->tenant_id
                                ]);
                                break;
                            } else {
                                $userStore->delete();
                                $storeModal = true;
                            }
                        }
                    } else {
                        $storeModal = true;
                    }
                }
            }
        }

        $userPermissions = $user->getAllPermissions()->pluck('name')->toArray();

        $currentSubscription = Subscription::where('user_id', $user->id)->where('status', Subscription::ACTIVE)->first();
        if (!empty($currentSubscription) && isset($currentSubscription->plan->planFeature)) {
            $subscriptionFeature = $currentSubscription->plan->planFeature;
            if (!$subscriptionFeature->pos_management) {
                $userPermissions = array_values(array_diff($userPermissions, ["manage_pos_screen"]));
            }
            if (!$subscriptionFeature->reports) {
                $userPermissions = array_values(array_diff($userPermissions, ["manage_reports"]));
            }
            if (!$subscriptionFeature->emails_support) {
                $userPermissions = array_values(array_diff($userPermissions, ["manage_email_templates"]));
            }
            if (!$subscriptionFeature->sms_support) {
                $userPermissions = array_values(array_diff($userPermissions, ["manage_sms_templates", "manage_sms_apis"]));
            }
            if (!$subscriptionFeature->inventory_management) {
                $userPermissions = array_values(array_diff($userPermissions, []));
            }
            if (!$subscriptionFeature->adjustments) {
                $userPermissions = array_values(array_diff($userPermissions, ["manage_adjustments"]));
            }
            if (!$subscriptionFeature->roles_permission) {
                $userPermissions = array_values(array_diff($userPermissions, ["manage_roles"]));
            }
        }

        $composerFile = file_get_contents('../composer.json');
        $composerData = json_decode($composerFile, true);
        $currentVersion = isset($composerData['version']) ? $composerData['version'] : '';
        $dateFormat = getSettingValue('date_format');

        $openRegister = POSRegister::where('user_id', Auth::id())
            ->whereNull('closed_at')
            ->exists();

        return $this->sendResponse([
            'permissions' => $userPermissions,
            'version' => $currentVersion,
            'date_format' => $dateFormat,
            'store_modal' => $storeModal,
            'is_super_admin' => $isSuperAdmin,
            'is_sub_user' => $isSubUser,
            'is_expired' => $checkSubscription,
            'no_of_stores' => $currentSubscription->plan->no_of_stores ?? 0,
            'is_version' => getSadminSettingValue('show_version_on_footer'),
            'is_currency_right' => getSettingValue('is_currency_right'),
            'open_register' => $openRegister ? false : true,
        ], 'Config retrieved successfully.');
    }

    public function statusUpdate($user_id): JsonResponse
    {
        $user = User::withoutGlobalScope('tenant')->findOrFail($user_id);
        $user->status = $user->status == 1 ? 0 : 1;
        $user->save();

        return $this->sendSuccess(__('messages.success.status_updated'));
    }
}
