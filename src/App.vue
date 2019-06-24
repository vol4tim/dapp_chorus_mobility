<template>
  <web3-check>
    <template v-slot:error="props">
      <div class="content flexcenter">
        <Error :message="props.error.message"/>
      </div>
    </template>
    <template slot="load">
      <div class="content flexcenter">
        <div class="loader-ring lg"></div>
      </div>
    </template>
    <fragment>
      <router-view v-if="ready"/>
      <div v-else class="content flexcenter">
        <div class="loader-ring lg"></div>
      </div>
    </fragment>
  </web3-check>
</template>

<script>
import Vue from "vue";
import Web3Check, { components } from "vue-web3-check";
import { initRobonomics } from "./utils/robonomics";
import getIpfs from "./utils/ipfs";
import { COLLECTOR, VEHICLE } from "./config";

export default {
  name: "app",
  components: {
    Error: components.Web3Check.components.Error
  },
  data() {
    return {
      ready: false
    };
  },
  mounted() {
    Web3Check.store.on("load", () => {
      getIpfs().then(ipfs => {
        Vue.prototype.$robonomics = initRobonomics(ipfs);
        this.$robonomics.ready().then(() => {
          this.ready = true;

          this.$store.commit(
            "token/watchBalance",
            this.$robonomics.account.address
          );
          this.$store.commit("token/watchApprove", {
            account: this.$robonomics.account.address,
            to: this.$robonomics.factory.address
          });
          this.$store.commit("token/watchBalance", COLLECTOR.address);
          this.$store.commit("token/watchBalance", VEHICLE);
          this.$store.dispatch("token/watch", this.$robonomics.xrt);
        });
      });
    });
  }
};
</script>
