import { defineComponent } from 'vue';

import './topic.less';

export default defineComponent({
  name: 'Toppic',
  props: {
    data: {
      type: Object,
    },
  },
  setup(props) {
    return () => {
      const { data, type } = props.data;

      return (
        <div class="toppic has-toppic">
          <div class={['scrollToppic', type === 'dynamic' ? 'scrollToppic' : ''].join(' ')}>
            <span class="content" style={{ cursor: 'pointer' }} v-html={`📢 ${data}` || ''}></span>
          </div>
        </div>
      );
    };
  },
});
