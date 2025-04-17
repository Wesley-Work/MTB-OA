
import { defineComponent, ref, computed, toRefs, watch } from 'vue';
import { getRoutePathObj } from './common';
import config, { routerMap } from '../config';
import { RouteData } from 'tdesign-vue-next';
import { RouteMapItem, RouteMaps } from '@/types/type';

export default defineComponent({
    name: "Breadcrumb",
    props: {
        value: {
            type: String,
        }
    },
    setup(props) {
        // const { value } = toRefs(props)
        const { value } = toRefs(props)

        watch(() => value.value, (newVal) => {
            value.value = newVal
        })
        const isHidden = ref(false)

        // 通过url判断当前页面
        const getpath = () =>{
            const path = window.location.hash.replace('#', '').replace(config.routerPrefix+"/","")
            return path
        }
        
        function getIteminMap(map: RouteMaps, value: string, deep: number = 0): { parent: string | null, current: string | null, fatherCrumb?: string | null } {
            for (const item of map) {
                if (item?.key === value) {
                    isHidden.value = item?.hiddenBreadCrumb ?? false
                    return {
                        parent: null,
                        current: item.label,
                        fatherCrumb: item?.fatherCrumb
                    };
                }
                if (item?.children) {
                    const result = getIteminMap(item.children, value, deep + 1);
                    if (result?.current) {
                        return {
                            parent: result?.fatherCrumb ?? result?.parent ?? item.label,
                            current: result.current
                        };
                    }
                }
            }
            return { parent: null, current: null };
        }

        function renderCrumbItem(path: string, level: number = 0) {
            const valuekey = getIteminMap(routerMap, path);
            if (level === 0) {
                return (
                    <>
                        <t-breadcrumbItem>媒体部管理系统</t-breadcrumbItem>
                        {renderCrumbItem(value.value, level + 1)}
                    </>
                );
            }
            if (!valuekey?.parent) {
                return (
                    <t-breadcrumbItem>{valuekey?.current}</t-breadcrumbItem>
                );
            }
            else{
                return (
                    <>
                        <t-breadcrumbItem>{valuekey?.parent}</t-breadcrumbItem>
                        <t-breadcrumbItem>{valuekey?.current}</t-breadcrumbItem>
                    </>
                );
            }
        }
        
        return () => (
            <div style={ isHidden.value ? 'display: none' : 'padding-bottom: 24px; user-select: none;' }>
                <t-breadcrumb max-item-width={150}>
                    { renderCrumbItem(value.value) }
                </t-breadcrumb>
            </div>
        )
    }
})


// <t-breadcrumbItem v-if="MainContent.breadcrumb.parent != ''" class="MainContent-Breadcrumb" :class="{ changing: MainContent.breadcrumb.changing1 }"
// @click="breadClick">{{ MainContent.breadcrumb.parent }}</t-breadcrumbItem>
// <t-breadcrumbItem class="MainContent-Breadcrumb" :class="{ changing: MainContent.breadcrumb.changing2 }">{{
// MainContent.breadcrumb.current }}</t-breadcrumbItem>