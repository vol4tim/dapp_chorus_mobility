<template>
  <v-card class="mx-auto" color="teal lighten-2" dark>
    <v-card-title>
      <v-icon large left>fa-car</v-icon>
      <span class="title font-weight-light">Vehicle</span>
    </v-card-title>

    <v-card-text>
      <Controls v-if="isShowControls"/>
      <v-alert :value="true" icon="fa-times" type="error" v-else>No controls</v-alert>
    </v-card-text>

    <v-card-actions>
      <IconLink
        v-if="address!=''"
        :href="`https://etherscan.io/address/${address}`"
        :text="address"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import Controls from "./Controls";
import { VEHICLE } from "../config";

export default {
  components: { Controls },
  data() {
    return {
      address: VEHICLE
    };
  },
  computed: {
    ...mapState("data", ["isShowControls"])
  }
};
</script>
