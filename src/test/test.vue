<!--
 * @Date: 2021-07-19 10:36:33
 * @LastEditors: E'vils
 * @LastEditTime: 2021-07-20 18:09:30
 * @Description: 
 * @FilePath: /src/test/test.vue
-->

<template>
  <view class="" hover-class="none" hover-stop-propagation="false">
    <image
      class=""
      src=""
      mode="heightFix"
      lazy-load="false"
      @error="test"
      @load="test"
    >
    </image>
    <button
      class="default"
      size="default"
      type="default"
      plain="default"
      disabled="false"
      loading="false"
      hover-class="button-hover"
      hover-stop-propagation="false"
      form-type="submit|reset"
      open-type="openSetting"
    ></button>
  </view>
</template>
<script lang="ts">
export default {
  data() {
    return {
      alist: "",
    };
  },
  methods: {
    test() {},
  },
};
</script>
<style lang="scss">
.table {
  align-self: start;
}
</style>
