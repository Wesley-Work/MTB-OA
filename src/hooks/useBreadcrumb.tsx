import { defineComponent, ref, toRefs, watch } from 'vue';
import { routerMap } from '../config';
import { Breadcrumb, BreadcrumbItem } from 'tdesign-vue-next';
import type { RouteMaps } from '@type/type';

export default defineComponent({
  name: 'Breadcrumb',
  props: {
    value: {
      type: String,
    },
  },
  setup(props) {
    const { value } = toRefs(props);
    const componentValue = ref(value.value);

    watch(
      () => value.value,
      (newVal) => {
        componentValue.value = newVal;
      },
    );
    const isHidden = ref(false);

    const getItemInMap = (
      map: RouteMaps,
      value: string,
      deep = 0,
    ): { parent: string | null; current: string | null; fatherCrumb?: string | null } => {
      for (const item of map) {
        if (item?.key === value) {
          isHidden.value = item?.hiddenBreadCrumb ?? false;
          return {
            parent: null,
            current: item.label,
            fatherCrumb: item?.fatherCrumb,
          };
        }
        if (item?.children) {
          const result = getItemInMap(item.children, value, deep + 1);
          if (result?.current) {
            return {
              parent: result?.fatherCrumb ?? result?.parent ?? item.label,
              current: result.current,
            };
          }
        }
      }
      return { parent: null, current: null };
    };

    const renderCrumbItem = (path: string, level = 0) => {
      const valueKey = getItemInMap(routerMap, path);
      if (level === 0) {
        return (
          <>
            <BreadcrumbItem>媒体部管理系统</BreadcrumbItem>
            {renderCrumbItem(componentValue.value, level + 1)}
          </>
        );
      }
      if (!valueKey?.parent) {
        return <BreadcrumbItem>{valueKey?.current}</BreadcrumbItem>;
      } else {
        return (
          <>
            <BreadcrumbItem>{valueKey?.parent}</BreadcrumbItem>
            <BreadcrumbItem>{valueKey?.current}</BreadcrumbItem>
          </>
        );
      }
    };

    return () => (
      <div style={isHidden.value ? 'display: none' : 'padding-bottom: 24px; user-select: none;'}>
        <Breadcrumb max-item-width={150}>{renderCrumbItem(componentValue.value)}</Breadcrumb>
      </div>
    );
  },
});

// <t-breadcrumbItem v-if="MainContent.breadcrumb.parent != ''" class="MainContent-Breadcrumb" :class="{ changing: MainContent.breadcrumb.changing1 }"
// @click="breadClick">{{ MainContent.breadcrumb.parent }}</t-breadcrumbItem>
// <t-breadcrumbItem class="MainContent-Breadcrumb" :class="{ changing: MainContent.breadcrumb.changing2 }">{{
// MainContent.breadcrumb.current }}</t-breadcrumbItem>
