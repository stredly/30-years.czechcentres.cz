import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';

import Timeline from './components/timeline';

window.Alpine = Alpine;

Alpine.data('timeline', Timeline);
Alpine.plugin(intersect);

Alpine.start();
