export interface FetchOptions {
  url: string;
  token?: string;
  methods?: string;
  header?: object;
  data?: object | string;
  useCustomURL?: boolean;
  timeout?: number;
  success?: Function | void;
  error?: Function | void;
  complete?: Function | void;
}
