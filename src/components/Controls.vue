<template>
  <div class="t-align--center" id="controlpanel" v-if="Object.keys(actions).length === 6">
    <div>
      <button class="btn-green" :disabled="actions.up.loading" @click="move('up')">&#8593;</button>
    </div>
    <div>
      <button class="btn-green" :disabled="actions.left.loading" @click="move('left')">&#8592;</button>
      <button
        class="btn-orange"
        title="stop"
        :disabled="actions.stop.loading"
        @click="move('stop')"
      >
        <span class="i-powerbtn"></span>
      </button>
      <button class="btn-green" :disabled="actions.right.loading" @click="move('right')">&#8594;</button>
    </div>
    <div>
      <button class="btn-green" :disabled="actions.down.loading" @click="move('down')">&#8595;</button>
    </div>
  </div>
  <!-- <div style="margin: 10px 0">
      <h2>Logs</h2>
      <div style="border: 1px solid #6b6060; height: 200px; overflow-y: scroll;">
        <ol>
          <li
            v-for="(log, i) in logs"
            :key="i"
            style="padding: 5px;color:#424242;"
            :style="{ backgroundColor: (log.type === 1) ? '#E0E0E0' : '#eeeeee' }"
          >{{log.msg}}</li>
        </ol>
      </div>
  </div>-->
</template>

<script>
import Vue from "vue";
import { CONTROLS } from "../config";

export default {
  data() {
    return {
      model: CONTROLS.model,
      actions: {},
      logs: []
    };
  },
  mounted() {
    Object.keys(CONTROLS.actions).forEach(dir => {
      Vue.set(this.actions, dir, {
        loading: false,
        objective: CONTROLS.actions[dir]
      });
    });
    this.$robonomics.onResult(msg => {
      console.log("result", msg);
      if (
        this.$robonomics.web3.toChecksumAddress(msg.liability) ===
        this.$robonomics.web3.toChecksumAddress(
          this.$robonomics.account.address
        )
      ) {
        this.setResult(msg.result);
      }
    });
  },
  methods: {
    move(dir) {
      this.actions[dir].loading = true;
      this.$robonomics.web3.eth.getBlock("latest", (e, r) => {
        const demand = {
          model: this.model,
          objective: this.actions[dir].objective,
          token: this.$robonomics.xrt.address,
          cost: 0,
          lighthouse: this.$robonomics.lighthouse.address,
          validator: "0x0000000000000000000000000000000000000000",
          validatorFee: 0,
          deadline: r.number + 1000
        };
        this.$robonomics
          .sendDemand(demand, false, () => {
            this.actions[dir].loading = false;
            this.logs.push({
              type: 1,
              msg: `Run action "${dir}"`
            });
          })
          .catch(() => {
            this.actions[dir].loading = false;
          });
      });
    },
    setResult(result) {
      console.log(result);
      // let actionId = 0
      // let actionStatus = false
      // ipfsCat(result)
      //   .then((r) => {
      //     return rosBag(new Blob([r]), (bag) => {
      //       if (bag.topic === '/agent/objective/id_serial') {
      //         if (bag.message.data === 'test') {
      //           actionId = 1
      //         }
      //       } else if (bag.topic === '/agent/objective/drone_type') {
      //         if (bag.message.data === 'ddd') {
      //           actionStatus = true
      //         }
      //       }
      //     }, {})
      //   })
      //   .then(() => {
      //     if (_has(this.actions, actionId)) {
      //       if (actionStatus) {
      //         this.logs.push({
      //           type: 2,
      //           msg: `Done action "${this.actions[actionId].name}"`
      //         })
      //       } else {
      //         this.logs.push({
      //           type: 2,
      //           msg: `Not done action "${this.actions[actionId].name}"`
      //         })
      //       }
      //     }
      //   })
    }
  }
};
</script>
