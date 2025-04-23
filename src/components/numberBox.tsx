import { defineComponent, toRefs } from 'vue';
import './style/numberBox.scss';

export default defineComponent({
  name: 'NumberInput',
  props: {
    value: {
      type: Number,
      default: 6,
    },
  },
  setup(props) {
    const { value } = toRefs(props);
    const renderItem = () => {
      const items = Array.from({ length: value.value }, (_, index) => (
        <div class={['codeItem', value.value === index]}>{value.value[index]}</div>
      ));
      return <>{items}</>;
    };

    return () => (
      <>
        <div class="codeBox" box>
          {renderItem()}
        </div>
      </>
    );
  },
});
