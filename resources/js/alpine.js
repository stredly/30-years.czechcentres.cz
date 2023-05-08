import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';
import resize from '@aerni/alpine-resize';

import Timeline from './components/timeline';

window.Alpine = Alpine;

Alpine.data('timeline', Timeline);
Alpine.plugin(intersect);
Alpine.plugin(resize);

Alpine.start();
