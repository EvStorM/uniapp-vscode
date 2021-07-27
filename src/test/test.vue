<template lang="html">
  <view class="" hover-class="none" hover-stop-propagation="false">
    <u-grid-item custom-style="{padding: '30rpx 0'}"></u-grid-item>
  </view>
</template>
<script lang="js">
export default {
  data() {
    return {
      list: "",
      l1: "",
    };
  },
  methods: {
    test() {
      uni.addCard({
        cardList: [],
        success: (result) => {},
        fail: () => {},
        complete: () => {},
      });
      uni.add({
      })
      uni.createCard({
        cardList: [],
        success: (result) => {},
        fail: () => {},
        complete: () => {},
      })
    },
  },
};
</script>
<style lang="scss">
.table {
  align-self: start;
}
</style>
