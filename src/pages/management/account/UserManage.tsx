import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import dayjs from 'dayjs';
import {
  Button,
  DatePicker,
  DialogPlugin,
  Input,
  InputNumber,
  Link,
  NotifyPlugin,
  Popconfirm,
  Popup,
  Select,
  Space,
  Table,
  TableProps,
  Tag,
  Transfer,
  TransferProps,
} from 'tdesign-vue-next';
import { AddIcon, DeleteIcon, FileExportIcon } from 'tdesign-icons-vue-next';
import sha256 from 'crypto-js/sha256';
import useRequest from '@/hooks/useRequest';
import { loadSystemPermissions, loadUserPermissions } from '@/hooks/usePermission';
import { PermissionsArray, userListObject, UserSelectData } from '@/types/type';
import ExcelJS from 'exceljs';
import './UserManage.less';

export default defineComponent({
  name: 'UserManage',
  props: {
    handleChangeComponent: {
      type: Function,
    },
  },
  setup() {
    const vipMaps = [
      { value: 'VIP_Normal', label: 'VIP', class: 'normal-vip' },
      { value: 'VIP_Super', label: 'SVIP', class: 'svip-vip' },
      { value: 'VIP_Admin', label: 'Admin', class: 'admin-vip' },
      { value: 'VIP_Owner', label: 'Owner', class: 'owner-vip' },
    ];

    // 查找vip标签
    const renderVip = (remark: string) => {
      const vipObj = vipMaps.find((item) => item.value === remark || remark?.split(',').includes(item.value));
      return vipObj ? vipObj : null;
    };

    const table_Columns: TableProps['columns'] = [
      {
        colKey: 'row-select',
        type: 'multiple',
        width: 45,
      },
      {
        colKey: 'id',
        title: 'id',
        sortType: 'all',
        sorter: true,
        width: 80,
      },
      {
        colKey: 'code',
        title: 'Code',
        sortType: 'all',
        sorter: true,
        width: 200,
      },
      {
        colKey: 'name',
        title: '姓名',
        cell: (h, { row }) => {
          const v = renderVip(row.remark);
          const commonClass = 'vip-tag';
          return (
            <div style="display: flex;flex-direction: row;align-items: center;">
              <span>{row.name}</span>
              {v ? (
                <div class={`${commonClass} ${v?.class}`}>
                  <span>{v?.label}</span>
                  <div class="scan-light"></div>
                </div>
              ) : null}
            </div>
          );
        },
      },
      { colKey: 'class', title: '班级', sortType: 'all', sorter: true },
      {
        colKey: 'gender',
        title: '性别',
        width: 100,
        cell: (_h, { row }) => {
          const genderMap = { 0: { label: '男', color: '' }, 1: { label: '女', color: 'rgb(243, 109, 120)' } };
          return (
            <Tag theme="primary" color={genderMap[row.gender]?.color} variant="light-outline">
              {genderMap[row.gender]?.label ?? '-'}
            </Tag>
          );
        },
      },
      {
        colKey: 'phone',
        title: '手机号码',
        ellipsis: true,
        cell: (_h, { row }) => {
          return row.phone ?? '-';
        },
      },
      {
        colKey: 'grade',
        title: '年级',
        sortType: 'all',
        sorter: true,
        width: 120,
        cell: (h, { row }) => {
          return <Tag>{row.grade + '级'}</Tag>;
        },
      },
      {
        colKey: 'group',
        title: '组别',
        sortType: 'all',
        sorter: true,
        width: 110,
        cell: (_h, { row }) => {
          return <span>{groupOptions.value.find((item) => item.value === row.group)?.label ?? '-'}</span>;
        },
      },
      {
        colKey: 'reg_time',
        title: '注册日期',
        sortType: 'all',
        sorter: true,
        ellipsis: true,
        cell: (_h, { row }) => {
          return dayjs(row.reg_time).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        colKey: 'join_time',
        title: '加入时间',
        sortType: 'all',
        sorter: true,
        ellipsis: true,
        cell: (_h, { row }) => {
          return dayjs(row.join_time).format('YYYY-MM-DD');
        },
      },
      {
        colKey: 'login_time',
        title: '上次登录时间',
        sortType: 'all',
        sorter: true,
        ellipsis: true,
        cell: (_h, { row }) => {
          return row.login_time ? dayjs(row.login_time).format('YYYY-MM-DD HH:mm:ss') : '-';
        },
      },
      {
        colKey: 'syncWecom',
        title: '同步企业微信',
        width: 120,
        cell: (_h, { row }) => {
          const syncMap = { 0: { label: '是', theme: 'success' }, 1: { label: '否', theme: 'warning' } };
          return (
            <Tag theme={syncMap[row.syncWecom]?.theme} variant="light-outline">
              {syncMap[row.syncWecom]?.label ?? '-'}
            </Tag>
          );
        },
      },
      {
        colKey: 'operation',
        title: '操作',
        cell: (h, { row }) => {
          return (
            <Space>
              <Link theme="primary" onClick={(e) => handleEdit(e, row)}>
                编辑
              </Link>
              <Link theme="danger">删除</Link>
            </Space>
          );
        },
      },
    ];

    const tableData = ref([]);
    const tableBackData = ref([]);
    const tableSort = ref({
      sortBy: 'id',
      descending: false,
    });
    const tableLoading = ref(false);
    const SelectData = ref<UserSelectData>([]);
    const actionMode = ref('add');

    const defaultDialogData = {
      id: null,
      name: null,
      class: null,
      code: null,
      password: null,
      share_device: 2,
      group: null,
      grade: dayjs().year(),
      phone: null,
      gender: null,
      syncWecom: null,
      reg_time: new Date(),
      join_time: new Date(),
    };

    const EditUserDialogForm = ref<userListObject>({ ...defaultDialogData });

    const ResetDialogForm = (use: userListObject = null) => {
      EditUserDialogForm.value = use ? { ...use } : { ...defaultDialogData };
    };

    const groupOptions = ref([]); // 组列表
    const systemPermissionsList = ref([]); // 权限列表
    const backupPermissionsValue = reactive({
      value: [], // target
      data: [], // source
    });

    const permissionsTransfer = reactive({
      data: [],
      value: [],
      nameList: {},
      statusList: {},
      proxyStatus: {},
    });

    const activeUserPerm = ref<{ users?: any[]; group?: any[]; position?: any[] }>({});

    const positionData = reactive({
      selectedPositionIds: [], // 已选中的职位 ID 列表
      allPositions: [], // 所有可用职位列表
    });

    const tablePagination = reactive({
      current: 1,
      pageSize: 25,
      pageSizeOptions: [25, 75, 115, 150],
      total: 0,
      showJumper: true,
    });

    const loadSystemPermissionsList = () => {
      loadSystemPermissions()
        .then((res: PermissionsArray) => {
          systemPermissionsList.value = JSON.parse(JSON.stringify(res));
          backupPermissionsValue.data = JSON.parse(JSON.stringify(res));
          permissionsTransfer.data = res.map((item) => {
            return {
              label: item.object,
              value: item.val,
            };
          });
          permissionsTransfer.nameList = res.reduce((acc, cur) => {
            acc[cur.val] = cur.object;
            return acc;
          }, {});
        })
        .catch((err) => {
          console.error(err);
        });
    };

    const getUserPermissionsList = (uid: number) => {
      useRequest({
        url: '/permissions/get-user-list',
        methods: 'GET',
        data: {
          id: uid,
        },
        success: function (res) {
          const result = JSON.parse(res);
          if (result.errcode !== 0) {
            NotifyPlugin.error({
              title: '获取用户权限失败',
              content: result.errmsg,
            });
            return;
          }
          activeUserPerm.value = result.data;
          if (actionMode.value === 'edit') {
            initPermissionsTransfer();
          }
        },
        error: function (err) {
          NotifyPlugin.error({
            title: '获取用户权限失败',
            content: err,
          });
        },
      });
    };

    const getGroupPermissionsList = (gid: number) => {
      useRequest({
        url: '/permissions/get-group-list',
        methods: 'GET',
        data: {
          id: gid,
        },
        success: function (res) {
          const result = typeof res === 'string' ? JSON.parse(res) : res;
          if (result.errcode === 0) {
            activeUserPerm.value.group = result.data;
          }
        },
      });
    };

    const handleAdd = () => {
      actionMode.value = 'add';
      initPermissionsTransfer();
      ResetDialogForm();
      positionData.selectedPositionIds = [];
      positionData.allPositions = [];
      showEditDialog();
    };

    const handleEdit = (e: Event, row) => {
      e.stopPropagation();
      actionMode.value = 'edit';
      const { id } = row;
      ResetDialogForm(row);
      getUserPermissionsList(id);
      loadUserPositions(id); // 加载用户的职位信息
      showEditDialog();
    };

    const initPermissionsTransfer = () => {
      permissionsTransfer.value = [];
      permissionsTransfer.statusList = {};
      permissionsTransfer.proxyStatus = {};
      handlePermissionDialogClose();
      if (actionMode.value === 'edit') {
        permissionsTransfer.value = (activeUserPerm.value.users ?? []).map((item) => {
          return item.val ?? '未知权限';
        });
      }
    };

    const restorePermissionsStatus = () => {
      (activeUserPerm.value.users ?? []).forEach((item) => {
        permissionsTransfer.statusList[item.val] = {
          open: !!item?.open,
        };
      });
      permissionsTransfer.proxyStatus = JSON.parse(JSON.stringify(permissionsTransfer.statusList));
    };

    const setPermissionsStatus = (val: string, open: boolean) => {
      (activeUserPerm.value.users ?? []).forEach((item) => {
        if (item.val === val) {
          item.open = open;
        }
      });
    };

    const handlePermissionDialogClose = () => {
      restorePermissionsStatus();
    };

    const handlePermissionsTransferChange: TransferProps['onChange'] = (_val, ctx) => {
      const { movedValue, type } = ctx;
      if (type === 'target') {
        movedValue.forEach((item) => {
          permissionsTransfer.statusList[item] = {
            open: true,
          };
        });
      } else if (type === 'source') {
        movedValue.forEach((item) => {
          delete permissionsTransfer.statusList[item];
        });
      }
    };

    const handleSavePermissions = () => {
      permissionsTransfer.proxyStatus = JSON.parse(JSON.stringify(permissionsTransfer.statusList));
      Object.keys(permissionsTransfer.statusList).forEach((item) => {
        setPermissionsStatus(item, permissionsTransfer.statusList[item]?.open);
      });
    };

    const togglePermissionStatus = (val) => {
      const isOpen = permissionsTransfer.statusList[val]?.open === true;
      permissionsTransfer.statusList[val] = {
        open: !isOpen,
      };
    };

    const loadUserPositions = (userId: number) => {
      useRequest({
        url: '/position/availableList',
        methods: 'POST',
        data: { user_id: userId },
        success: function (res) {
          const RES = typeof res === 'string' ? JSON.parse(res) : res;
          if (RES.errcode === 0 && RES.data) {
            positionData.allPositions = RES.data.map((item) => ({
              label: item.name,
              value: item.id,
            }));
          }
        },
        error: function (err) {
          console.error('获取可用职位列表失败:', err);
        },
      });

      useRequest({
        url: '/position/listByUser',
        methods: 'POST',
        data: { user_id: userId },
        success: function (res) {
          const RES = typeof res === 'string' ? JSON.parse(res) : res;
          if (RES.errcode === 0 && RES.data) {
            positionData.selectedPositionIds = RES.data.map((item) => item.position_id);
          }
        },
        error: function (err) {
          console.error('获取用户职位列表失败:', err);
        },
      });
    };

    const handlePositionChange = () => {
      if (!EditUserDialogForm.value.id) return;

      const userId = EditUserDialogForm.value.id;
      const selectedIds = positionData.selectedPositionIds;

      useRequest({
        url: '/position/updateUserPositions',
        methods: 'POST',
        data: {
          uid: userId,
          ids: selectedIds,
        },
        success: function (res) {
          const RES = typeof res === 'string' ? JSON.parse(res) : res;
          if (RES.errcode === 0) {
            NotifyPlugin('success', {
              title: '职位更新成功',
              content: '成功更新用户职位绑定',
              duration: 3000,
            });
          } else {
            NotifyPlugin('error', {
              title: '职位更新失败',
              content: RES?.errmsg || '职位更新失败',
              duration: 3000,
            });
            loadUserPositions(userId);
          }
        },
        error: function (err) {
          NotifyPlugin('error', {
            title: '职位更新失败',
            content: err,
            duration: 3000,
          });
          console.error('职位更新失败:', err);
          loadUserPositions(userId);
        },
      });
    };

    const loadGroupData = () => {
      try {
        useRequest({
          url: '/group/list',
          methods: 'POST',
          success: function (res) {
            const RES = typeof res === 'string' ? JSON.parse(res) : res;
            if (RES.errcode == 0) {
              groupOptions.value = [];
              for (const key in RES.data) {
                const element = RES.data[key];
                groupOptions.value.push({ label: element.name, value: element.id, type: element.type });
              }
            }
          },
          error: function (err) {
            console.error(err);
            NotifyPlugin('error', {
              title: '获取组列表失败',
              content: err,
              duration: 5000,
            });
          },
        });
      } catch (e) {
        console.error(e);
      }
    };

    const loadTableData = () => {
      tableLoading.value = true;
      try {
        useRequest({
          url: '/user/list',
          methods: 'POST',
          success: function (res) {
            const RES = typeof res === 'string' ? JSON.parse(res) : res;
            tableData.value = RES.data;
            tableBackData.value = RES.data;
            tablePagination.total = tableData.value.length;
          },
          error: function (err) {
            console.error(err);
            NotifyPlugin('error', {
              title: '获取账号列表失败',
              content: err,
              duration: 5000,
            });
          },
          complete: function () {
            tableLoading.value = false;
          },
        });
      } catch (e) {
        console.error(e);
      }
    };

    const DeleteAccount = () => {
      const list = SelectData.value;
      list.forEach((element, index) => {
        useRequest({
          url: '/user/del',
          methods: 'POST',
          data: {
            id: element.id,
          },
          success: function (res) {
            const RES = typeof res === 'string' ? JSON.parse(res) : res;
            if (RES.errcode === 0) {
              const U_id = RES.data.id;
              NotifyPlugin('success', {
                title: '删除账号成功',
                content: `成功删除了id为${U_id}的用户`,
                duration: 5000,
              });
              if (index === list.length - 1) {
                SelectData.value = [];
                loadTableData();
              }
            }
          },
          error: function (err) {
            NotifyPlugin('error', {
              title: '删除账号失败',
              content: err,
              duration: 5000,
            });
            console.error(err);
          },
        });
      });
    };

    const exportToXlsx = () => {
      async function createExcel() {
        const headerStyle = {
          font: { name: 'Arial', family: 4, size: 12, bold: true },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A0C2FA' } },
          alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
          border: {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } },
          },
        };

        const bodyStyle = {
          font: { name: '黑体', family: 4, size: 12, bold: true },
          alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
          border: {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } },
          },
        };

        const headerRow = [
          { key: 'id', label: 'id', width: 6.5 },
          { key: 'code', label: '用户Code', width: 20 },
          { key: 'name', label: '姓名', width: 14 },
          { key: 'class', label: '班级', width: 16 },
          { key: 'grade', label: '年级', width: 12 },
          { key: 'group', label: '组别', width: 14 },
          { key: 'phone', label: '手机号码', width: 18 },
          { key: 'gender', label: '性别', width: 10 },
          { key: 'syncWecom', label: '同步企业微信', width: 16 },
          { key: 'reg_time', label: '注册时间', width: 27 },
          { key: 'join_time', label: '加入时间', width: 22 },
          { key: 'password', label: '密码', width: 17 },
          { key: 'share_device', label: '共享设备数', width: 6.5 },
          { key: 'openid', label: '微信openid', width: 18 },
          { key: 'remark', label: '备注', width: 26 },
        ];

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('Sheet1');
        ws.addRow(headerRow.map((it) => it.label)).eachCell((cell) => {
          // @ts-ignore
          cell.style = headerStyle;
        });
        tableData.value.forEach((it) => {
          const unUsual = ['老师', '保留用户', '系统用户'];
          const isUnusual = unUsual.includes(groupOptions.value.find((item) => item.value === it.group)?.label ?? '');
          const w = ws.addRow(
            Object.values({
              id: it.id,
              code: it.code,
              name: it.name,
              class: it.class,
              grade: it.grade,
              group: groupOptions.value.find((item) => item.value === it.group)?.label ?? '',
              phone: it.phone ?? '',
              gender: { 0: '男', 1: '女' }[it.gender] ?? '',
              syncWecom: { 0: '是', 1: '否' }[it.syncWecom] ?? '',
              reg_time: dayjs(it.reg_time).format('YYYY-MM-DD HH:mm:ss'),
              join_time: dayjs(it.join_time).format('YYYY-MM-DD'),
              password: it.password,
              share_device: it.share_device,
              openid: it.openid,
              remark: it.remark,
            }),
          );
          w.height = 40;
          w.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber === 1) {
              // @ts-ignore
              cell.style = {
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A0C2FA' } },
                ...bodyStyle,
              };
            } else if (isUnusual) {
              // @ts-ignore
              cell.style = {
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5EE' } },
                ...bodyStyle,
              };
            } else {
              // @ts-ignore
              cell.style = bodyStyle;
            }
          });
        });

        const lastRow = ws.addRow([`本数据表由媒体部管理系统导出，导出时间：${dayjs().format('YYYY-MM-DD HH:mm:ss')}`]);
        lastRow.height = 55;
        lastRow.eachCell({ includeEmpty: true }, (cell) => {
          // @ts-ignore
          cell.style = {
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F5DEB3' } },
            ...bodyStyle,
          };
        });
        const aToZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        ws.mergeCells(`A${ws.rowCount}:${aToZ[headerRow.length - 1]}${ws.rowCount}`);

        ws.columns = headerRow.map((header) => ({
          header: header.label,
          key: header.label,
          width: header.width,
        }));

        workbook.xlsx
          .writeBuffer()
          .then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `媒体部管理系统-人员名单.${dayjs().format('YYMMDD')}.xlsx`;
            a.click();
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
              a.remove();
            }, 100);
          })
          .catch((err) => console.error('Error creating file:', err));
      }
      createExcel();
    };

    const submitForm = (dialogInstance: any) => {
      const isEditMode = actionMode.value === 'edit';

      const SUBDATA = {
        name: EditUserDialogForm.value.name,
        code: EditUserDialogForm.value.code,
        class: EditUserDialogForm.value.class,
        password: EditUserDialogForm.value.password ? sha256(EditUserDialogForm.value.password).toString() : null,
        share_device: EditUserDialogForm.value.share_device,
        group: EditUserDialogForm.value.group,
        grade: EditUserDialogForm.value.grade,
        phone: EditUserDialogForm.value.phone,
        gender: EditUserDialogForm.value.gender,
        syncWecom: EditUserDialogForm.value.syncWecom,
        reg_time: dayjs(EditUserDialogForm.value.reg_time).format('YYYY-MM-DD HH:mm:ss'),
        join_time: dayjs(EditUserDialogForm.value.join_time).format('YYYY-MM-DD HH:mm:ss'),
        permissions_open: Object.keys(permissionsTransfer.proxyStatus).filter(
          (key) => permissionsTransfer.proxyStatus[key].open,
        ),
        permissions_close: Object.keys(permissionsTransfer.proxyStatus).filter(
          (key) => !permissionsTransfer.proxyStatus[key].open,
        ),
      };
      const FORMDATA = isEditMode
        ? {
            id: EditUserDialogForm.value.id,
            ...SUBDATA,
          }
        : SUBDATA;

      const showError = (err) => {
        NotifyPlugin('error', {
          title: '设置账号信息失败',
          content: err,
          duration: 5000,
        });
        console.error(err);
      };

      if (isEditMode) {
        useRequest({
          url: '/user/edit',
          methods: 'POST',
          data: FORMDATA,
          success: function (res) {
            const RES = typeof res === 'string' ? JSON.parse(res) : res;
            if (RES.errcode === 0) {
              const E_id = RES.data.id;
              NotifyPlugin('success', {
                title: '编辑账号信息成功',
                content: `成功编辑了id为${E_id}的账号信息`,
                duration: 5000,
              });
              ResetDialogForm();
              loadTableData();
              dialogInstance.destroy();
            } else {
              showError(RES?.data ?? RES?.errmsg);
            }
          },
          error: function (err) {
            NotifyPlugin('error', {
              title: '编辑账号信息失败',
              content: err,
              duration: 5000,
            });
            console.error(err);
          },
        });
      } else {
        useRequest({
          url: '/user/add',
          methods: 'POST',
          data: FORMDATA,
          success: function (res) {
            const RES = typeof res === 'string' ? JSON.parse(res) : res;
            if (RES.errcode === 0) {
              const E_id = RES.data.id;
              NotifyPlugin('success', {
                title: '添加账号成功',
                content: `成功添加了id为${E_id}的账号`,
                duration: 5000,
              });
              ResetDialogForm();
              loadTableData();
              dialogInstance.destroy();
            } else {
              showError(RES?.data ?? RES?.errmsg);
            }
          },
          error: function (err) {
            NotifyPlugin('error', {
              title: '添加账号失败',
              content: err,
              duration: 5000,
            });
            console.error(err);
          },
        });
      }
    };

    const sortChange = (e) => {
      tableSort.value = e;
      TableSortData();
    };

    const TableSortData = () => {
      const data = tableData.value;
      const sort = tableSort.value;
      if (sort && sort.sortBy) {
        tableData.value = data
          .concat()
          .sort((a, b) =>
            sort.descending
              ? Intl.Collator('zh-Hans-CN', { sensitivity: 'accent' }).compare(a[sort.sortBy], b[sort.sortBy])
              : Intl.Collator('zh-Hans-CN', { sensitivity: 'accent' }).compare(b[sort.sortBy], a[sort.sortBy]),
          );
      } else {
        tableData.value = tableBackData.value;
      }
    };

    const handleTableSelectChange = (_value, { selectedRowData }) => {
      SelectData.value = selectedRowData;
    };

    const onPageChange = (pageInfo) => {
      tablePagination.current = pageInfo.current;
      tablePagination.pageSize = pageInfo.pageSize;
    };

    const openPermissionsDialog = () => {
      if (actionMode.value === 'add') {
        const gid = EditUserDialogForm.value['group'];
        if (gid) {
          getGroupPermissionsList(gid);
        }
      }
      initPermissionsTransfer();

      const dialog = DialogPlugin({
        header: '配置权限',
        width: '40%',
        closeBtn: false,
        cancelBtn: '取消',
        confirmBtn: '保存',
        closeOnEscKeydown: false,
        destroyOnClose: true,
        onConfirm: () => {
          handleSavePermissions();
          dialog.destroy();
        },
        onClose: () => {
          handlePermissionDialogClose();
          dialog.destroy();
        },
        body: () => (
          <Transfer
            v-model={permissionsTransfer.value}
            data={permissionsTransfer.data}
            operation={['移除', '添加']}
            class="transfer-horizontal"
            onChange={handlePermissionsTransferChange}
            v-slots={{
              title: (props) => <div>{props.type === 'target' ? '用户现有' : '权限池'}</div>,
              footer: (props) =>
                (activeUserPerm.value.group?.length || 0) !== 0 &&
                props.type === 'target' && (
                  <div class="transfer-footer--tagGroup narrow-scrollbar">
                    {activeUserPerm.value.group?.map((item, index) => (
                      <div key={index}>
                        <span class="group-permission--item" style="display: flex; align-items: center;">
                          <Tag theme="primary" variant="light-outline" size="small" style="margin-right: 4px">
                            <span>组</span>
                          </Tag>
                          {permissionsTransfer.nameList[item?.val]}
                        </span>
                      </div>
                    ))}
                    {activeUserPerm.value.position?.map((item, index) => (
                      <div key={index}>
                        <span class="group-permission--item" style="display: flex; align-items: center;">
                          <Tag color="rgb(0, 22, 82)" variant="light-outline" size="small" style="margin-right: 4px">
                            <span>职</span>
                          </Tag>
                          {permissionsTransfer.nameList[item?.val]}
                        </span>
                      </div>
                    ))}
                  </div>
                ),
              transferItem: ({ data, index, type }) => (
                <div data-transfer-checkbox-id={index} style="margin-left: 8px">
                  {(activeUserPerm.value.group?.map((item) => item.val).includes(data.value) ||
                    activeUserPerm.value.position?.map((item) => item.val).includes(data.value)) &&
                    type === 'target' && (
                      <Tag color="rgb(217, 0, 87)" variant="light-outline" size="small" style="margin-right: 4px">
                        <span>重复</span>
                      </Tag>
                    )}
                  <Popup placement="top" content={data.value}>
                    {data.label}
                  </Popup>
                  {type === 'target' && (
                    <span
                      class="UserCanTSelect"
                      onClick={(e) => {
                        // Prevent the Transfer item from being selected when clicking the Tag
                        e.preventDefault();
                        togglePermissionStatus(data.value);
                      }}
                    >
                      <Tag
                        theme={
                          permissionsTransfer.statusList[data.value]?.open === true
                            ? 'success'
                            : permissionsTransfer.statusList[data.value]?.open === false
                            ? 'danger'
                            : 'warning'
                        }
                        variant="light-outline"
                        size="small"
                        style="margin-left: 4px"
                      >
                        {permissionsTransfer.statusList[data.value]?.open === true ? (
                          <span>开启</span>
                        ) : permissionsTransfer.statusList[data.value]?.open === false ? (
                          <span>关闭</span>
                        ) : (
                          <span>⚠ 未知状态</span>
                        )}
                      </Tag>
                    </span>
                  )}
                </div>
              ),
            }}
          />
        ),
      });
    };

    const showEditDialog = () => {
      const dialog = DialogPlugin({
        header: (actionMode.value === 'add' ? '新增' : '编辑') + '用户',
        width: '45%',
        closeBtn: false,
        cancelBtn: '取消',
        confirmBtn: '提 交',
        closeOnEscKeydown: false,
        onConfirm: () => {
          submitForm(dialog);
        },
        body: () => (
          <div style="width: 100%; margin-top: 8px">
            <div style="width: 100%; margin-top: 8px">
              <Space direction="horizontal" size="16px" style="width: 100%">
                <Space direction="vertical" size="12px" style="width: 100%">
                  <div style="font-size: 20px; font-weight: 700; color: var(--td-text-color-primary)">基本信息</div>
                  <div required>
                    <Input v-model={EditUserDialogForm.value.name} label="用户名称：" type="text" />
                  </div>
                  <div required>
                    <Input v-model={EditUserDialogForm.value.code} label="用户Code：" type="text" />
                  </div>
                  <div unrequired>
                    <Input v-model={EditUserDialogForm.value.class} label="班级：" type="text" />
                  </div>
                  <div unrequired>
                    <InputNumber
                      v-model={EditUserDialogForm.value.grade}
                      theme="column"
                      max={2099}
                      min={2021}
                      label="年级："
                      style="width: 100%"
                    />
                  </div>
                  <div>
                    <div style="display: flex">
                      <Input
                        v-model={EditUserDialogForm.value.password}
                        required={actionMode.value === 'add'}
                        label="账户密码："
                        type="text"
                      />
                      <Button variant="dashed" onClick={() => (EditUserDialogForm.value.password = '123456')}>
                        默认密码
                      </Button>
                    </div>
                  </div>
                  <div unrequired>
                    <Input v-model={EditUserDialogForm.value.phone} label="手机号码：" type="tel" />
                  </div>
                  <div unrequired>
                    <Select
                      v-model={EditUserDialogForm.value.gender}
                      options={[
                        { label: '男', value: 0 },
                        { label: '女', value: 1 },
                      ]}
                      label="性别："
                      placeholder="请选择"
                      clearable
                    />
                  </div>
                  <div unrequired>
                    <Select
                      v-model={EditUserDialogForm.value.syncWecom}
                      options={[
                        { label: '是', value: 0 },
                        { label: '否', value: 1 },
                      ]}
                      label="同步企业微信："
                      placeholder="请选择"
                      clearable
                    />
                  </div>
                </Space>
                <Space direction="vertical" size="12px" style="width: 100%">
                  <div style="font-size: 20px; font-weight: 700; color: var(--td-text-color-primary)">其他信息</div>
                  <div required>
                    <Button variant="dashed" block onClick={openPermissionsDialog}>
                      配置权限
                    </Button>
                  </div>
                  <div>
                    <Select
                      v-model={EditUserDialogForm.value.group}
                      options={groupOptions.value}
                      label="组别："
                      placeholder="请选择"
                    />
                  </div>
                  <div>
                    <Select
                      v-model={positionData.selectedPositionIds}
                      options={positionData.allPositions}
                      multiple
                      label="绑定职位："
                      placeholder="请选择"
                      clearable
                      onChange={handlePositionChange}
                    />
                  </div>
                  <div>
                    <InputNumber
                      v-model={EditUserDialogForm.value.share_device}
                      theme="column"
                      max={99}
                      min={0}
                      label="共享设备数："
                      style="width: 100%"
                    />
                  </div>
                  <div style="display: flex; align-items: center">
                    <span
                      style={{
                        width: '25%',
                        zIndex: 2,
                        height: '100%',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 'var(--td-font-size-body-medium)',
                        color: 'var(--td-text-color-primary)',
                      }}
                    >
                      加入时间：
                    </span>
                    <DatePicker
                      style={{ width: '100%' }}
                      allowInput={true}
                      placeholder="请选择"
                      v-model={EditUserDialogForm.value.join_time}
                    />
                  </div>
                  <div style="display: flex; align-items: center">
                    <span
                      style={{
                        width: '25%',
                        zIndex: 2,
                        height: '100%',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 'var(--td-font-size-body-medium)',
                        color: 'var(--td-text-color-primary)',
                      }}
                    >
                      注册时间：
                    </span>
                    <DatePicker
                      style={{ width: '100%' }}
                      allowInput={true}
                      placeholder="请选择"
                      format="YYYY-MM-DD HH:mm:ss"
                      enableTimePicker={true}
                      v-model={EditUserDialogForm.value.reg_time}
                    />
                  </div>
                </Space>
              </Space>
            </div>
          </div>
        ),
      });
    };

    onMounted(() => {
      loadUserPermissions();
      loadSystemPermissionsList();
      loadTableData();
      loadGroupData();
    });

    return () => (
      <div style="background-color: var(--td-bg-color-container); border-radius: 5px">
        <div style="display: flex; flex-direction: row; padding: 12px; justify-content: space-between">
          <Space size="small">
            <Button variant="outline" theme="primary" onClick={handleAdd}>
              {{
                icon: () => <AddIcon />,
                default: () => '添加账号',
              }}
            </Button>
            <Popconfirm
              theme="danger"
              content="确认删除？删除后不可恢复！"
              placement="bottom"
              onConfirm={DeleteAccount}
            >
              <Button disabled={SelectData.value.length === 0} theme="danger">
                {{
                  icon: () => <DeleteIcon />,
                  default: () => (SelectData.value.length === 0 ? '删除' : '删除 ' + SelectData.value.length + ' 个'),
                }}
              </Button>
            </Popconfirm>
            <Button theme="success" onClick={exportToXlsx}>
              {{
                icon: () => <FileExportIcon />,
                default: () => '导出账号列表',
              }}
            </Button>
          </Space>
        </div>
        <div style="padding: 0px 16px">
          <Table
            rowKey="id"
            columns={table_Columns}
            data={tableData.value}
            selectOnRowClick
            reserveSelectedRowOnPaginate={false}
            sort={tableSort.value}
            pagination={tablePagination}
            loading={tableLoading.value}
            cellEmptyContent="-"
            stripe
            bordered
            maxHeight="calc( 100vh - 334px )"
            onSortChange={sortChange}
            onSelectChange={handleTableSelectChange}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    );
  },
});
