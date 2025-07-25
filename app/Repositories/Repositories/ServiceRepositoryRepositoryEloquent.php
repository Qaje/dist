<?php

namespace App\Repositories\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use App\Repositories\Repositories\ServiceRepositoryRepository;
use App\Entities\Repositories\ServiceRepository;
use App\Validators\Repositories\ServiceRepositoryValidator;

/**
 * Class ServiceRepositoryRepositoryEloquent.
 *
 * @package namespace App\Repositories\Repositories;
 */
class ServiceRepositoryRepositoryEloquent extends BaseRepository implements ServiceRepositoryRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ServiceRepository::class;
    }

    

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
    
}
