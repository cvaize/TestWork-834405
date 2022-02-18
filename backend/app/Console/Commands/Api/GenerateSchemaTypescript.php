<?php

namespace App\Console\Commands\Api;


use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\View;
use LaravelJsonApi\Core\Facades\JsonApi;

class GenerateSchemaTypescript extends Command
{
    protected $signature = 'generate-schema-typescript';

    public function handle()
    {
        $this->generateTypescriptDocument('v1', '../frontend/src/typings/v1-jsonapi.ts', 'jsonapi');
    }

    protected function generateTypescriptDocument($name, $filePath, $view = 'schema', $inFile = false)
    {

        /**
         * @var \App\JsonApi\V1\Server $server
         * @var \LaravelJsonApi\Core\Schema\Container $schemas
         * @var \Illuminate\Foundation\Application $app
         */
        $serverName = $name;
        $server = JsonApi::server($name);

        View::addNamespace('generate-schema-typescript', __DIR__);

        $content = View::make('generate-schema-typescript::'.$view, compact('server', 'serverName'))->render();

        File::put($filePath, $content);
    }
}
