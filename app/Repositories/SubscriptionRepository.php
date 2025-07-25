<?php

namespace App\Repositories;

use App\Models\Plan;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;
use App\Models\UserStore;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class SubscriptionRepository
 */
class SubscriptionRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'transaction_id',
        'plan_amount',
        'payable_amount',
        'plan_frequency',
        'status',
    ];

    /**
     * {@inheritDoc}
     */
    public function getFieldsSearchable()
    {
        return $this->fieldSearchable;
    }

    /**
     * {@inheritDoc}
     */
    public function model()
    {
        return Subscription::class;
    }

    /**
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Support\Collection|mixed
     */
    public function getActiveSubscriptions($perPage)
    {
        return $this->where('status', Subscription::ACTIVE)->with('plan.currency')->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Support\Collection|mixed
     */
    public function getManualSubscriptions($perPage)
    {
        return $this->where('payment_type', Subscription::TYPE_MANUAL)->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Support\Collection|mixed
     */
    public function getUserSubscriptions($perPage)
    {
        return $this->where('user_id', Auth::id())->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public static function createSubscription($data)
    {
        try {
            DB::beginTransaction();
            $plan = Plan::find($data['plan_id']);
            $user_id = $data['user_id'] ?? Auth::id();
            $notes = $data['notes'] ?? null;
            $attachment = $data['attachment'] ?? null;
            $paymentType = $data['payment_type'] ?? null;
            $transactionId = $data['transaction_id'] ?? null;
            $storeIds = $data['stores'] ?? null;
            $end_date = Carbon::now()->addDays(7);

            if ($plan->trial_days > 0) {
                $end_date = Carbon::now()->addDays($plan->trial_days);
            } else {
                if ($plan->frequency == Plan::WEEKLY) {
                    $end_date = Carbon::now()->addDays(7)->endOfDay();
                } elseif ($plan->frequency == Plan::MONTHLY) {
                    $end_date = Carbon::now()->addMonths(1)->endOfDay();
                } elseif ($plan->frequency == Plan::YEARLY) {
                    $end_date = Carbon::now()->addYears(1)->endOfDay();
                } elseif ($plan->frequency == Plan::UNLIMITED) {
                    $end_date = Carbon::now()->addYears(1)->endOfDay();
                }
            }

            if ($paymentType == Subscription::TYPE_MANUAL && $storeIds) {
                $storeData = json_encode([
                    'active_store' => User::find($user_id)->tenant_id,
                    'stores' => $storeIds,
                ]);
            }
            $subscriptionData = [
                'user_id' => $user_id,
                'plan_id' => $plan->id,
                'transaction_id' => $transactionId,
                'payment_type' => $paymentType,
                'plan_amount' => $plan->price,
                'payable_amount' => $plan->price,
                'plan_frequency' => $plan->frequency,
                'start_date' => Carbon::now(),
                'end_date' => $end_date,
                'trial_ends_at' => $plan->trial_days > 0 ? $end_date : null,
                'status' => $data['status'] ?? Subscription::PENDING,
                'notes' => $notes,
                'data' => $storeData ?? null,
            ];


            if ($paymentType !== null) {
                if ($paymentType == Subscription::TYPE_STRIPE || $paymentType == Subscription::TYPE_PAYPAL || $paymentType == Subscription::TYPE_RAZORPAY) {
                    $subscriptionData['status'] = Subscription::ACTIVE;
                    $subscriptionData['is_paid'] = 1;
                } elseif ($paymentType == Subscription::TYPE_FREE) {
                    $subscriptionData['payable_amount'] = 0;
                    $subscriptionData['status'] = Subscription::ACTIVE;
                }
            }

            $currentSubscription = Subscription::where('user_id', Auth::id())->where('status', Subscription::ACTIVE)->first();
            if (!empty($currentSubscription)) {
                $usedDays = round(abs(Carbon::now()->diffInDays($currentSubscription->start_date)));
                $totalDays = Carbon::parse($currentSubscription->start_date)->diffInDays(Carbon::parse($currentSubscription->end_date));
                $perDayPrice = round($currentSubscription->plan_amount / $totalDays, 2);
                $remainingBalance = round($currentSubscription->plan_amount - ($perDayPrice * $usedDays));

                $price = $subscriptionData['payable_amount'] - $remainingBalance;
                if ($price <= 0) {
                    $subscriptionData['payment_type'] = $currentSubscription['payment_type'];
                    $subscriptionData['payable_amount'] = 0;
                    $subscriptionData['status'] = Subscription::ACTIVE;
                } else {
                    $subscriptionData['payable_amount'] = $price;
                }
            }

            $subscription = Subscription::create($subscriptionData);

            // Inactive old subscription
            if ($subscription->status == Subscription::ACTIVE) {
                Subscription::where('user_id', $subscription->user_id)
                    ->whereNot('id', $subscription->id)
                    ->where('status', Subscription::ACTIVE)
                    ->update(['status' => Subscription::INACTIVE]);
                if ($storeIds) {
                    $userAllStores = Store::where('user_id', $subscription->user_id)->get();
                    foreach ($userAllStores as $store) {
                        if (!in_array($store->id, $storeIds)) {
                            $store->update(['status' => 0]);
                        }
                    }
                    $disabledStores = Store::where('user_id', $subscription->user_id)->where('status', 0)->get();
                    foreach ($disabledStores as $store) {
                        UserStore::where('store_id', $store->id)->delete();
                        $disabledStoresUsers = User::where('tenant_id', $store->tenant_id)->get();
                        foreach ($disabledStoresUsers as $disabledStoreUser) {
                            $firstActiveStore = UserStore::where('user_id', $disabledStoreUser->id)->first();
                            if ($firstActiveStore && $firstActiveStore->store->tenant_id) {
                                $disabledStoreUser->update(['tenant_id' => $firstActiveStore->store->tenant_id]);
                            }
                        }
                    }
                }
            }

            // Add Attachment
            if ($attachment != null && !empty($attachment)) {
                $subscription->addMedia($attachment)->toMediaCollection(Subscription::ATTACHMENT);
            }

            DB::commit();

            return $subscription;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
}
