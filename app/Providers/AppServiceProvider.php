<?php

namespace App\Providers;

use Statamic\Facades\Collection;
use Illuminate\Support\ServiceProvider;
use JackSleight\StatamicBardMutator\Facades\Mutator;

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
        Mutator::html('image', function ($value) {
            return ['content' => view('partials/_image', $value[1])];
        });
        // Statamic::script('app', 'cp');
        // Statamic::style('app', 'cp');
    }
}
