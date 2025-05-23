<template>
  <t-loading size="small" :loading="loading" show-overlay style="min-height: 480px; display: flex; flex-direction: row">
    <!---->
    <div class="approval-list">
      <!---->
      <div class="approval-list-header"></div>
      <!---->
      <div class="approval-list-body">
        <div class="approval-list-body-content narrow-scrollbar">
          <div
            v-for="(item, index) in approvalList"
            :key="item.id"
            class="approval-list-body-content__item"
            :class="{ active: currentActive === index }"
            @click="() => handleCardActive(index)"
          >
            <div class="approval-list-body-content__item--header">
              <div class="approval-list-body-content__item--header-title">
                {{ item.details.content }}
                <typeTag :type="item.type" />
              </div>
              <!---->
              <div class="approval-list-body-content__item--header-tag">
                <statusTag :data="item" :status="item.status" />
              </div>
            </div>
            <!---->
            <div class="approval-list-body-content__item--body">
              <div>
                <span>补充描述:</span>
                {{ item.details.other_info }}
              </div>
              <div>
                <span>创建时间:</span>
                {{ dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </div>
            <!---->
            <div class="approval-list-body-content__item--footer">
              <div class="applicant">
                <div class="avatar">
                  <User1Icon />
                </div>
                <div>{{ item.user_code }}</div>
              </div>
              <div>
                {{ dayjs(item.updated_at).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!---->
    </div>
    <div class="audit-manage narrow-scrollbar">
      <!---->
      <div class="approval-manage">
        <div class="info">
          <div class="info-header">
            <div class="title">
              <span
                >[审计MTB-{{ approvalList[currentActive]?.id }}#]
                {{ approvalList[currentActive]?.details?.content }}</span
              >
              <typeTag :type="approvalList[currentActive]?.type" />
            </div>
            <div>
              <div class="applicant">
                <div class="avatar">
                  <User1Icon />
                </div>
                <div>{{ approvalList[currentActive]?.user_code }}</div>
              </div>
            </div>
          </div>
          <!---->
          <div class="info-body">
            <div class="info-body-content">
              <approvalDetailInfo :data="approvalList[currentActive]" />
            </div>
            <!---->
            <div class="timeline">
              <div class="timeline-title">审批进程</div>
              <t-timeline mode="same" style="padding: 10px 0px 0px 12px">
                <t-timeline-item v-for="(item, index) in stepInfo?.options" :key="index" v-bind="item">
                  {{ item.content }}
                </t-timeline-item>
              </t-timeline>
            </div>
          </div>
        </div>
        <div class="action">
          <t-button
            variant="outline"
            theme="success"
            block
            size="large"
            :disabled="!canApproval"
            :title="whyCannotOperate('Approve')"
            @click="() => handleApprove('approve')"
          >
            Approve · 同意审批</t-button
          >
          <t-button
            variant="outline"
            theme="danger"
            block
            size="large"
            :disabled="!canApproval"
            :title="whyCannotOperate('Reject')"
            @click="() => handleApprove('reject')"
          >
            Reject · 拒绝审批
          </t-button>
          <t-button
            variant="outline"
            theme="warning"
            block
            size="large"
            :disabled="!canRevert"
            :title="whyCannotOperate('Revert')"
            @click="() => handleApprove('revert')"
          >
            Revert · 撤销审批
          </t-button>
        </div>
      </div>
      <!---->
    </div>
  </t-loading>
</template>

<script setup lang="tsx">
import { computed, onBeforeMount, PropType, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { omit } from 'lodash-es';
import { NotifyPlugin } from 'tdesign-vue-next';
import { User1Icon } from 'tdesign-icons-vue-next';
import dayjs from 'dayjs';
import statusTag from './utils/renderStatusTag';
import typeTag from './utils/renderTypeTag';
import approvalDetailInfo from './utils/renderApprovalDetailInfo';
import useRequest from '@hooks/useRequest';
import { checkUserCanApprove, checkUserCanOperate, checkUserCanRevert, getAllStepData } from './utils';
import type { AuditItems, AuditTimeLine } from './type';
import type { HandleChangeComponentFunctionType } from '@type/type';

const props = defineProps({
  handleChangeComponent: {
    type: Function as PropType<HandleChangeComponentFunctionType>,
    default: null,
  },
  userCode: {
    type: String,
    default: '',
  },
});
const route = useRoute();
const router = useRouter();
const approvalList = ref<AuditItems>([]);
const currentActive = ref<number>(0);
const loading = ref<boolean>(true);
const stepInfo = computed<AuditTimeLine>(() => {
  if (!approvalList.value[currentActive.value]) return null;
  return getAllStepData(approvalList.value[currentActive.value]);
});
const canOperate = computed(() => {
  if (!approvalList.value[currentActive.value]) return false;
  return checkUserCanOperate(props.userCode, approvalList.value[currentActive.value]);
});
const canApprovalSource = computed(() => {
  return checkUserCanApprove(props.userCode, approvalList.value[currentActive.value]);
});
const canApproval = computed(() => {
  return canOperate.value && canApprovalSource.value.result;
});
const canRevert = computed(() => {
  return canOperate.value && checkUserCanRevert(props.userCode, approvalList.value[currentActive.value]);
});
const whyCannotOperate = (btn: string) => {
  if (!canOperate.value) {
    return '您不是该审批单的审批人！无法操作！';
  }
  switch (btn) {
    case 'Approve':
      const type = canApprovalSource.value.type;
      if (type === 'steps_has_rejected') {
        return '上级审批已拒绝，无法操作！';
      } else if (type === 'user_already_approved' || type === 'mixed_already_approved') {
        return '当前已同意审批，无法操作！';
      } else if (type === 'mixed_no_rule_expression') {
        return '审批单规则表达式不满足，无法操作！';
      }
      return '同意审批';
    case 'Reject':
      if (!canApproval.value) {
        return '当前已拒绝审批，无法操作！';
      }
      return '拒绝审批';
    case 'Revert':
      if (!canRevert.value) {
        return '审批已流转下一审批人，无法撤回！';
      }
      return '撤销审批';
    default:
      return null;
  }
};

const handleCardActive = (index: number) => {
  currentActive.value = index;
};

const checkQuery = () => {
  const { aid } = route.query;
  if (aid) {
    const index = approvalList.value.findIndex((item) => item.id === Number(aid));
    if (index !== -1) {
      handleCardActive(index);
      // 处理以后，去除aid参数
      router.replace({
        query: {
          ...omit(route.query, 'aid'),
        },
      });
    }
  }
};

const handleApprove = (type: string) => {
  useRequest({
    url: '/approval/operate',
    methods: 'POST',
    data: {
      id: approvalList.value[currentActive.value].id,
      type,
    },
    success: function (res) {
      const result = JSON.parse(res);
      if (result.errcode !== 0) {
        NotifyPlugin.error({
          title: '无法完成审批操作[Main]',
          content: result.errmsg,
        });
      }
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '无法完成审批操作[Error]',
        content: err,
      });
    },
  });
};

const loadApprovalList = () => {
  useRequest({
    url: '/approval/list',
    methods: 'POST',
    success: function (res) {
      const result = JSON.parse(res);
      if (result.errcode === 0) {
        approvalList.value = result.data as AuditItems;
        checkQuery();
      } else {
        NotifyPlugin.error({
          title: '获取审批列表数据失败[Main]',
          content: result.errmsg,
        });
      }
    },
    error: function (err) {
      NotifyPlugin.error({
        title: '获取审批列表数据失败[Error]',
        content: err,
      });
    },
    complete: () => {
      loading.value = false;
    },
  });
};

onBeforeMount(() => {
  loadApprovalList();
});
</script>

<script lang="tsx">
export default {
  name: 'AuditManage',
};
</script>

<style lang="scss">
:root {
  --audit-card-text-color: rgba(0, 0, 0, 0.5);
}
:root[theme-mode='dark'] {
  --audit-card-text-color: rgba(255, 255, 255, 0.7);
}
</style>

<style lang="scss" scoped>
.audit-manage {
  min-height: 484px;
  max-height: calc(100vh - 262px);
  overflow-y: scroll;
}

.audit-manage {
  background-color: var(--td-bg-color-container);
  padding: 12px;
  display: flex;
  flex-direction: row;
  width: 100%;

  .approval-manage {
    width: 100%;
    padding: 18px 18px 18px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .info-header {
      display: flex;
      flex-direction: column;
      font: var(--td-font-title-large);
      padding-bottom: 24px;
      gap: 8px;
      border-bottom: 1px var(--td-border-level-2-color) solid;

      .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
      }

      .applicant {
        display: flex;
        gap: 8px;
        font: var(--td-font-body-medium);
        align-items: center;

        .avatar {
          display: flex;
          height: 24px;
          width: 24px;
          background-color: var(--td-brand-color);
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          > svg {
            height: 22px;
            width: 22px;
            color: #fff;
          }
        }
      }
    }

    .info-body {
      display: flex;
      flex-direction: column;
      gap: 24px;

      > div {
        border-bottom: 1px var(--td-border-level-2-color) solid;
      }

      .timeline-title {
        font: var(--td-font-title-large);
        padding-bottom: 6px;
      }
      .info-body-content {
        padding: 24px 0;
      }
    }

    &:deep(.application-info-wrapper) {
      display: flex;
      flex-direction: column;
      gap: 12px;
      .detail-info,
      .application-info {
        .detail-info-header__title,
        .application-info-header__title {
          font: var(--td-font-title-small);
        }

        .application-info-item {
          display: flex;
          align-items: center;
        }

        .detail-info-body {
          background-color: var(--td-bg-color-container-hover);
          padding: 8px;
          border-radius: 10px;

          .detail-info-item,
          .application-info-item {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 12px 0;
            .detail-info-body__title {
              color: var(--td-text-color-secondary);
            }
          }
        }

        .application-info-item {
          display: flex;
          flex-direction: row;
          gap: 6px;
          padding: 12px 0;
          .application-info-body__title {
            color: var(--td-text-color-secondary);
          }
        }
      }
    }

    .action {
      width: 50%;
      display: flex;
      flex-direction: row;
      gap: 12px;
      margin: 0 auto;
      padding-bottom: 24px;
      .t-button--variant-outline {
        &.t-button--theme-success {
          background-color: var(--td-success-color-light);
          --ripple-color: var(--td-success-color-light-hover);
        }
        &.t-button--theme-warning {
          background-color: var(--td-warning-color-light);
          --ripple-color: var(--td-warning-color-light-hover);
        }
        &.t-button--theme-danger {
          background-color: var(--td-error-color-light);
          --ripple-color: var(--td-error-color-light-hover);
        }
      }
    }
  }
}

.approval-list {
  min-width: 300px;
  min-height: 480px;
  background: var(--td-bg-color-component);
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;

  .approval-list-body-content__item--header,
  .approval-list-body-content__item--footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .approval-list-body-content__item--header-title {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font: var(--td-font-title-medium);
    }
    .applicant {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;
    }
    .avatar {
      display: flex;
      height: 18px;
      width: 18px;
      background-color: var(--td-brand-color);
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      > svg {
        height: 16px;
        width: 16px;
        color: #fff;
      }
    }
  }

  .approval-list-body-content__item--header {
    padding-bottom: 12px;
  }

  .approval-list-body-content__item--footer {
    padding-top: 12px;
  }

  .approval-list-body-content__item--body {
    > div > span {
      color: var(--audit-card-text-color);
    }
  }

  .approval-list-body-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px 8px 14px 14px;
    min-height: 480px;
    max-height: calc(100vh - 262px);
    overflow-y: scroll;
  }

  .approval-list-body-content__item {
    background-color: var(--td-bg-color-container);
    padding: 12px;
    border-top-right-radius: 14px;
    border-bottom-left-radius: 14px;
    user-select: none;
    &.active {
      outline: 2.8px solid var(--td-brand-color);
    }
  }
}
</style>
