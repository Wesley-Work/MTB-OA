
interface ComponentsMap {
  [key: string]: Function
}

export type RouteMapItems {
  key?: string,
  label: string,
  icon?: string,
  permissions?: string[],
  component?: Function,
  hidden?: boolean,
  hiddenBreadCrumb?: boolean,
  fatherCrumb?: string,
  children?: RouteMapItems[]
}

export type RouteMaps = RouteMapItems[]

export type LendTableDataItem = {
  id?: number,
  eqname: string,
  eqcode: string,
  status: object,
  user: string,
  dothisthinguser: string,
  lendtime: string,
  more: string,
  SHA?: string,
}

export type ReturnTableDataItem = {
  id?: number,
  eqname: string,
  eqcode: string,
  status: object,
  user: string,
  dothisthinguser: string,
  returntime: string,
  more: string,
  SHA?: string,
}

interface LendTableData extends Array<LendTableDataItem> {}