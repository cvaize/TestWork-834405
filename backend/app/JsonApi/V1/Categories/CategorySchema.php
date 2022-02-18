<?php

namespace App\JsonApi\V1\Categories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Model;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsToMany;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\Where;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Schema;

class CategorySchema extends Schema
{

    /**
     * The model the schema corresponds to.
     *
     * @var string
     */
    public static string $model = Category::class;

    protected bool $selfLink = false;

    protected int $maxDepth = 6;

    protected $defaultSort = '-id';

    /**
     * Get the resource fields.
     *
     * @return array
     */
    public function fields(): array
    {
        /**
         * @var Model $model
         */
        $model = app($this::model());
        return [
            ID::make($model->getKeyName())->sortable(),
            Str::make('name'),
            Number::make('ordering')->sortable(),
        ];
    }

    /**
     * Get the resource filters.
     *
     * @return array
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
            Where::make('name'),
        ];
    }

    /**
     * Get the resource paginator.
     *
     * @return Paginator|null
     */
    public function pagination(): ?Paginator
    {
        return PagePagination::make();
    }

}
