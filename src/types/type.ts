
interface ComponentsMap {
  [key: string]: Function
}


interface RouteMapItems {
  key?: string,
  label: string,
  icon?: string,
  permissions?: string[],
  component?: Function,
  hidden?: boolean,
  hiddenBreadCrumb?: boolean,
  children?: RouteMapItem[]
}


export type RouteMapItem = RouteMapItems

export type RouteMaps = RouteMapItem[]



interface LendTableDataItem {
  id?: number,
  eqname: string,
  eqcode: string,
  status: object,
  user: string,
  dothisthinguser: string,
  lendtime: string,
  more: string,
}

interface LendTableData extends Array<LendTableDataItem> {}