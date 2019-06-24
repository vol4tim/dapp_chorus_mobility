<template>
  <div class="section-light" style="max-width:400px">
    <section class="disabled m-t-0">
      <img class="i-block" alt src="assets/i/car.jpg">
    </section>
    <section>
      <h3>Unmanned vehicle</h3>
    </section>
    <section>
      <div class="d-table container-full">
        <div class="d-table--cell">Vehicle cost:</div>
        <div class="d-table--cell t-align--right">
          <span class="t-sm">XRT</span>
          <span class="input-size--sm m-l-10 t-align--right">{{ price | fromWei(9) }}</span>
        </div>
      </div>
      <hr>
      <div class="d-table container-full">
        <div class="d-table--cell">Deposit for toll collections:</div>
        <div class="d-table--cell t-align--right">
          <span class="t-sm">XRT</span>
          <input v-model="amount" class="input-size--sm m-l-10 t-align--right" type="text">
        </div>
      </div>
      <hr>
      <div class="d-table container-full">
        <div class="d-table--cell">Total:</div>
        <div class="d-table--cell t-align--right">
          <span class="t-sm">XRT</span>
          <span class="t-lg">{{ full | fromWei(9) }}</span>
        </div>
      </div>
    </section>
    <button v-if="$wait.is([actionForm, actionTx])" class="container-full" disabled>
      <span class="loader-ring m-r-10"></span>
      <span>Unlocking car</span>
    </button>
    <button v-else @click="submit" class="container-full">
      <span class="m-r-10 i-unlock"></span>
      <span>Unlock car and gain access</span>
    </button>
    <div
      v-if="$wait.is([actionForm, actionTx]) && actionTx"
      class="response response-wait t-align--center"
    >
      Wait for
      <a
        :href="`https://etherscan.io/tx/${actionTx.replace('tx.', '')}`"
        target="_blank"
      >transaction</a>
    </div>
    <!-- <div>
      <b>Balance:</b>
      {{ balance | fromWei(9, 'XRT') }}
      <template v-if="price > 0">
        <br>
        <b>Approved:</b>
        {{ approveTrade | fromWei(9, 'XRT') }}
      </template>
    </div>-->
    {{error}}
  </div>
</template>

<script>
import { COLLECTOR, VEHICLE } from "../config";
import { toWei } from "../utils/utils";

export default {
  data() {
    return {
      actionForm: "",
      actionTx: "",
      tx: "",
      error: "",
      amount: 0.0001,

      account: "",
      price: COLLECTOR.price
    };
  },
  computed: {
    balance() {
      return this.$store.getters["token/balance"](this.account);
    },
    approveTrade() {
      return this.$store.getters["token/approve"](
        this.account,
        this.$robonomics.factory.address
      );
    },
    full() {
      return Number(this.price) + Number(toWei(this.amount, 9));
    }
  },
  mounted() {
    this.account = this.$robonomics.account.address;
    this.$robonomics.onDemand(COLLECTOR.model, msg => {
      console.log("demand", msg);
    });
    this.$robonomics.onOffer(COLLECTOR.model, msg => {
      console.log("offer", msg);
    });
  },
  methods: {
    submit() {
      this.error = "";
      const value = Number(toWei(this.amount, 9));
      const full = value + this.price;
      if (full <= this.balance) {
        if (this.price > this.approveTrade) {
          this.approve();
        } else {
          this.transfer();
        }
      } else {
        this.error = "Не достаточно средств";
      }
      return false;
    },
    approve() {
      this.actionForm = "approve.xrt";
      this.$wait.start(this.actionForm);
      this.actionTx = "";
      return this.$robonomics.xrt.send
        .approve(
          this.$robonomics.factory.address,
          this.price,
          { from: this.$robonomics.account.address },
          (e, r) => {
            if (e) {
              return;
            }
            this.$wait.end(this.actionForm);
            this.tx = r;
            this.actionTx = "tx." + this.tx;
            this.$wait.start(this.actionTx);
          }
        )
        .then(() => this.transfer())
        .catch(() => {
          this.$wait.end(this.actionForm);
        });
    },
    transfer() {
      const value = Number(toWei(this.amount, 9));
      if (value === 0) {
        return this.order();
      }
      this.actionForm = "transfer.xrt";
      this.$wait.start(this.actionForm);
      this.actionTx = "";
      return this.$robonomics.xrt.send
        .transfer(
          VEHICLE,
          value,
          { from: this.$robonomics.account.address },
          (e, r) => {
            if (e) {
              return;
            }
            this.$wait.end(this.actionForm);
            this.tx = r;
            this.actionTx = "tx." + this.tx;
            this.$wait.start(this.actionTx);
          }
        )
        .then(() => this.order())
        .catch(() => {
          this.$wait.end(this.actionForm);
        });
    },
    order() {
      this.$wait.end(this.actionTx);
      this.actionTx = "";
      this.actionForm = "order";
      this.$wait.start(this.actionForm);
      this.$robonomics.web3.eth.getBlock("latest", (e, r) => {
        const demand = {
          model: COLLECTOR.model,
          objective: COLLECTOR.objective,
          token: this.$robonomics.xrt.address,
          cost: this.price,
          lighthouse: this.$robonomics.lighthouse.address,
          validator: "0x0000000000000000000000000000000000000000",
          validatorFee: 0,
          deadline: r.number + 1000
        };
        const intervals = {};
        this.$robonomics
          .sendDemand(demand, true, msg => {
            intervals[msg.getHash()] = setInterval(() => {
              this.$robonomics.messenger.channel.send(msg.encode());
            }, 5000);
          })
          .then(liability => {
            console.log("liability demand", liability.address);
            liability.getInfo().then(info => {
              clearInterval(intervals[info.demandHash]);
              this.$store.commit("data/showControls", true);
              this.$store.commit("data/liability", liability.address);
              this.$wait.end(this.actionForm);
              liability.onResult().then(result => {
                console.log(result);
                this.$store.commit("data/showControls", false);
                this.$store.commit("data/result", true);
              });
            });
          })
          .catch(() => {
            this.$wait.end(this.actionForm);
          });
      });
    }
  }
};
</script>
