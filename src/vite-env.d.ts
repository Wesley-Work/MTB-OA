/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

import React from 'react';
import { ComponentOptions, Component } from 'vue';

declare module '*.md' {
  const attributes: Record<string, unknown>;
  const toc: { level: string; content: string }[];
  const html: string;
  const raw: string;
  const ReactComponent: React.VFC;
  const VueComponent: ComponentOptions;
  const VueComponentWith: (components: Record<string, Component>) => ComponentOptions;

  export { attributes, toc, html, ReactComponent, VueComponent, VueComponentWith };
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      [emit: string]: any;
    }
  }
}
