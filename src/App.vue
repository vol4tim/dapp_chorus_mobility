<template>
  <v-app dark>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-title>Vehicle access demo</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <web3-check>
        <template v-slot:error="props">
          <v-container fluid grid-list-md>
            <v-layout justify-center align-center>
              <Error :message="props.error.message"/>
            </v-layout>
          </v-container>
        </template>
        <template slot="load">
          <v-container fluid grid-list-md>
            <v-layout justify-center align-center>
              <Load/>
            </v-layout>
          </v-container>
        </template>
        <v-container fluid grid-list-md>
          <v-layout justify-center align-center>
            <router-view v-if="ready"/>
            <div v-else>Initialization Robonomics</div>
          </v-layout>
        </v-container>
      </web3-check>
    </v-content>
  </v-app>
</template>

<script>
import Vue from "vue";
import Web3Check, { components } from "vue-web3-check";
import { initRobonomics } from "./utils/robonomics";
import getIpfs from "./utils/ipfs";
import { COLLECTOR } from "./config";

export default {
  name: "app",
  components: {
    Error: components.Web3Check.components.Error,
    Load: components.Web3Check.components.Load
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
          this.$store.dispatch("token/watch", this.$robonomics.xrt);
        });
      });
    });
  }
};
</script>
