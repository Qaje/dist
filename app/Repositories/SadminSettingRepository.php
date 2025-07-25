<?php

namespace App\Repositories;

use App\DotenvEditor;
use App\Models\SadminSetting;
use App\Models\Service;
use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class SadminSettingRepository
 */
class SadminSettingRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'key',
        'value',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'key',
        'value',
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
        return SadminSetting::class;
    }

    /**
     * @return mixed
     */
    public function updateSettings($input)
    {
        try {
            DB::beginTransaction();
            if (isset($input['app_logo']) && !empty($input['app_logo'])) {
                /** @var SadminSetting $setting */
                $setting = SadminSetting::where('key', 'app_logo')->first();
                if ($setting === null) {
                    $setting = SadminSetting::create(['key' => 'app_logo']);
                }
                $setting->clearMediaCollection(SadminSetting::LOGO);
                $media = $setting->addMedia($input['app_logo'])->toMediaCollection(SadminSetting::LOGO, config('app.media_disc'));
                $setting = $setting->refresh();
                $setting->update(['value' => $media->getFullUrl()]);
            }
            if (isset($input['app_favicon']) && !empty($input['app_favicon'])) {
                /** @var SadminSetting $setting */
                $setting = SadminSetting::where('key', 'app_favicon')->first();
                if ($setting === null) {
                    $setting = SadminSetting::create(['key' => 'app_favicon']);
                }
                $setting->clearMediaCollection(SadminSetting::FAVICON);
                $media = $setting->addMedia($input['app_favicon'])->toMediaCollection(SadminSetting::FAVICON, config('app.media_disc'));
                $setting = $setting->refresh();
                $setting->update(['value' => $media->getFullUrl()]);
            }

            $settingInputArray = Arr::only($input, [
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
            ]);

            foreach ($settingInputArray as $key => $value) {
                SadminSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value]
                );
                // $setting = SadminSetting::where('key', $key)->first();
                // if ($setting === null) {
                //     SadminSetting::create(['key' => $key, 'value' => $value]);
                // } else {
                //     if ($key == 'show_version_on_footer' || $key == 'show_app_name_in_sidebar') {
                //         if (empty($value)) {
                //             $setting->update(['value' => false]);
                //         }
                //     }
                //     if ($setting) {
                //         $setting->update(['value' => $value]);
                //     } else {
                //         SadminSetting::create(['key' => $key, 'value' => $value]);
                //     }
                // }
            }
            DB::commit();

            return $input;
        } catch (Exception $exception) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($exception->getMessage());
        }
    }

    public function updateMailEnvSetting($input)
    {
        $env = new DotenvEditor();
        $inputArr = Arr::except($input, ['_token']);
        $env->setAutoBackup(true);

        $envData = [
            'MAIL_MAILER' => (empty($inputArr['mail_mailer'])) ? '' : $inputArr['mail_mailer'],
            'MAIL_HOST' => (empty($inputArr['mail_host'])) ? '' : $inputArr['mail_host'],
            'MAIL_PORT' => (empty($inputArr['mail_port'])) ? '' : $inputArr['mail_port'],
            'MAIL_USERNAME' => (empty($inputArr['mail_username'])) ? '' : $inputArr['mail_username'],
            'MAIL_PASSWORD' => (empty($inputArr['mail_password'])) ? '' : $inputArr['mail_password'],
            'MAIL_FROM_ADDRESS' => (empty($inputArr['mail_from_address'])) ? '' : $inputArr['mail_from_address'],
            'MAIL_ENCRYPTION' => (empty($inputArr['mail_encryption'])) ? '' : $inputArr['mail_encryption'],
        ];

        foreach ($envData as $key => $value) {
            $this->createOrUpdateEnv($env, $key, $value);
        }
    }

    public function updatePaymentSettings($input)
    {
        try {
            DB::beginTransaction();

            $settingInputArray = Arr::only($input, [
                'manual_payment_enabled',
                'manual_payment_guide',
                'stripe_enabled',
                'stripe_key',
                'stripe_secret',
                'paypal_enabled',
                'paypal_client_id',
                'paypal_secret',
            ]);

            foreach ($settingInputArray as $key => $value) {
                SadminSetting::updateOrCreate(['key' => $key], ['value' => $value]);
            }

            DB::commit();

            return true;
        } catch (Exception $exception) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($exception->getMessage());
        }
    }

    public function createOrUpdateEnv($env, $key, $value): bool
    {
        if (!$env->keyExists($key)) {
            $env->addData([
                $key => $value,
            ]);

            return true;
        }
        $env->changeEnv([
            $key => $value,
        ]);

        return true;
    }
}
