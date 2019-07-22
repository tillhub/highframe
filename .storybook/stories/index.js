import Vue from 'vue';
import { storiesOf } from '@storybook/vue';
import Mf from './microfrontend.vue';

storiesOf('Microfrontend', module)
  .add('as a component', () => ({
    data() {
      return {
        src: 'https://example.com',
        origin: 'https://example.com'
      }
    },
    components: { Mf },
    template: '<mf :src="src" :origin="origin"></mf>'
  }));
