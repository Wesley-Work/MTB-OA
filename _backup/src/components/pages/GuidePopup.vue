<template>
    <div class="t-guide__tooltip">
        <div class="t-guide__title">{{ title }}</div>
        <div class="t-guide__desc">{{ description }}</div>
        <div class="t-guide__footer t-guide__footer--popup">
            <div class="t-guide__counter">{{ current+1 }}/{{ total }}</div>
            <div class="t-guide__action">
                <t-button theme="default" size="small" @click="handleSkip"> 跳过 </t-button>
                <t-button v-if="current !== 0" theme="default" size="small" @click="handleP"> 上一步 </t-button>
                <t-button v-if="current + 1 < total" theme="primary" size="small" @click="handleN"> 下一步 </t-button>
                <t-button v-if="current + 1 === total" theme="primary" size="small" @click="handleFinish"> 完成 </t-button>
            </div>
        </div>
    </div>
    <div class="t-popup__arrow"></div>
</template>r
<script setup>
const props = defineProps({
    handlePrev: Function,
    handleNext: Function,
    handleSkip: Function,
    handleFinish: Function,
    current: Number,
    total: Number,
    title: String,
    description: String,
    placement: String,
});

const handleN = () => {
    handleChange('next')
}

const handleP = () => {
    handleChange('prev')
}

const handleChange = (from) => {
    if (props.current == 4){
        setTimeout(() => {
            if (from == 'next') {
                props.handleNext()
            }
            else{
                props.handlePrev()
            }
        }, 600);
    }
    else{
        if (from == 'next') {
            props.handleNext()
        }
        else{
            props.handlePrev()
        }
    }
}
</script>

<style>
.t-guide__popup .t-guide__popup--content{
    background: var(--td-bg-color-container) !important;
    box-shadow: var(--td-shadow-2), var(--td-shadow-inset-top), var(--td-shadow-inset-right), var(--td-shadow-inset-bottom), var(--td-shadow-inset-left) !important;
    padding: var(--td-comp-paddingTB-xs) var(--td-comp-paddingLR-s) !important;
}

</style>