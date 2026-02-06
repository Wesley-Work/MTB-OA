import useRequest from '@/hooks/useRequest';
import {
  Avatar,
  Button,
  DateRangePicker,
  DialogPlugin,
  ImageViewer,
  MessagePlugin,
  Select,
  Space,
  Table,
  Tag,
  Watermark,
} from 'tdesign-vue-next';
import { computed, defineComponent, onMounted, ref, reactive } from 'vue';
import { majorMap, minorFailList, minorSuccessList } from './consts';
import { BrowseIcon, ImageIcon } from 'tdesign-icons-vue-next';
import { getBossCOS_URL, getHIK_API } from '@/utils/common';
import { isInternal as checkInternal } from '@/utils';

export default defineComponent({
  name: 'FaceAccessEvent',
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
    const loading = ref(false);
    const isInternal = ref(false);
    const checkingInternal = ref(true);
    const data = ref<Array<any>>([]);
    const users = ref<Array<any>>([]);
    const filterValue = ref<any>({});
    const headerFilters = reactive({
      names: [],
      timeRange: [],
    });
    const pagination = reactive({
      current: 1,
      pageSize: 50,
      pageSizeOptions: [25, 50, 100, 200, 500],
      total: 0,
      showJumper: true,
    });

    const eventOptions = Object.entries(majorMap).flatMap(([major, majorItem]) => {
      return Object.entries(majorItem.minor).map(([minor, minorLabel]) => ({
        label: `${majorItem.label}-${minorLabel}`,
        value: `${major}-${minor}`,
      }));
    });

    const nameOptions = computed(() => {
      const namesFromUsers = users.value.map((user) => user.name).filter(Boolean);
      const allNames = Array.from(new Set(namesFromUsers));
      return allNames.sort().map((name) => ({ label: name, value: name }));
    });

    const filteredData = computed(() => {
      if (!filterValue.value || Object.keys(filterValue.value).length === 0) return data.value;
      const { name, major, time } = filterValue.value;

      return data.value.filter((item) => {
        // Name filter (multiple select)
        if (name && name.length > 0) {
          if (!name.includes(item.name)) return false;
        }

        // Major filter (multiple select)
        if (major && major.length > 0) {
          const match = major.some((val: string) => {
            const [m, mi] = val.split('-').map(Number);
            return item.major === m && item.minor === mi;
          });
          if (!match) return false;
        }

        // Time filter (DateRangePicker)
        if (time && time[0] && time[1]) {
          const itemTime = new Date(item.time).getTime();
          const startTime = new Date(time[0]).getTime();
          const endTime = new Date(time[1]).getTime();
          if (itemTime < startTime || itemTime > endTime) return false;
        }

        return true;
      });
    });

    const imgPrefixURL = computed(() => {
      return isInternal.value ? `${getHIK_API()}/v1/users/facePic/LOCALS` : `${getBossCOS_URL()}/hikvision`;
    });

    const getImageUrl = (faceURL: string) => {
      if (!faceURL && faceURL === '') return 'null';
      return `${imgPrefixURL.value}${faceURL}`;
    };

    const getData = () => {
      loading.value = true;
      let url = `/faceAccess/event/list?page=${pagination.current}&pageSize=${pagination.pageSize}`;

      if (headerFilters.names && headerFilters.names.length > 0) {
        url += `&names=${encodeURIComponent(JSON.stringify(headerFilters.names))}`;
      }
      if (headerFilters.timeRange && headerFilters.timeRange.length === 2 && headerFilters.timeRange[0]) {
        url += `&startTime=${headerFilters.timeRange[0]}&endTime=${headerFilters.timeRange[1]}`;
      }

      useRequest({
        url,
        methods: 'GET',
        success: function (res) {
          const RES = typeof res === 'string' ? JSON.parse(res) : res;
          if (RES.errcode === 0) {
            data.value = RES.data.list;
            pagination.total = RES.data.total;
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

    const getUsers = () => {
      useRequest({
        url: '/faceAccess/user-list',
        methods: 'GET',
        success: function (res) {
          const RES = typeof res === 'string' ? JSON.parse(res) : res;
          if (RES.errcode === 0) {
            users.value = RES.data;
          } else {
            console.error('Error fetching users:', RES.errmsg);
          }
        },
        error: function (err) {
          console.error('Request error:', err);
        },
      });
    };

    const onPageChange = (pageInfo: any) => {
      pagination.current = pageInfo.current;
      pagination.pageSize = pageInfo.pageSize;
      getData();
    };

    const columns = computed(() => [
      { colKey: 'id', title: 'ID', width: 50 },
      { colKey: 'serialNo', title: 'serialNo', width: 80 },
      {
        colKey: 'major',
        title: '事件类型',
        width: 160,
        filter: {
          component: Select,
          props: {
            multiple: true,
            options: eventOptions,
            filterable: true,
            placeholder: '请选择',
          },
          showConfirmAndReset: true,
        },
        cell: (_h, { row }) => {
          const d = majorMap?.[row?.major];
          const m = d?.minor[row?.minor] ?? '其他';
          const minorTheme = minorSuccessList.includes(row?.minor)
            ? 'success'
            : minorFailList.includes(row?.minor)
            ? 'danger'
            : 'primary';
          return (
            <Space size="small">
              <Tag theme="default" variant="outline">
                {d?.label ?? '未知'}
              </Tag>
              <Tag theme={minorTheme} variant="light-outline">
                {m}
              </Tag>
            </Space>
          );
        },
      },
      {
        colKey: 'facePicURL',
        title: '人脸',
        width: 180,
        cell: (_h, { row }) => {
          const hasImg = Boolean(row.facePicURL);
          const noneFace = (error = false) => (
            <Space
              direction="vertical"
              size="small"
              style="align-items: center; color: var(--td-text-color-secondary);"
            >
              <ImageIcon size="24px" />
              <div style={{ font: 'var(--td-font-body-medium)' }}>{error ? '人脸加载失败' : '无人脸'}</div>
            </Space>
          );

          if (!hasImg) {
            return '-';
            // return (
            //   <div
            //     class="t-avatar t-avatar--round"
            //     style="width: 100px; height: 100px; font-size: 50px; background: var(--td-bg-color-component);"
            //   >
            //     {noneFace()}
            //   </div>
            // );
          }

          return (
            <ImageViewer
              visible={row.showViewer}
              images={[getImageUrl(row.facePicURL)]}
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
                    offset={[35, 0]}
                  >
                    <div class="t-image-viewer__trigger" style="width: unset;">
                      <Avatar
                        hideOnLoadFailed={false}
                        image={getImageUrl(row.facePicURL)}
                        shape="round"
                        style="width: 192px;height: 108px;background: var(--td-bg-color-component);"
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
      {
        colKey: 'name',
        title: '姓名',
        width: 160,
        filter: {
          component: Select,
          props: {
            multiple: true,
            options: nameOptions.value,
            filterable: true,
            placeholder: '请选择',
          },
          showConfirmAndReset: true,
        },
        cell: (_h, { row }) => {
          return row?.name || '-';
        },
      },
      {
        colKey: 'employeeNoString',
        title: '设备的人员编号',
        width: 160,
        cell: (_h, { row }) => {
          return row?.employeeNoString || '-';
        },
      },
      {
        colKey: 'time',
        title: '时间',
        width: 200,
        filter: {
          component: DateRangePicker,
          props: {
            enableTimePicker: true,
            placeholder: ['开始时间', '结束时间'],
          },
          showConfirmAndReset: true,
        },
      },
    ]);

    const onFilterChange = (val: any) => {
      filterValue.value = val;
      pagination.current = 1;

      // 如果清空了所有筛选条件，重新请求第一页的基础数据
      const hasFilter = Object.values(val).some((v: any) => {
        if (Array.isArray(v)) return v.length > 0;
        return !!v;
      });

      if (!hasFilter) {
        getData();
      }
    };

    const handleHeaderSearch = () => {
      pagination.current = 1;
      getData();
    };

    const handleHeaderReset = () => {
      headerFilters.names = [];
      headerFilters.timeRange = [];
      pagination.current = 1;
      getData();
    };

    // 发起同步请求
    const syncAcsEvents = () => {
      const dialog = DialogPlugin({
        header: '同步确认',
        body: '「事件同步」会从门禁设备拉取最新的事件数据，可能需要较长时间，同步进度请在「异步任务」中查看，请确认是否继续？',
        confirmBtn: '确认同步',
        cancelBtn: '取消',
        closeBtn: false,
        onConfirm: () => {
          dialog.destroy();
          MessagePlugin.loading('同步中，请稍后...');
        },
        onClose: () => {
          dialog.destroy();
        },
      });
    };

    onMounted(() => {
      MessagePlugin.loading('正在加载，请稍后...');
      getUsers();
      checkInternal()
        .then((internal) => {
          isInternal.value = false;
          getData();
        })
        .finally(() => {
          checkingInternal.value = false;
        });
    });

    return () => {
      return (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--td-bg-color-container)',
              padding: '16px',
              borderRadius: '4px',
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="medium">
              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}
              >
                <Space direction="vertical" size="small">
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>人员姓名</div>
                  <Select
                    v-model={headerFilters.names}
                    multiple
                    options={nameOptions.value}
                    filterable
                    placeholder="请选择人员"
                  />
                </Space>
                <Space direction="vertical" size="small">
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>时间区间</div>
                  <DateRangePicker
                    v-model={headerFilters.timeRange}
                    enableTimePicker
                    placeholder={['开始时间', '结束时间']}
                    style={{ width: '100%' }}
                  />
                </Space>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                  <Button style="width: 80px;" theme="primary" onClick={handleHeaderSearch}>
                    查询
                  </Button>
                  <Button style="width: 80px;" variant="outline" onClick={handleHeaderReset}>
                    重置
                  </Button>
                </div>
              </div>
            </Space>
          </div>
          <div
            class="narrow-scrollbar"
            style={{
              backgroundColor: 'var(--td-bg-color-container)',
              padding: '16px',
              borderRadius: '4px',
              height: '100%',
              overflow: 'auto',
            }}
          >
            <Button
              theme="primary"
              variant="outline"
              style="margin-bottom: 16px;"
              onClick={() => {
                syncAcsEvents();
              }}
            >
              发起事件同步
            </Button>
            <Table
              style={{ height: 'calc(100% - 96px)' }}
              columns={columns.value}
              data={filteredData.value}
              onFilterChange={onFilterChange}
              rowKey="id"
              loading={loading.value}
              maxHeight="100%"
              pagination={pagination}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      );
    };
  },
});
