<?php

namespace App\JsonApi\V1\Products;

use App\JsonApi\V1\Categories\CategorySchema;
use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class ProductRequest extends ResourceRequest
{

    /**
     * Get the validation rules for the resource.
     *
     * @return array
     */
    public function rules(): array
    {
        $category = app(CategorySchema::model());

        return [
            'name'        => ['nullable', 'string', 'min:0', 'max:255'],
            'description' => ['nullable', 'string', 'min:0', 'max:99999999'],
            'price'       => ['nullable', 'integer', 'min:0', 'max:9999999'],
            'ordering'    => ['nullable', 'integer', 'min:0', 'max:9999999'],
            'categoryId'  => ['nullable', 'integer', 'exists:' . $category->getTable() . ',' . $category->getKeyName()],
        ];
    }
}
