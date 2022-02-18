<?php

use Illuminate\Support\Str;
use \LaravelJsonApi\Eloquent\Fields;

/**
 * @var \LaravelJsonApi\Core\Server\Server $server
 * @var \LaravelJsonApi\Core\Schema\Container $schemas
 * @var string $type
 * @var string $serverName
 * @var \LaravelJsonApi\Contracts\Schema\Schema $schema
 */
$schemas = $server->schemas();

$types = $schemas->types();

$responseItems = [];

$EXPORT = "export";
$TAB = "    ";

$jsonapiTypesEnumName = $serverName . 'JsonapiTypes';

function studlySingular($name): string {
    if($name === 'reserves'){
        return 'Reserve';
    }
    return Str::studly(Str::singular($name));
}

function isRelationField($field): bool
{
    return $field instanceof Fields\Relations\BelongsTo
        || $field instanceof Fields\Relations\HasOne
        || $field instanceof Fields\Relations\BelongsToMany
        || $field instanceof Fields\Relations\HasMany
        || $field instanceof Fields\Relations\MorphTo
        || $field instanceof Fields\Relations\MorphToMany
        ;
}

function getAttributeFieldType($field): string
{
    $fieldType = '';

    if ($field instanceof Fields\Str
        || $field instanceof Fields\DateTime
        || $field instanceof Fields\ID) {
        $fieldType = 'string';
    }
    if ($field instanceof Fields\Number) {
        $fieldType = 'number';
    }
    if ($field instanceof Fields\Boolean) {
        $fieldType = 'boolean';
    }
    if ($field instanceof Fields\ArrayHash) {
        $fieldType = 'object';
    }

    return $fieldType;
}

function getRelationFieldName($field): string
{
    return $field->inverse() ?? $field->name();
}

function getRelationFieldType($field, $serverName): string
{
    $fieldType = '';

    if (isRelationField($field)) {
        $fieldType = $serverName . studlySingular(getRelationFieldName($field));
    }
    if ($field instanceof Fields\Relations\BelongsToMany
        || $field instanceof Fields\Relations\HasMany
        || $field instanceof Fields\Relations\MorphToMany
    ) {
        $fieldType .= '[]';
    }

    return $fieldType;
}

// Начало генерации

echo "$EXPORT enum " . $jsonapiTypesEnumName . " {\n";

foreach ($types as $type) {
    // extra-field-values => ExtraFieldValue
    $publicType = studlySingular($type);

    echo $TAB . $publicType . " = '" . $type . "',\n";
}

echo "}\n\n";

echo "$EXPORT enum " . $jsonapiTypesEnumName . "CamelCase {\n";

foreach ($types as $type) {
    // extra-field-values => ExtraFieldValue
    $publicType = studlySingular($type);

    echo $TAB . $publicType . " = '" . Str::camel($type) . "',\n";
}

echo "}\n\n";

foreach ($types as $type) {
    // extra-field-values => ExtraFieldValue
    $publicType = studlySingular($type);
    $publicTypeName = $serverName . $publicType;

    echo "$EXPORT type " . $publicTypeName . " = " . $serverName . "DefaultModel & {\n";

    $relations = [];
    $schema = $schemas->schemaFor($type);
    $filters = $schema->filters();
    $fieldNames = $schema->fieldNames();

    foreach ($fieldNames as $fieldName) {
        /**
         * @var Fields\Relations\HasMany $field
         */
        $field = $schema->field($fieldName);
        $name = $field->name();
        $fieldType = getAttributeFieldType($field);

        if ($fieldType === '') {
            $fieldType = getRelationFieldType($field, $serverName);
        }

        if ($fieldType !== '') {
            echo $TAB . $name . "?: " . $fieldType . ";\n";
        }

        if (method_exists($field, 'isCountable') && $field->isCountable()) {
            echo $TAB . $name . "Count?: number;\n";
        }

    }

    echo "}\n\n";

    echo "$EXPORT enum " . $publicTypeName . "Attributes {\n";

    foreach ($fieldNames as $fieldName) {
        $field = $schema->field($fieldName);
        $name = $field->name();

        if(!($field instanceof Fields\ID)){
            echo $TAB . $name . " = '" . $name . "',\n";
        }

        if (isRelationField($field)) {
            $relations[] = $name;
        }

    }

    echo "}\n\n";

    if (count($relations) > 0) {
        echo "$EXPORT enum " . $publicTypeName . "Relations {\n";

        foreach ($relations as $relation) {
            echo $TAB . $relation . " = '" . $relation . "',\n";
        }

        echo "}\n\n";
    }

    if (count($filters) > 0) {
        echo "$EXPORT enum " . $publicTypeName . "Filters {\n";

        foreach ($filters as $filter) {
            echo $TAB . $filter->key() . " = '" . $filter->key() . "',\n";
        }

        echo "}\n\n";
    }

    $responseItemName = $publicTypeName . "TransferEntity";
    $responseItems[] = $responseItemName;

    echo "export type " . $responseItemName . " = " . $serverName . "TransferEntity & {\n";
    echo $TAB . "type: " . $jsonapiTypesEnumName . "." . $publicType . ";\n";
    echo $TAB . "attributes: {\n";

    foreach ($fieldNames as $fieldName) {
        $field = $schema->field($fieldName);
        $name = $field->name();
        if (!($field instanceof Fields\ID)) {
            $fieldType = getAttributeFieldType($field);

            if ($fieldType !== '') {
                echo $TAB . $TAB . $name . "?: " . $fieldType . ";\n";
            }
        }
    }

    echo $TAB . "};\n";
    echo $TAB . "relationships?: {\n";

    foreach ($fieldNames as $fieldName) {
        $field = $schema->field($fieldName);
        $name = $field->name();
        $fieldType = getRelationFieldType($field, '');

        if ($fieldType !== '') {
            $array_ = str_contains($fieldType, '[]') ? '[]' : '';
            $fieldType = $array_ === '[]' ? str_replace('[]', '', $fieldType) : $fieldType;
            echo $TAB . $TAB . $name . ": {\n";
            echo $TAB . $TAB . $TAB . "data: {\n";
            echo $TAB . $TAB . $TAB . $TAB . "id: string;\n";
            echo $TAB . $TAB . $TAB . $TAB . "type: " . $jsonapiTypesEnumName . "." . $fieldType . ";\n";
            echo $TAB . $TAB . $TAB . "}" . $array_ . ";\n";

            if (method_exists($field, 'isCountable') && $field->isCountable()) {
                echo $TAB . $TAB . $TAB . "meta?: {\n";
                echo $TAB . $TAB . $TAB . $TAB . "count?: number;\n";
                echo $TAB . $TAB . $TAB . "};\n";
            }

            echo $TAB . $TAB . "};\n";
        }
    }

    echo $TAB . "};\n";

    echo "}\n\n";
}


echo "$EXPORT type " . $serverName . "JsonapiTransferEntitys = " . implode(' | ', $responseItems) . ";\n\n";

echo "export type " . $serverName . "TransferEntityCoupling = {\n";
echo $TAB . "type: ".$serverName."JsonapiTypes;\n";
echo $TAB . "id?: string;\n";
echo "}\n\n";

echo "export type " . $serverName . "TransferEntity = " . $serverName . "TransferEntityCoupling & {\n";
echo $TAB . "attributes: {\n";
echo $TAB . $TAB . "[key: string]: string | number | boolean | null;\n";
echo $TAB . "},\n";
echo $TAB . "relationships?: {\n";
echo $TAB . $TAB . "[key: string]: {\n";
echo $TAB . $TAB . $TAB . "data: ".$serverName."TransferEntityCoupling | ".$serverName."TransferEntityCoupling[];\n";
echo $TAB . $TAB . $TAB . "meta?: {\n";
echo $TAB . $TAB . $TAB . $TAB . "count?: number;\n";
echo $TAB . $TAB . $TAB . "};\n";
echo $TAB . $TAB . "};\n";
echo $TAB . "}\n";
echo "}\n\n";

echo "export type " . $serverName . "DefaultModel = {\n";
echo $TAB . "id?: string;\n";
echo "}\n\n";
?>
