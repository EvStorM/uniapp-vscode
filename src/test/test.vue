<!--
 * @Date: 2021-07-19 10:36:33
 * @LastEditors: E'vils
 * @LastEditTime: 2021-07-19 15:16:30
 * @Description: 
 * @FilePath: /test.vue
-->

<template>
  <view class="" hover-class="none" hover-stop-propagation="false">
    <video
      class=""
      src=""
      initial-time="0"
      autoplay="false"
      loop="false"
      muted="false"
      direction="0"
      @play="test"
      @pause="test"
      @ended="test"
      @timeupdate="test"
      @waiting="test"
      @error="test"
    ></video>
  </view>
</template>
<script lang="ts">
export default {
  data() {
    return {};
  },
  methods: {
    test() {},
  },
};
</script>
<style lang=""></style>
