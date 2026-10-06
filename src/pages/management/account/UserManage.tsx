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
import { AddIcon, DeleteIcon, FileExportIcon, UploadIcon } from 'tdesign-icons-vue-next';
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
              <Popconfirm
                theme="danger"
                content="确认删除？删除后不可恢复！"
                placement="bottom"
                onConfirm={(e) => handleDelete(e, row)}
              >
                <Link theme="danger">删除</Link>
              </Popconfirm>
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

    // 批量导入模板列定义（顺序即模板列顺序）
    const batchTemplateColumns = [
      { key: 'name', label: '姓名*', width: 14 },
      { key: 'code', label: 'Code*', width: 20 },
      { key: 'password', label: '密码', width: 16 },
      { key: 'class', label: '班级', width: 16 },
      { key: 'grade', label: '年级', width: 10 },
      { key: 'group', label: '组别', width: 14 },
      { key: 'phone', label: '手机号码', width: 16 },
      { key: 'gender', label: '性别', width: 8 },
      { key: 'syncWecom', label: '同步企业微信', width: 14 },
      { key: 'join_time', label: '加入时间', width: 14 },
      { key: 'share_device', label: '共享设备数', width: 12 },
    ];

    const downloadBatchTemplate = async () => {
      const workbook = new ExcelJS.Workbook();
      const ws = workbook.addWorksheet('Sheet1');
      ws.columns = batchTemplateColumns.map((c) => ({ header: c.label, key: c.key, width: c.width }));
      ws.getRow(1).font = { bold: true };
      ws.addRow({
        name: '张三',
        code: 'zhangsan',
        password: '123456',
        class: '高一1班',
        grade: dayjs().year(),
        group: groupOptions.value[0]?.label ?? '',
        phone: '13800000000',
        gender: '男',
        syncWecom: '否',
        join_time: dayjs().format('YYYY-MM-DD'),
        share_device: 2,
      });
      const help = workbook.addWorksheet('填写说明');
      [
        ['带 * 为必填；Code 不可与已有账号重复'],
        ['密码留空则使用默认密码 123456'],
        ['年级留空则不设置；组别填写系统已有组别名称，留空为默认组'],
        ['性别：男 / 女，可留空'],
        ['同步企业微信：是 / 否，留空为否'],
        ['加入时间格式：YYYY-MM-DD，留空为当前时间'],
        ['共享设备数留空为 2；单次最多导入 500 条'],
        ['示例行请删除或替换后再上传'],
      ].forEach((r) => help.addRow(r));
      help.getColumn(1).width = 70;
      const buffer = await workbook.xlsx.writeBuffer();
      const url = URL.createObjectURL(
        new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = '媒体部管理系统-批量新增账号模板.xlsx';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    const cellToText = (v: any): string => {
      if (v === null || v === undefined) return '';
      if (v instanceof Date) return dayjs(v).format('YYYY-MM-DD');
      if (typeof v === 'object') {
        if ('result' in v) return cellToText(v.result);
        if ('richText' in v) return v.richText.map((t) => t.text).join('');
        if ('text' in v) return String(v.text);
        return '';
      }
      return String(v).trim();
    };

    const parseBatchRow = (cells: Record<string, string>, seenCodes: Set<string>) => {
      const errors: string[] = [];
      const name = cells.name;
      const code = cells.code;
      if (!name) errors.push('姓名必填');
      if (!code) errors.push('Code必填');
      else if (seenCodes.has(code)) errors.push('Code在表格中重复');
      else if (tableBackData.value.some((u) => String(u.code) === code)) errors.push('Code已存在');
      if (code) seenCodes.add(code);

      let grade: number | null = null;
      if (cells.grade) {
        grade = Number(cells.grade);
        if (!Number.isInteger(grade) || grade < 2021 || grade > 2099) errors.push('年级应为2021-2099');
      }
      let group: number | null = null;
      if (cells.group) {
        const g = groupOptions.value.find((item) => item.label === cells.group);
        if (g) group = g.value;
        else errors.push(`组别不存在：${cells.group}`);
      }
      let gender: number | null = null;
      if (cells.gender) {
        if (cells.gender === '男') gender = 0;
        else if (cells.gender === '女') gender = 1;
        else errors.push('性别应为男/女');
      }
      let syncWecom = 1;
      if (cells.syncWecom) {
        if (cells.syncWecom === '是') syncWecom = 0;
        else if (cells.syncWecom !== '否') errors.push('同步企业微信应为是/否');
      }
      let joinTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      if (cells.join_time) {
        const d = dayjs(cells.join_time);
        if (d.isValid()) joinTime = d.format('YYYY-MM-DD HH:mm:ss');
        else errors.push('加入时间格式错误');
      }
      let shareDevice = 2;
      if (cells.share_device) {
        shareDevice = Number(cells.share_device);
        if (!Number.isInteger(shareDevice) || shareDevice < 0 || shareDevice > 99) errors.push('共享设备数应为0-99');
      }
      if (cells.phone && !/^[0-9+\-\s]{5,20}$/.test(cells.phone)) errors.push('手机号码格式错误');

      return {
        name,
        code,
        password: cells.password || '123456',
        class: cells.class || null,
        grade,
        group,
        groupLabel: cells.group,
        phone: cells.phone || null,
        gender,
        syncWecom,
        join_time: joinTime,
        share_device: shareDevice,
        errors,
      };
    };

    const parseBatchFile = async (file: File) => {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());
      const ws = workbook.worksheets[0];
      if (!ws) throw new Error('文件中没有工作表');

      // 按表头名称定位列，兼容列顺序调整
      const colIndex: Record<string, number> = {};
      ws.getRow(1).eachCell((cell, col) => {
        const text = cellToText(cell.value).replace('*', '');
        const def = batchTemplateColumns.find((c) => c.label.replace('*', '') === text);
        if (def) colIndex[def.key] = col;
      });
      if (!colIndex.name || !colIndex.code) throw new Error('表头不符合模板，请下载最新模板');

      const seenCodes = new Set<string>();
      const rows = [];
      ws.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const cells: Record<string, string> = {};
        batchTemplateColumns.forEach((c) => {
          cells[c.key] = colIndex[c.key] ? cellToText(row.getCell(colIndex[c.key]).value) : '';
        });
        if (Object.values(cells).every((v) => !v)) return;
        rows.push({ row: rowNumber, ...parseBatchRow(cells, seenCodes) });
      });
      return rows;
    };

    const showBatchPreviewDialog = (rows: any[]) => {
      const validRows = rows.filter((r) => r.errors.length === 0);
      const invalidCount = rows.length - validRows.length;
      const submitting = ref(false);

      const columns: TableProps['columns'] = [
        { colKey: 'row', title: '行号', width: 60 },
        { colKey: 'name', title: '姓名', width: 90 },
        { colKey: 'code', title: 'Code', width: 130, ellipsis: true },
        { colKey: 'class', title: '班级', width: 100, cell: (_h, { row }) => row.class ?? '-' },
        { colKey: 'grade', title: '年级', width: 70, cell: (_h, { row }) => row.grade ?? '-' },
        { colKey: 'groupLabel', title: '组别', width: 90, cell: (_h, { row }) => row.groupLabel || '默认' },
        { colKey: 'phone', title: '手机号码', width: 120, cell: (_h, { row }) => row.phone ?? '-' },
        {
          colKey: 'gender',
          title: '性别',
          width: 60,
          cell: (_h, { row }) => ({ 0: '男', 1: '女' }[row.gender] ?? '-'),
        },
        {
          colKey: 'syncWecom',
          title: '同步企微',
          width: 80,
          cell: (_h, { row }) => (row.syncWecom === 0 ? '是' : '否'),
        },
        { colKey: 'join_time', title: '加入时间', width: 110, cell: (_h, { row }) => row.join_time.slice(0, 10) },
        { colKey: 'share_device', title: '共享设备', width: 80 },
        {
          colKey: 'errors',
          title: '校验结果',
          width: 200,
          fixed: 'right',
          cell: (_h, { row }) =>
            row.errors.length ? (
              <Tag theme="danger" variant="light-outline">
                {row.errors.join('；')}
              </Tag>
            ) : (
              <Tag theme="success" variant="light-outline">
                通过
              </Tag>
            ),
        },
      ];

      const dialog = DialogPlugin({
        header: '批量新增账号预览',
        width: '85%',
        closeBtn: false,
        cancelBtn: '取消',
        confirmBtn: { content: `确认新增 ${validRows.length} 条`, disabled: validRows.length === 0 },
        closeOnEscKeydown: false,
        closeOnOverlayClick: false,
        onConfirm: () => {
          if (submitting.value) return;
          submitting.value = true;
          dialog.update({ confirmBtn: { content: '提交中...', loading: true } });
          useRequest({
            url: '/user/batch-add',
            methods: 'POST',
            data: {
              users: JSON.stringify(
                validRows.map((r) => ({
                  name: r.name,
                  code: r.code,
                  password: sha256(r.password).toString(),
                  class: r.class,
                  grade: r.grade,
                  group: r.group,
                  phone: r.phone,
                  gender: r.gender,
                  syncWecom: r.syncWecom,
                  join_time: r.join_time,
                  share_device: r.share_device,
                })),
              ),
            },
            success: function (res) {
              const RES = typeof res === 'string' ? JSON.parse(res) : res;
              if (RES.errcode === 0) {
                const { success, failed } = RES.data;
                NotifyPlugin(failed.length ? 'warning' : 'success', {
                  title: '批量新增完成',
                  content:
                    `成功 ${success.length} 条` +
                    (failed.length
                      ? `，失败 ${failed.length} 条：` +
                        failed.map((f) => `${f.code || '第' + f.row + '行'}(${f.reason})`).join('；')
                      : ''),
                  duration: 8000,
                });
                loadTableData();
                dialog.destroy();
              } else {
                submitting.value = false;
                dialog.update({ confirmBtn: { content: `确认新增 ${validRows.length} 条`, loading: false } });
                NotifyPlugin('error', { title: '批量新增失败', content: RES?.errmsg, duration: 5000 });
              }
            },
            error: function (err) {
              submitting.value = false;
              dialog.update({ confirmBtn: { content: `确认新增 ${validRows.length} 条`, loading: false } });
              NotifyPlugin('error', { title: '批量新增失败', content: err, duration: 5000 });
            },
          });
        },
        body: () => (
          <div>
            <Space style="margin-bottom: 12px">
              <Tag theme="primary" variant="light-outline">
                共 {rows.length} 条
              </Tag>
              <Tag theme="success" variant="light-outline">
                可新增 {validRows.length} 条
              </Tag>
              {invalidCount > 0 && (
                <Tag theme="danger" variant="light-outline">
                  校验未通过 {invalidCount} 条（将被跳过）
                </Tag>
              )}
            </Space>
            <Table rowKey="row" columns={columns} data={rows} size="small" bordered stripe maxHeight="50vh" />
          </div>
        ),
      });
    };

    const handleBatchAdd = () => {
      const dialog = DialogPlugin({
        header: '批量新增账号',
        width: '420px',
        closeBtn: false,
        cancelBtn: '取消',
        confirmBtn: '选择文件',
        body: () => (
          <Space direction="vertical">
            <div>1. 下载模板并按说明填写</div>
            <Button variant="dashed" onClick={downloadBatchTemplate}>
              下载 xlsx 模板
            </Button>
            <div>2. 选择填写好的 xlsx 文件，解析后可预览再确认新增</div>
          </Space>
        ),
        onConfirm: () => {
          dialog.destroy();
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.xlsx';
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            try {
              const rows = await parseBatchFile(file);
              if (rows.length === 0) {
                NotifyPlugin('warning', { title: '未解析到数据', content: '请确认表格中包含数据行', duration: 4000 });
                return;
              }
              if (rows.length > 500) {
                NotifyPlugin('warning', { title: '数据过多', content: '单次最多导入 500 条', duration: 4000 });
                return;
              }
              showBatchPreviewDialog(rows);
            } catch (e) {
              NotifyPlugin('error', { title: '解析文件失败', content: String(e?.message ?? e), duration: 5000 });
            }
          };
          input.click();
        },
      });
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

    const handleDelete = (e: Event, row) => {
      e?.stopPropagation();
      const { id } = row;
      useRequest({
        url: '/user/del',
        methods: 'POST',
        data: {
          id: id,
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
            loadTableData();
            SelectData.value = [];
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
        handleDelete(new Event('click'), element);
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
            <Button
              variant="outline"
              theme="primary"
              onClick={handleAdd}
              v-slots={{
                icon: () => <AddIcon />,
              }}
            >
              添加账号
            </Button>
            <Button variant="outline" theme="primary" v-slots={{ icon: () => <UploadIcon /> }} onClick={handleBatchAdd}>
              批量新增账号
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
