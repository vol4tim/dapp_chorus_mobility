<template>
  <v-card class="mx-auto" color="blue-grey lighten-2" dark>
    <v-card-title>
      <v-icon large left>fa-road</v-icon>
      <span class="title font-weight-light">Collector</span>
    </v-card-title>

    <v-card-text>
      <b>Balance:</b>
      {{ balance | fromWei(9, 'XRT') }}
    </v-card-text>

    <v-card-actions>
      <v-layout align-start justify-space-between row fill-height>
        <v-flex md6>
          <IconLink
            v-if="address!=''"
            :href="`https://etherscan.io/address/${address}`"
            :text="address"
          />
        </v-flex>
        <v-flex md6 class="text-xs-right">
          <v-icon large left v-if="isShowControls">fa-lock-open-alt</v-icon>
          <v-icon large left v-else>fa-lock</v-icon>
        </v-flex>
      </v-layout>
    </v-card-actions>
  </v-card>
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
    ...mapState("data", ["isShowControls"]),
    balance() {
      return this.$store.getters["token/balance"](COLLECTOR.address);
    }
  }
};
</script>
