<template lang="html">
  <view hover-class="none" hover-stop-propagation="false"> </view>
  <u-icon></u-icon>
</template>
<script>
export default {
  data() {
    return {
      list: "",
      l1: "",
    };
  },
  methods: {
    test() {
      uni.getBLEDeviceServices({});
      uni.navigateTo({});
    },
  },
};
</script>
<style lang="scss">
.table {
  align-self: start;
}
</style>
