<?php

namespace App\Repositories;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class TransactionRepository
 */
class TransactionRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'tenant_id',
        'transaction_id',
        'amount',
        'type',
        'status',
        'meta',
        'user_id'
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
        return Transaction::class;
    }

    /**
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Support\Collection|mixed
     */
    public function getTransactions($perPage)
    {
        return $this->withoutGlobalScope('tenant')->orderBy('created_at', 'desc')->paginate($perPage);
    }
}
