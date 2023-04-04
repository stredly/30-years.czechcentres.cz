<?php

namespace App\Modifiers;

use Statamic\Modifiers\Modifier;
use Statamic\Facades\Site;

class MetaTitle extends Modifier
{
    protected $delimiter = ' | ';
    /**
     * Modify a value.
     *
     * @param mixed  $value    The value to be modified
     * @param array  $params   Any parameters used in the modifier
     * @param array  $context  Contextual values
     * @return mixed
     */
    public function index($value, $params, $context)
    {

        $sitename = $this->getSitename();

        if ($context['is_homepage']) {
          if (isset($value['meta_title']) && $value['meta_title'] !== null) {
                return $sitename . $this->delimiter . strip_tags($value['meta_title']);
            }
            return $sitename . $this->delimiter . $this->getTitle($value);
        }


        if (isset($value['meta_title']) && $value['meta_title'] !== null) {
            return strip_tags($value['meta_title']) . $this->delimiter . $sitename;
        }
        return $this->getTitle($value) . $this->delimiter . $sitename;
    }

    private function getTitle($value)
    {
        if (isset($value['title']) && $value['title'] !== null) {
            return strip_tags($value['title']);
        }
        return;
    }

    private function getSitename()
    {
        return config('app.name');
    }
}
