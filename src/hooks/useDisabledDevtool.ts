import { ref } from 'vue';
import disableDevtool from '@wesley-0808/disable-devtool';
import { isDevMode } from '@/utils/common';

export function useDisabledDevtool() {
  const detected = ref(false);
  let started = false;

  const start = () => {
    if (isDevMode()) return;
    detected.value = disableDevtool.isDevToolOpened();
    console.info('Devtool检测已启动，当前状态：', detected.value ? '已打开' : '未打开');

    if (started) return;

    started = true;

    disableDevtool({
      detectors: [
        disableDevtool.DetectorType.RegToString,
        disableDevtool.DetectorType.DefineId,
        disableDevtool.DetectorType.DateToString,
        disableDevtool.DetectorType.FuncToString,
        disableDevtool.DetectorType.Performance,
        disableDevtool.DetectorType.DebugLib,
        disableDevtool.DetectorType.Debugger,
      ],
      disableMenu: false,
      disableF12: false,
      clearLog: true,
      clearIntervalWhenDevOpenTrigger: true,
      onDevtoolOpen() {
        detected.value = true;
      },
      onDevtoolClose() {
        detected.value = false;
      },
    });
  };

  const stop = () => {
    disableDevtool.stop();
    started = false;
    detected.value = false;
    console.info('Devtool检测已停止');
  };

  return {
    detected,
    start,
    stop,
  };
}
