import { NotifyPlugin, Tag } from 'tdesign-vue-next';

import { findObjectByValueAndKeyInArray, taskTypeDesc } from '@hooks/common';
import useRequest from '@hooks/useRequest';

export const selectValueDisplay = (arr: Array<any>, value: string | number) => {
  const objectItem = findObjectByValueAndKeyInArray(arr, 'value', value) as {
    theme: string;
    color: string;
    label: string;
  };
  if (!objectItem) return null;
  return (
    <Tag variant="light-outline" theme={objectItem?.theme} color={objectItem.color}>
      {objectItem?.label} ({taskTypeDesc[objectItem?.label]})
    </Tag>
  );
};

export const taskEdit = (taskItem: any, changeData: any = {}) => {
  const finalData = {
    ...taskItem,
    ...{
      ...changeData,
    },
  };

  return new Promise((resolve, reject) => {
    useRequest({
      url: `/task/edit`,
      methods: 'POST',
      data: finalData,
      success: function (res) {
        const json = JSON.parse(res);
        if (json.errcode == 0) {
          NotifyPlugin.success({
            title: '操作成功',
          });
          resolve(true);
        } else {
          NotifyPlugin.error({
            title: '操作失败',
            content: json.errmsg,
          });
          reject(json.errmsg);
        }
      },
      error: function (err) {
        console.error(err);
        NotifyPlugin.error({
          title: '操作失败',
          content: err,
        });
        reject(err);
      },
    });
  });
};

export const taskGet = () => {
  return new Promise((resolve, reject) => {
    useRequest({
      url: '/task/list',
      methods: 'POST',
      success: function (res) {
        const json = JSON.parse(res);
        if (json.errcode != 0) {
          NotifyPlugin.error({
            title: '获取任务列表失败',
            content: json.errmsg,
          });
          reject(json.errmsg);
          return;
        }
        resolve(json?.data);
      },
      error: function (err) {
        console.error(err);
        NotifyPlugin.error({
          title: '获取任务列表失败',
          content: '错误：' + err,
        });
        reject(err);
      },
    });
  });
};
