import { defineComponent, ref, watch } from 'vue';
import '@styles/scrollNumber.scss';

export default defineComponent({
  name: 'ScrollNumber',
  props: {
    val: {
      type: [Number, String],
      required: true,
    },
    suffix: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const value = ref<string[]>([]);
    const lastValue = ref<number>(0);
    const numberList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const compKey = ref<number>(0);
    const lastPosition = ref<Record<number, string>>({});
    const positionList = {
      0: '2%',
      1: '-8%',
      2: '-18%',
      3: '-28%',
      4: '-38%',
      5: '-48%',
      6: '-58%',
      7: '-68%',
      8: '-78%',
      9: '-88%',
    };

    const init = (e?: boolean) => {
      value.value = props.val.toString().split('');
      for (let index = 0; index < value.value.length; index++) {
        const element = value.value[index];
        if (element && Number(element) - 1 > 0) {
          lastPosition.value[index] = positionList[Number(element) - 1];
        } else {
          lastPosition.value[index] = positionList[lastValue.value];
        }
      }
      //resh
      if (e) {
        compKey.value += 1;
      }
      lastValue.value = Number(value.value[value.value.length - 1]);
    };

    watch(
      () => props.val,
      () => {
        init(true);
      },
    );

    // 初始化
    init();

    return () => (
      <div class="count-flop">
        {value.value.map((item, index) => (
          <div class={item !== '.' ? 'count-flop-box' : 'count-flop-point'} key={index}>
            {item !== '.' ? (
              <div class={['count-flop-content', 'rolling_' + item]} style={{ '--deg': lastPosition.value[index] }}>
                {numberList.map((item2, index2) => (
                  <div class="count-flop-num" key={index2}>
                    {item2}
                  </div>
                ))}
              </div>
            ) : (
              <div class="count-flop-content">.</div>
            )}
          </div>
        ))}
        {props.suffix && <div class="count-flop-unit">{props.suffix}</div>}
      </div>
    );
  },
});
