<?php

namespace App\Repositories;

use App\Models\Permission;
use App\Models\Subscription;
use Illuminate\Support\Facades\Auth;

/**
 * Class PermissionRepository
 */
class PermissionRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'display_name',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'name',
        'description',
    ];

    /**
     * Return searchable fields
     */
    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    /**
     * Configure the Model
     **/
    public function model(): string
    {
        return Permission::class;
    }

    public function getPermission($perPage)
    {
        $user = Auth::user();
        $currentSubscription = Subscription::where('user_id', $user->id)->where('status', Subscription::ACTIVE)->first();
        $restrictedPermissions = [];
        if (!empty($currentSubscription) && isset($currentSubscription->plan->planFeature)) {
            $subscriptionFeature = $currentSubscription->plan->planFeature;

            if (!$subscriptionFeature->pos_management) {
                $restrictedPermissions = array_merge($restrictedPermissions, ["manage_pos_screen"]);
            }
            if (!$subscriptionFeature->reports) {
                $restrictedPermissions = array_merge($restrictedPermissions, ["manage_reports"]);
            }
            if (!$subscriptionFeature->emails_support) {
                $restrictedPermissions = array_merge($restrictedPermissions, ["manage_email_templates"]);
            }
            if (!$subscriptionFeature->sms_support) {
                $restrictedPermissions = array_merge($restrictedPermissions, ["manage_sms_templates", "manage_sms_apis"]);
            }
            if (!$subscriptionFeature->inventory_management) {
                $restrictedPermissions = array_merge($restrictedPermissions, []);
            }
            if (!$subscriptionFeature->adjustments) {
                $restrictedPermissions = array_merge($restrictedPermissions, ["manage_adjustments"]);
            }
            if (!$subscriptionFeature->roles_permission) {
                $restrictedPermissions = array_merge($restrictedPermissions, ["manage_roles"]);
            }
        }

        return $this->model->whereNotIn('name', $restrictedPermissions)->paginate($perPage);
    }
}
