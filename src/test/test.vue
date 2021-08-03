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
      uni.addCard({
        cardList: [],
        url: " ",
        success: (result) => {
          uni.test({});
        },
        fail: () => {},
        complete: () => {},
      });
      uni.test({});
      uni.createCard({
        cardList: [],
        success: (result) => {},
        fail: () => {},
      });
    },
  },
};
</script>
<style lang="scss">
.table {
  align-self: start;
}
</style>
