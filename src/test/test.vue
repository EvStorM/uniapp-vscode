<!--
 * @Date: 2021-07-19 10:36:33
 * @LastEditors: E'vils
 * @LastEditTime: 2021-07-23 11:12:11
 * @Description: 
 * @FilePath: /src/test/test.vue
-->
<template lang="wxml">
  <view class="" hover-class="none" hover-stop-propagation="false">
    <u-popup duration="250" closeable="false" @open="" :mode="left"></u-popup>
  </view>
</template>
<script lang="ts">
export default {
  data() {
    return {
      list: "",
      l1: "",
    };
  },
  methods: {},
};
</script>
<style lang="scss">
.table {
  align-self: start;
}
</style>
