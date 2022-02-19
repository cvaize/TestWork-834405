<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => $this->faker->realTextBetween(10, 30),
            'description' => $this->faker->realTextBetween(50, 100),
            'price' => rand(1000, 10000),
            'category_id' => rand(1, 4),
        ];
    }
}
