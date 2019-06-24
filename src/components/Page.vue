<template>
  <div class="content">
    <div class="content-in">
      <section>
        <h1>Vehicle Access Demo</h1>
      </section>
      <div class="row">
        <div class="col-md-6">
          <Vehicle v-if="liability"/>
          <Driver v-else/>
        </div>
        <div class="col-md-6">
          <Collector v-if="liability"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Vehicle from "./Vehicle";
import Driver from "./Driver";
import Collector from "./Collector";

export default {
  components: { Vehicle, Driver, Collector },
  computed: {
    ...mapState("data", ["liability"])
  }
};
</script>
