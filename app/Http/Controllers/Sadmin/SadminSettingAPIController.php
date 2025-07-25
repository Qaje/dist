<?php

namespace App\Http\Controllers\Sadmin;

use App\Http\Controllers\AppBaseController;
use App\Http\Resources\SettingResource;
use App\Models\SadminSetting;
use App\Models\State;
use App\Repositories\SadminSettingRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

/**
 * Class SadminSettingAPIController
 */
class SadminSettingAPIController extends AppBaseController
{
    /** @var SadminSettingRepository */
    private $sadminSettingRepository;

    public function __construct(SadminSettingRepository $sadminSettingRepository)
    {
        $this->sadminSettingRepository = $sadminSettingRepository;
    }

    public function index(): JsonResponse
    {
        $keyName = [
            'app_name',
            'app_email',
            'company_name',
            'phone',
            'footer',
            'country',
            'state',
            'city',
            'postcode',
            'address',
            'show_version_on_footer',
            'show_app_name_in_sidebar',
            'admin_default_currency_symbol',
            'admin_default_currency',
            'send_registration_mail',
            'show_landing_page',
        ];
        $settings = SadminSetting::whereIn('key', $keyName)->pluck('value', 'key')->toArray();
        $settings['app_logo'] = getAppLogoUrl();
        $settings['app_favicon'] = getAppFaviconUrl();
        $settings['send_registration_mail'] = isset($settings['send_registration_mail']) ? $settings['send_registration_mail'] : "true";
        $settings['show_landing_page'] = isset($settings['show_landing_page']) ? $settings['show_landing_page'] : 1;

        return $this->sendResponse(
            new SettingResource(['type' => 'settings', 'attributes' => $settings]),
            'Setting value retrieved successfully.'
        );
    }

    public function update(Request $request): JsonResponse
    {

        $input = $request->all();
        $settings = $this->sadminSettingRepository->updateSettings($input);

        return $this->sendResponse(
            new SettingResource(['type' => 'settings', 'attributes' => $settings]),
            __('messages.success.setting_updated')
        );
    }

    public function clearCache(): JsonResponse
    {
        Artisan::call('cache:clear');

        return $this->sendSuccess(__('messages.success.cache_clear_successfully'));
    }

    public function getStates($countryId): JsonResponse
    {
        $states = State::whereCountryId($countryId)->pluck('name');

        return $this->sendResponse(
            new SettingResource(['type' => 'states', 'attributes' => $states]),
            'States retrieved successfully.'
        );
    }

    public function getPaymentSettings(): JsonResponse
    {
        $keyName = [
            'manual_payment_enabled',
            'manual_payment_guide',
            'stripe_enabled',
            'stripe_key',
            'stripe_secret',
            'paypal_enabled',
            'paypal_client_id',
            'paypal_secret',
            'razorpay_enabled',
            'razorpay_key',
            'razorpay_secret',
        ];

        $settings = SadminSetting::whereIn('key', $keyName)->pluck('value', 'key')->toArray();

        $sensitiveKeys = [
            'stripe_key',
            'stripe_secret',
            'paypal_client_id',
            'paypal_secret',
            'razorpay_key',
            'razorpay_secret'
        ];

        foreach ($sensitiveKeys as $key) {
            if (!empty($settings[$key])) {
                $settings[$key] = '************';
            }
        }

        return $this->sendResponse(
            new SettingResource(['type' => 'settings', 'attributes' => $settings]),
            'Payment Setting retrieved successfully.'
        );
    }

    public function updatePaymentSettings(Request $request): JsonResponse
    {
        $validated = $request->validate(
            [
                'manual_payment_enabled' => 'boolean',
                'manual_payment_guide' => 'required_if:manual_payment_enabled,1',
                'stripe_enabled' => 'boolean',
                'stripe_key' => 'required_if:stripe_enabled,1',
                'stripe_secret' => 'required_if:stripe_enabled,1',
                'paypal_enabled' => 'boolean',
                'paypal_client_id' => 'required_if:paypal_enabled,1',
                'paypal_secret' => 'required_if:paypal_enabled,1',
                'razorpay_enabled' => 'boolean',
                'razorpay_key' => 'required_if:razorpay_enabled,1',
                'razorpay_secret' => 'required_if:razorpay_enabled,1',
            ]
        );

        $settings = $this->sadminSettingRepository->updatePaymentSettings($validated);

        return $this->sendResponse(
            new SettingResource(['type' => 'settings', 'attributes' => $settings]),
            __('messages.success.payment_settings_updated')
        );
    }
}
