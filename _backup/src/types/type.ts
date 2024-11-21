interface ComponentsMap {
  [key: string]: Function
}

interface RouteItem {
  name: string,
  breadCrumb: {
    current: string,
    parent: string
  }
  permissions: string[],
  component: Function,
}

interface RouteMap extends Array<RouteItem> {}



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