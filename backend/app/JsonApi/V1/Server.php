<?php

namespace App\JsonApi\V1;

use App\JsonApi\V1\Categories\CategorySchema;
use App\JsonApi\V1\Products\ProductSchema;
use LaravelJsonApi\Core\Server\Server as BaseServer;

class Server extends BaseServer
{

    /**
     * The base URI namespace for this server.
     *
     * @var string
     */
    protected string $baseUri = '/api/v1';

    /**
     * Bootstrap the server when it is handling an HTTP request.
     *
     * @return void
     */
    public function serving(): void
    {
        //
    }

    public function authorizable(): bool
    {
        return false;
    }

    /**
     * Get the server's list of schemas.
     *
     * @return array
     */
    protected function allSchemas(): array
    {
        return [
            ProductSchema::class,
            CategorySchema::class,
        ];
    }
}
