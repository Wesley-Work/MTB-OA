export interface TaskItem {
  change_time?: string;
  content: string;
  create_user?: string;
  equipment: string | string[];
  finally_time: string;
  id?: number;
  name: string;
  place: string;
  remark: string;
  status: number;
  type: number;
  user: string | string[];
  weight: number;
  work_time: string | string[];
  // v3.4新增
  supportClaim?: boolean; // 是否支持自主认领，默认true
  maxClaimant?: number; // 最大认领人，只限制自主认领，不限制编辑时的分配。默认不限制人数(-1)
  needStudy?: boolean; // 自主认领是否需要学习，默认false。如果学习包含了考试，则需要完成考试后才能认领
}
