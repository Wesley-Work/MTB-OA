import useRequest from '@/hooks/useRequest';
import { getAPI_URL, getBossCOS_URL, getHIK_API } from '@/utils/common';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import {
  Alert,
  Avatar,
  Button,
  DialogPlugin,
  ImageViewer,
  MessagePlugin,
  Select,
  Space,
  Table,
  Tag,
  Watermark,
} from 'tdesign-vue-next';
import { BrowseIcon, ImageIcon } from 'tdesign-icons-vue-next';
import { HikFaceUserList, UserFaceBindList, UserList } from '@/types/user';
import { isInternal as checkInternal } from '@/utils';

export default defineComponent({
  name: 'FaceAccessList',
  props: {
    userCode: {
      type: String,
    },
    userName: {
      type: String,
    },
    handleChangeComponent: {
      type: Function,
    },
  },
  setup(props) {
    const checkingInternal = ref(true);
    const isInternal = ref(false);

    const api = computed(() => {
      return isInternal.value ? `${getHIK_API()}/v1/users` : `/faceAccess/user-list`;
    });
    const imgPrefixURL = computed(() => {
      return isInternal.value ? `${getHIK_API()}/v1/users/facePic` : `${getBossCOS_URL()}/hikvision`;
    });
    const data = ref<HikFaceUserList>([]);
    const bindData = ref<UserFaceBindList>([]);
    const userData = ref<UserList>([]);
    const loading = ref(false);

    const getImageUrl = (faceURL: string, picPath: string) => {
      if (!faceURL && faceURL === '' && !picPath) return 'null';
      return `${imgPrefixURL.value}${isInternal.value ? faceURL : picPath}`;
    };

    const getData = () => {
      loading.value = true;
      useRequest({
        url: api.value,
        methods: 'GET',
        success: function (res) {
          const RES = typeof res === 'string' ? JSON.parse(res) : res;
          if (RES.errcode === 0) {
            data.value = RES.data;
          } else {
            console.error('Error fetching data:', RES.errmsg);
          }
        },
        error: function (err) {
          console.error('Request error:', err);
        },
        complete: function () {
          loading.value = false;
        },
      });
      loading.value = true;
      useRequest({
        url: '/faceAccess/bind-list',
        methods: 'GET',
        success: function (res) {
          const RES = typeof res === 'string' ? JSON.parse(res) : res;
          if (RES.errcode === 0) {
            bindData.value = RES.data;
          } else {
            console.error('Error fetching data:', RES.errmsg);
          }
        },
        error: function (err) {
          console.error('Request error:', err);
        },
        complete: function () {
          loading.value = false;
        },
      });
    };

    const getUserData = () => {
      useRequest({
        url: `/user/list`,
        methods: 'GET',
        success: function (res) {
          const RES = typeof res === 'string' ? JSON.parse(res) : res;
          if (RES.errcode === 0) {
            userData.value = RES.data;
          } else {
            console.error('Error fetching data:', RES.errmsg);
          }
        },
        error: function (err) {
          console.error('Request error:', err);
        },
      });
    };

    onMounted(() => {
      MessagePlugin.loading('正在加载，请稍后...');
      loading.value = true;
      checkInternal()
        .then((internal) => {
          isInternal.value = internal;
          getData();
        })
        .finally(() => {
          checkingInternal.value = false;
        });
      getUserData();
    });

    const bindUser = (row) => {
      const options = userData.value.map((user) => ({ value: user.code, label: `${user.code}(${user.name})` }));
      const bindInfo = bindData.value.find((item) => item.employee_id === row.employeeNo);
      const value = ref(bindInfo?.usercode || row.selectedUser);
      const dialog = DialogPlugin({
        header: '绑定系统用户',
        width: '500px',
        body: () => {
          return (
            <div>
              <Space direction="vertical" size="small">
                <div>
                  设备人员编号：
                  <span>
                    {row.employeeNo}({row.name})
                  </span>
                </div>
                <Select
                  style="width: 100%; height: 32px; border: 1px solid var(--td-border-color); border-radius: 4px; padding: 4px;"
                  onChange={(e) => {
                    row.selectedUser = e;
                  }}
                  v-model={value.value}
                  options={options}
                  // v-slots={{
                  //   panelTopContent: () => {
                  //     const search = ref('');
                  //     const onSearch = (val: string) => {
                  //       const filteredOptions = options.filter((option) =>
                  //         option.label.toLowerCase().includes(val.toLowerCase()),
                  //       );
                  //     };
                  //     return (
                  //       <div style="padding: 6px 6px 0 6px">
                  //         <Input v-model={search.value} placeholder="请输入信息进行搜索" onChange={onSearch} />
                  //       </div>
                  //     );
                  //   },
                  // }}
                ></Select>
              </Space>
            </div>
          );
        },
        confirmBtn: '绑定',
        cancelBtn: '取消',
        onConfirm: () => {
          dialog.update({ confirmBtn: { content: '绑定', loading: true } });
          useRequest({
            url: `/faceAccess/bind`,
            methods: 'POST',
            data: {
              employee_id: row.employeeNo,
              usercode: row.selectedUser,
            },
            success: function (res) {
              const RES = typeof res === 'string' ? JSON.parse(res) : res;
              if (RES.errcode === 0) {
                getData();
              } else {
                console.error('Error binding user:', RES.errmsg);
                MessagePlugin.error(`绑定失败: ${RES.errmsg}`);
              }
            },
            error: function (err) {
              console.error('Request error:', err);
              MessagePlugin.error(`绑定失败: ${err}`);
            },
            complete: function () {
              dialog.update({ confirmBtn: { content: '绑定', loading: false } });
              dialog.destroy();
            },
          });
        },
        onClose: () => {
          dialog.destroy();
        },
      });
    };

    const columns = [
      { colKey: 'employeeNo', title: '设备中的编号', width: 140 },
      { colKey: 'name', title: '姓名', width: 160 },
      {
        colKey: 'avatar',
        title: '人脸',
        width: 180,
        cell: (_h, { row }) => {
          const hasImg = !!row.facePicURL || !!row.facePic;
          const noneFace = (error = false) => (
            <Space
              direction="vertical"
              size="small"
              style="align-items: center; color: var(--td-text-color-secondary);"
            >
              <ImageIcon size="24px" />
              <div style={{ font: 'var(--td-font-body-medium)' }}>{error ? '无人脸' : '人脸加载失败'}</div>
            </Space>
          );

          if (!hasImg) {
            return (
              <div
                class="t-avatar t-avatar--round"
                style="width: 100px; height: 100px; font-size: 50px; background: var(--td-bg-color-component);"
              >
                {noneFace()}
              </div>
            );
          }

          return (
            <ImageViewer
              visible={row.showViewer}
              images={[getImageUrl(row.faceURL, row.facePic)]}
              onClose={() => {
                row.showViewer = false;
              }}
              imageScale={{ max: 2, min: 1 }}
              onDownload={() => {
                MessagePlugin.warning('为保障人员隐私，禁止下载人脸图片，如有需要请联系管理员。');
              }}
              trigger={() => {
                return (
                  <Watermark
                    watermarkContent={[
                      { text: `${props.userName || '未知用户'}(${props.userCode})` },
                      { text: '保密信息 禁止外泄', fontColor: 'rgba(255, 0, 0, 0.15)' },
                    ]}
                    y={100}
                    x={20}
                    width={360}
                    height={20}
                    line-space={20}
                    removable={false}
                    zIndex={99999}
                    rotate={-10}
                    offset={[-1, 0]}
                  >
                    <div class="t-image-viewer__trigger" style="width: unset;">
                      <Avatar
                        hideOnLoadFailed={false}
                        image={getImageUrl(row.faceURL, row.facePic)}
                        shape="round"
                        size="100px"
                        style="background: var(--td-bg-color-component);"
                        imageProps={{
                          fit: 'contain',
                          lazy: true,
                          class: 't-image-viewer__trigger-img',
                          loading: () => (
                            <Space direction="vertical" size="small" style="align-items: center;">
                              <ImageIcon size="24px" />
                              <div style={{ font: 'var(--td-font-body-medium)' }}>
                                <div style="display: flex;flex-direction: column;text-align: center;">
                                  人脸图片
                                  <br />
                                  加载中
                                </div>
                              </div>
                            </Space>
                          ),
                          error: () => noneFace(true),
                          onLoad: () => {
                            row.imgLoaded = true;
                          },
                        }}
                      />
                      {row.imgLoaded && (
                        <div
                          class="t-image-viewer__trigger--hover"
                          onClick={() => {
                            row.showViewer = true;
                          }}
                        >
                          <span>
                            <BrowseIcon size="1.4em" class={`t-image-viewer__trigger-icon`} />
                            查看
                          </span>
                        </div>
                      )}
                    </div>
                  </Watermark>
                );
              }}
            />
          );
        },
      },
      { colKey: 'numOfFace', title: '人脸数', width: 100 },
      {
        colKey: 'BindUser',
        title: '绑定系统用户',
        width: 200,
        cell: (_h, { row }) => {
          const bindInfo = bindData.value.find((item) => item.employee_id === row.employeeNo);
          return bindInfo ? <div>{bindInfo.usercode}</div> : '-';
        },
      },
      {
        colKey: 'localUIRight',
        title: '本地设备权限',
        width: 140,
        cell: (_h, { row }) => {
          return (
            <Tag theme={row?.localUIRight ? 'success' : 'danger'} variant="light-outline">
              {row?.localUIRight ? '是' : '否'}
            </Tag>
          );
        },
      },
      {
        colKey: 'valid',
        title: '有效期',
        cell: (_h, { row }) => {
          const v = row?.Valid || {};
          return v.enable ? `${v.beginTime.slice(0, 10)} ~ ${v.endTime.slice(0, 10)}` : '长期';
        },
      },
      {
        colKey: 'plans',
        title: '门禁方案',
        cell: (_h, { row }) => {
          return Array.isArray(row?.RightPlan) ? row?.RightPlan.map((p: any) => p.planTemplateNo).join(',') : '';
        },
      },
      {
        colKey: 'operation',
        title: '操作',
        cell: (_h, { row }) => {
          return (
            <div style="display: flex;gap: 6px;flex-wrap: wrap;">
              <Button
                onClick={() => {
                  bindUser(row);
                }}
              >
                绑定系统用户
              </Button>
              <Button variant="outline">门禁方案设置</Button>
              <Button variant="outline" theme="primary">
                编辑人脸
              </Button>
              <Button theme="danger">删除</Button>
            </div>
          );
        },
      },
    ];

    return () => (
      <div class="face-access-list">
        <div style="margin-bottom: 12px;">
          <Button>新增用户</Button>
          <Alert style="margin-top: 8px;">
            1. 本地设备权限请在门禁设备后台或海康互联APP设置
            <br />
            2. 门禁方案配置请前往“门禁方案/策略”页面进行配置，本页面只可以设置用户与方案的绑定关系
            <br />
            3. 当前模式：{checkingInternal.value ? '检测中...' : isInternal.value ? '内网模式' : '外网模式'}
          </Alert>
        </div>
        <Table
          columns={columns}
          data={data.value}
          rowKey="employeeNo"
          loading={loading.value}
          maxHeight="calc( 100vh - 390px )"
        />
      </div>
    );
  },
});
