<?php

namespace App\Modifiers;

use Statamic\Modifiers\Modifier;

class MonthName extends Modifier
{
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
        $formatter = new \IntlDateFormatter(app()->getLocale(), \IntlDateFormatter::LONG, \IntlDateFormatter::NONE);
        $formatter->setPattern('LLLL');

        return $formatter->format($value);
    }
}
