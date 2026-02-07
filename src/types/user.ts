export interface UserListItem {
  id: number;
  name: string;
  code: string;
  class: string;
  password: null;
  share_device: number;
  group: number;
  grade: number;
  reg_time: string;
  join_time: string;
  login_time: string;
  openid: string;
  unionid: string;
  remark: string;
  phone: string;
  gender: string;
  syncWecom: number;
  isDefaultPws: boolean;
  type: number;
}

export type UserList = UserListItem[];

export interface UserFaceBindItem {
  id: number;
  usercode: string;
  employee_id: string;
  status: number;
}

export type UserFaceBindList = UserFaceBindItem[];

export interface HikFaceUserItem {
  /*ro, req, string, 工号（人员ID）, range:[1,32]*/
  employeeNo: string;
  /*ro, opt, string, 姓名, range:[0,128]*/
  name: string;
  /*ro, req, enum, 人员类型, subType:string, [normal#普通人（主人),visitor#来宾（访客),blackList#非授权名单人,patient#病患,maintenance#维护人
员（包括保洁、维修人员等),custom1#自定义人员类型1,custom2#自定义人员类型2,custom3#自定义人员类型3,custom4#自定义人员类型4,custom5#自定义人员类型
5,administrator#管理员]*/
  userType:
    | 'normal'
    | 'visitor'
    | 'blackList'
    | 'patient'
    | 'maintenance'
    | 'custom1'
    | 'custom2'
    | 'custom3'
    | 'custom4'
    | 'custom5'
    | 'administrator';
  /*ro, opt, bool, 是否关门延迟*/
  closeDelayEnabled: boolean;
  /*ro, opt, object, 有效期参数, desc:1、enable为true，表示人员非长期有效，且beginTime必须严格小于endTme；2、enable为false，表示人员长期有效，
这个时候上层仍然需要下发beginTime和endTime，设备也需要校验beginTime和endTime的合法性。*/
  Valid: {
    /*ro, req, bool, 使能有效期*/
    enable: boolean;
    /*ro, req, datetime, 有效期起始时间, desc:timeType字段不存在或为local时，beginTime为设备本地时间，如：2017-08-01T17:30:08；timeType字段
为UTC时，beginTime为UTC时间，如：2017-08-01T17:30:08+08:00*/
    beginTime: string;
    /*ro, req, datetime, 有效期结束时间, desc:timeType字段不存在或为local时，beginTime为设备本地时间，如：2017-08-01T17:30:08；timeType字段
为UTC时，beginTime为UTC时间，如：2017-08-01T17:30:08+08:00*/
    endTime: string;
    /*ro, opt, enum, 时间类型, subType:string, [local#设备本地时间,UTC#UTC时间]*/
    timeType: 'local' | 'UTC';
  };
  /*ro, opt, string, 所属群组*/
  belongGroup: string;
  /*ro, opt, string, 密码, range:[0,8], desc:当人员没有配置密码的时候，可返回为空*/
  password: string;
  /*ro, opt, string, 门权限, desc:1、当返回为空时，表示人员没有门权限，且RightPlan一般与doorRight配合使用。2、当只下发doorRight，不下发
RightPlan，表示人员一直拥有对应门权限。*/
  doorRight: string;
  /*ro, opt, array, 门权限计划, subType:object*/
  RightPlan: [
    {
      /*ro, opt, int, 门编号（锁ID）*/
      doorNo: number;
      /*ro, opt, string, 计划模板编号, desc:同个门不同计划模板采用权限“或的”方式处理，默认无计划模板编号。65535-7*24小时生效，65534-周一到
周五24小时生效，65533-周六周日24小时生效*/
      planTemplateNo: string;
    },
  ];
  /*ro, opt, int, 最大认证次数*/
  maxOpenDoorTime: number;
  /*ro, opt, int, 已认证次数*/
  openDoorTime: number;
  /*ro, opt, bool, 是否具有设备本地UI访问权限, desc:true-有权限，false-无权限*/
  localUIRight: boolean;
  /*ro, opt, enum, 人脸图片对应的人员性别, subType:string, [male#男,female#女,unknown#未知]*/
  gender: 'unknown' | 'male' | 'female';
  /*ro, opt, int, 关联卡数量, desc:不返回表示未关联卡*/
  numOfCard: number;
  /*ro, opt, int, 关联人脸数量, desc:不返回表示未关联人脸*/
  numOfFace: number;
  /*ro, opt, array, 人员信息扩展, subType:object, desc:用于配置人员在设备UI界面的扩展信息显示，明眸当前仅支持一个value，不支持id字段，用于作为
工号显示；智能主机按标准实现。*/
  PersonInfoExtends: [
    {
      /*ro, opt, string, 人员信息扩展内容*/
      value: string;
    },
  ];
  /*ro, opt, string, 人脸全景图URL, desc:8000端口透传及80端口时，此处返回设备本地存储URL；ISUP及萤石链路采用存储服务的URL；*/
  faceURL: string;
}

export type HikFaceUserList = HikFaceUserItem[];
