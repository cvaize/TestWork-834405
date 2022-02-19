<?php

namespace App\JsonApi\V1\Products;

use App\Models\Product;
use Illuminate\Database\Eloquent\Model;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsToMany;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\Scope;
use LaravelJsonApi\Eloquent\Filters\Where;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Schema;

class ProductSchema extends Schema
{

    /**
     * The model the schema corresponds to.
     *
     * @var string
     */
    public static string $model = Product::class;

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
            Str::make('description'),

            Number::make('price'),
            Number::make('ordering')->sortable(),
            Number::make('categoryId')->sortable(),

            BelongsTo::make('category')->type('categories'),
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
            Scope::make('search'),
            Where::make('categoryId'),
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
