import useRequest from '@/hooks/useRequest';
import { Avatar, ImageViewer, MessagePlugin, Space, Table, Tag, Watermark } from 'tdesign-vue-next';
import { computed, defineComponent, onMounted, ref } from 'vue';
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

    const imgPrefixURL = computed(() => {
      return isInternal.value ? `${getHIK_API()}/v1/users/facePic/LOCALS` : `${getBossCOS_URL()}/hikvision`;
    });

    const getImageUrl = (faceURL: string) => {
      if (!faceURL && faceURL === '') return 'null';
      return `${imgPrefixURL.value}${faceURL}`;
    };

    const getData = () => {
      loading.value = true;
      useRequest({
        url: '/faceAccess/event/list',
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
    };

    const columns = [
      { colKey: 'id', title: 'ID', width: 50 },
      { colKey: 'serialNo', title: 'serialNo', width: 80 },
      {
        colKey: 'major',
        title: '事件类型',
        width: 160,
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
        cell: (_h, { row }) => {
          return row?.name || '-';
        },
      },
      {
        colKey: 'employeeNoString',
        title: 'employeeNoString',
        width: 160,
        cell: (_h, { row }) => {
          return row?.employeeNoString || '-';
        },
      },
      { colKey: 'time', title: 'time', width: 160 },
    ];

    onMounted(() => {
      MessagePlugin.loading('正在加载，请稍后...');
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
        <Table
          columns={columns}
          data={data.value}
          rowKey="employeeNo"
          loading={loading.value}
          maxHeight="calc( 100vh - 238px )"
        />
      );
    };
  },
});
