// fetch.ts
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestConfig {
  baseURL?: string;
  timeout?: number;
  headers?: HeadersInit;
}

interface RequestOptions<T = any> {
  method?: RequestMethod;
  data?: Record<string, any> | FormData;
  headers?: HeadersInit;
  signal?: AbortSignal;
  success?: (data: T) => void;
  failed?: (error: Error) => void;
  complete?: () => void;
}

class HttpRequest {
  private readonly config: RequestConfig;

  constructor(config: RequestConfig = {}) {
    this.config = {
      baseURL: config.baseURL || '',
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    };
  }

  async request<T = any>(
    url: string,
    options: RequestOptions<T> = {},
  ): Promise<{
    data: T;
    status: number;
    statusText: string;
  }> {
    const controller = new AbortController();
    const { method = 'GET', data, headers = {}, signal, success, failed, complete } = options;

    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      try {
        let fullUrl = this.config.baseURL ? `${this.config.baseURL}${url}` : url;

        // 处理GET参数
        if (method === 'GET' && data) {
          const params = new URLSearchParams(data as Record<string, string>);
          fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${params.toString()}`;
        }

        // 处理请求体
        let body: BodyInit | null = null;
        if (method !== 'GET' && data) {
          body = data instanceof FormData ? data : JSON.stringify(data);
        }

        // 合并headers
        const mergedHeaders = { ...this.config.headers, ...headers };

        // 发起请求
        const response = await fetch(fullUrl, {
          method,
          headers: mergedHeaders,
          body,
          signal: signal || controller.signal,
        });

        clearTimeout(timeoutId);

        // 处理响应状态
        if (!response.ok) {
          const error = new Error(`HTTP error! status: ${response.status}`);
          failed?.(error);
          reject(error);
          return;
        }

        // 解析响应数据
        const contentType = response.headers.get('content-type');
        let responseData: T;

        if (contentType?.includes('application/json')) {
          responseData = await response.json();
        } else if (contentType?.includes('text/')) {
          responseData = (await response.text()) as T;
        } else {
          responseData = (await response.blob()) as T;
        }

        // 处理成功回调
        const result = {
          data: responseData,
          status: response.status,
          statusText: response.statusText,
        };

        success?.(result.data);
        resolve(result);
      } catch (error) {
        clearTimeout(timeoutId);
        const err = error instanceof Error ? error : new Error('Unknown request error');

        // 处理超时错误
        if (err.name === 'AbortError') {
          const timeoutError = new Error(`请求超时（${this.config.timeout}ms）`);
          failed?.(timeoutError);
          reject(timeoutError);
        } else {
          failed?.(err);
          reject(err);
        }
      } finally {
        complete?.();
      }
    });
  }

  // 增强型GET方法
  get<T = any>(url: string, params?: Record<string, any>, options?: Omit<RequestOptions<T>, 'method' | 'data'>) {
    return this.request<T>(url, {
      ...options,
      method: 'GET',
      data: params,
    });
  }

  // 增强型POST方法
  post<T = any>(
    url: string,
    data?: Record<string, any> | FormData,
    options?: Omit<RequestOptions<T>, 'method' | 'data'>,
  ) {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      data,
    });
  }

  // 其他方法保持类似结构...
}

// 创建实例
export const http = new HttpRequest({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 15000,
});

/* 使用示例 */
// 1. Promise链式调用
// http
//   .get('/data')
//   .then((res) => console.info(res.data))
//   .catch((err) => console.error(err));

// // 2. 回调函数方式
// http.post(
//   '/submit',
//   { name: 'test' },
//   {
//     success: (data) => console.info('提交成功:', data),
//     failed: (err) => console.error('提交失败:', err),
//     complete: () => console.info('请求完成'),
//   },
// );

// // 3. async/await方式
// async function fetchData() {
//   try {
//     const res = await http.get<User[]>('/users');
//     console.info(res.data);
//   } catch (err) {
//     console.error('获取用户失败:', err);
//   }
// }
