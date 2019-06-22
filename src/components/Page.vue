<template>
  <v-flex d-flex lg10 md12>
    <v-layout align-start justify-center row wrap>
      <v-flex d-flex md4 sm12>
        <Driver/>
      </v-flex>
      <v-flex d-flex md4 sm12>
        <Vehicle/>
      </v-flex>
      <v-flex d-flex md4 sm12>
        <Collector/>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import Vehicle from "./Vehicle";
import Driver from "./Driver";
import Collector from "./Collector";

export default {
  components: { Vehicle, Driver, Collector }
};
</script>
