<template>
  <div class="count-flop">
    <div :class="item != '.' ? 'count-flop-box' : 'count-flop-point'" v-for="(item, index) in value" :key="1">
      <div
        v-if="item != '.'"
        class="count-flop-content"
        :class="['rolling_' + item]"
        :style="{ '--deg': lastpostion[index] }"
      >
        <div v-for="(item2, index2) in numberList" :key="index2" class="count-flop-num">
          {{ item2 }}
        </div>
      </div>
      <div v-else class="count-flop-content">.</div>
    </div>
    <div v-if="suffix" class="count-flop-unit">
      {{ suffix }}
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: [],
      lastvalue: 0,
      numberList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      compKey: 0,
      lastpostion: {},
      postionlist: {
        0: '2%',
        1: '-8%',
        2: '-18%',
        3: '-28%',
        4: '-38%',
        5: '-48%',
        6: '-58%',
        7: '-68%',
        8: '-78%',
        9: '-88%',
      },
    };
  },
  props: ['val', 'suffix'],
  watch: {
    val() {
      this.relf(true);
    },
  },
  created() {
    this.relf();
  },
  methods: {
    relf(e) {
      this.value = this.val.toString().split('');
      for (let index = 0; index < this.value.length; index++) {
        const element = this.value[index];
        if (element && element - 1 > 0) {
          this.lastpostion[index] = this.postionlist[element - 1];
        } else {
          this.lastpostion[index] = this.postionlist[this.lastvalue];
        }
      }
      //resh
      if (e) {
        this.compKey += 1;
      }
      this.lastvalue = this.value[this.value.length - 1];
    },
  },
};
</script>
<style>
.count-flop {
  display: inline-block;
  height: 24.5px;
  user-select: none;
}

.count-flop > div {
  position: relative;
  display: inline-block;
  overflow: hidden;
  height: 100%;
  top: 2px;
}

.count-flop-box {
  margin-right: -1px;
  width: 12px;
  border: none;
}
.count-flop-box:last-child {
  margin-right: 0px;
}

.count-flop {
  margin: 0px 3px;
}

.count-flop-content {
  text-align: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  animation-fill-mode: forwards !important;
}

.rolling_0 {
  animation: rolling_0 0.8s ease-in-out;
}

@keyframes rolling_0 {
  from {
    transform: translateY(var(--deg));
  }

  to {
    transform: translateY(2%);
  }
}

.rolling_1 {
  animation: rolling_1 0.8s ease-in-out;
}

@keyframes rolling_1 {
  from {
    transform: translateY(var(--deg));
  }

  to {
    transform: translateY(-8%);
  }
}

.rolling_2 {
  animation: rolling_2 0.8s ease-in-out;
}

@keyframes rolling_2 {
  from {
    transform: translateY(var(--deg));
  }

  to {
    transform: translateY(-18%);
  }
}

.rolling_3 {
  animation: rolling_3 0.8s ease-in-out;
}

@keyframes rolling_3 {
  from {
    transform: translateY(var(--deg));
  }

  to {
    transform: translateY(-28%);
  }
}

.rolling_4 {
  animation: rolling_4 0.8s ease-in-out;
}

@keyframes rolling_4 {
  from {
    transform: translateY(var(--deg));
  }

  to {
    transform: translateY(-38%);
  }
}

.rolling_5 {
  animation: rolling_5 0.8s ease-in-out;
}

@keyframes rolling_5 {
  from {
    transform: translateY(var(--deg));
  }

  to {
    transform: translateY(-48%);
  }
}

.rolling_6 {
  animation: rolling_6 0.8s ease-in-out;
}

@keyframes rolling_6 {
  from {
    transform: translateY(var(--deg));
  }

  to {
    transform: translateY(-58%);
  }
}

.rolling_7 {
  animation: rolling_7 0.8s ease-in-out;
}

@keyframes rolling_7 {
  from {
    transform: translateY(var(--deg));
  }

  to {
    transform: translateY(-68%);
  }
}

.rolling_8 {
  animation: rolling_8 0.8s ease-in-out;
}

@keyframes rolling_8 {
  from {
    transform: translateY(var(--deg));
  }

  to {
    transform: translateY(-78%);
  }
}

.rolling_9 {
  animation: rolling_9 0.8s ease-in-out;
}

@keyframes rolling_9 {
  from {
    transform: translateY(var(--deg));
  }

  to {
    transform: translateY(-88%);
  }
}
</style>
