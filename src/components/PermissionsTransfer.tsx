import { defineComponent, computed, toRefs, render } from 'vue';

import { PermissionsObject, PermissionsArray } from '../types/type';

export default defineComponent({
  props: {
    /** 全量数据 */
    data: {
      type: Array<PermissionsObject>,
    },
    /** 目标数据列表数据 */
    value: {
      type: Array<PermissionsArray>,
    },
    user: {
      type: Array<PermissionsObject>,
    },
    group: {
      type: Array<PermissionsObject>,
    },
  },

  setup(props, { slots }) {

    const { data: dataProxy, value: valueProxy, user, group } = toRefs(props);

    const data = computed(() => {
      return dataProxy.value.map((item) => {
        return {
          label: item.object,
          value: item.val,
          open: true
        };
      });
    });

    const value = computed(() => {
      return user.value.map((item) => {
        return {
          label: item.object,
          value: item.val,
          open: item.open
        }
      });
    });

    return () => (
      <>
        <t-transfer data={data.value} v-model={valueProxy.value}></t-transfer>
      </>
    );
  },
});
