<?php

namespace App\Providers;

use Statamic\Facades\Collection;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {

        Collection::computed('timeline', 'full_title', function ($entry, $value) {
            $instance = $entry->augmentedValue('cities');
            if (!is_null($entry->id())) {
                return $entry->get('title') . ' – ' . $instance->value()->title();
            }
            return;
        });
        // Statamic::script('app', 'cp');
        // Statamic::style('app', 'cp');
    }
}
