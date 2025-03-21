import { defineComponent, onMounted, ref, toRefs } from 'vue';
import './style/numberInput.scss';

export default defineComponent({
  name: 'NumberInput',
  props: {
    total: {
      type: Number,
      default: 6,
    },
    split: {
      type: Number,
      default: undefined,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const { total, split } = toRefs(props);
    const inputRef = ref<HTMLInputElement>();
    const inputValue = ref('');
    const inputFocus = ref(false);

    const setCursorPosition = (index: number) => {
      // 没有实例
      if (!inputRef.value) return;
      inputRef.value.focus();
      // TODO：暂时不做中间修改内容的功能
      console.info('select', index);
      inputRef.value.setSelectionRange(inputValue.value.length - 1, inputValue.value.length);
    };

    const handleInputFocus = () => {
      inputFocus.value = true;
    };

    const handleInputBlur = () => {
      inputFocus.value = false;
    };

    const renderItem = () => {
      const items = Array.from({ length: total.value }, (_, index) => (
        <div
          class={[
            'codeItem',
            inputValue.value.length === index && inputFocus.value && 'active',
            inputValue.value[index] && 'hasvalue',
          ]}
          onClick={() => setCursorPosition(index)}
        >
          {inputValue.value[index]}
        </div>
      ));
      // 处理分割线
      const handleSplit = (arr: any[], splitValue: number | undefined) => {
        return arr.flatMap((item, idx) =>
          idx > 0 && splitValue && idx % splitValue === 0 ? [<div class="split"></div>, item] : [item],
        );
      };

      return <>{handleSplit(items, split.value)}</>;
    };

    const emitValueChange = () => {
      emit('update:value', inputValue.value);
    };

    const handleInput = (event: Event) => {
      const e = event as InputEvent;
      const target = e.target as HTMLInputElement;
      const value = target?.value;
      // 忽略输入中的中文
      if (e.inputType === 'insertCompositionText') {
        // 匹配中文，允许汉字存在
        const testValue = /[\u4e00-\u9fa5]/.test(e?.data ?? '');
        if (!testValue) {
          return;
        }
      }
      inputValue.value = value.toUpperCase();
      emitValueChange();
      // 位数达标，失焦
      if (inputValue.value.length === total.value) {
        inputRef.value?.blur();
      }
    };

    return () => (
      <>
        <div class="codeBox" input>
          {renderItem()}
          <input
            ref={inputRef}
            type="text"
            class="codeInput"
            maxlength={total.value}
            onInput={handleInput}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>
      </>
    );
  },
});
