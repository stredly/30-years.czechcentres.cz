<?php

namespace App\Modifiers;

use Statamic\Modifiers\Modifier;

class FormatEventDate extends Modifier
{

    protected $format = '%s - %s';
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
        $format = $this->format;

        if ($separator = array_get($params, 0)) {
            $format = $this->getFormat($separator);
        }

        if (!isset($value['end'])) {
            return $value['start']->isoFormat('D. MMMM YYYY');
        }

        if ($value['start']->toIsoString() === $value['end']->toIsoString()) {
            return $value['start']->isoFormat('D. MMMM YYYY');
        }

        if ($value['start']->month === $value['end']->month) {
            return sprintf($format,

                $value['start']->isoFormat('D.'),
                $value['end']->isoFormat('D. MMMM YYYY')
            );
        }

        $format = $this->getFormat('–');

        return sprintf($format,
            $value['start']->isoFormat('D. MMMM'),
            $value['end']->isoFormat('D. MMMM YYYY')
        );

    }

    private function getFormat($separator)
    {
        return str_replace('-', $separator, $this->format);
    }
}
