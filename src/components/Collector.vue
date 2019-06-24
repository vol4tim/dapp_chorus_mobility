<template>
  <section class="m-t-0 top-panel">
    <img class="i-block" alt src="assets/i/cam-0-2.jpg">
    <div class="top-panel--content">
      <div class="t-sm">
        <IconLink
          v-if="address!=''"
          :href="`https://etherscan.io/address/${address}`"
          :text="address"
          :isIcon="false"
        />
      </div>
      <div class="t-lg t-color-green">
        <b>{{ balance | fromWei(9, 'XRT') }}</b>
      </div>
    </div>
    <div id="paid" v-if="result">
      <div>TOLL COLLECTION PAID</div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import { COLLECTOR } from "../config";

export default {
  data() {
    return {
      address: COLLECTOR.address
    };
  },
  computed: {
    ...mapState("data", ["result"]),
    balance() {
      return this.$store.getters["token/balance"](COLLECTOR.address);
    }
  }
};
</script>
