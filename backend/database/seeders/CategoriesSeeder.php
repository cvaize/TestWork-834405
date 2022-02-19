<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if(Category::count() === 0){
            Category::create([
                'name'=>'Вирусология',
                'ordering'=>1,
            ]);
            Category::create([
                'name'=>'Хирургия',
                'ordering'=>2,
            ]);
            Category::create([
                'name'=>'Бактериология',
                'ordering'=>3,
            ]);
            Category::create([
                'name'=>'Психиатрия',
                'ordering'=>4,
            ]);
        }
    }
}
