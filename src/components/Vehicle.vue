<template>
  <fragment>
    <section class="top-panel m-t-0">
      <img class="i-block" alt src="assets/i/car.jpg">
      <div class="top-panel--content">
        <div class="t-sm">
          <IconLink
            v-if="vehicle!=''"
            :href="`https://etherscan.io/address/${vehicle}`"
            :text="vehicle"
            :isIcon="false"
          />
        </div>
        <div class="t-lg">
          <b>{{ balance | fromWei(9, 'XRT') }}</b>
        </div>
      </div>
      <Controls v-if="!result"/>
    </section>
    <div v-if="!result" class="section-light">
      <section class="m-t-0">
        <p>
          <input v-model="amount" class="container-full" type="text">
        </p>
        <p>
          <button
            v-if="$wait.is([actionForm, actionTx])"
            class="container-full"
            disabled
          >Top up balance of Vehicle</button>
          <button v-else @click="submit" class="container-full">Top up balance of Vehicle</button>
        </p>
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
      </section>
      <section>
        <p>
          <button @click="lock" :disabled="isLoading" class="btn-red container-full">
            <span class="m-r-10 i-lock"></span>
            <span>Lock car and exit</span>
          </button>
        </p>
      </section>
      <section class="m-b-0">
        <a
          href="javascript:;"
          style="border-bottom: 1px dashed #03A5ED"
          @click="show"
        >SMART CONTRACT DETAILS</a>
        <div v-show="isShow">
          <section>
            <p>
              <span>Vehicle's address:</span>
              <br>
              <IconLink
                v-if="this.vehicle!=''"
                :href="`https://etherscan.io/address/${this.vehicle}`"
                :text="this.vehicle"
              />
            </p>
            <hr>
            <p>
              <span>Your address:</span>
              <br>
              <IconLink
                v-if="this.account!=''"
                :href="`https://etherscan.io/address/${this.account}`"
                :text="this.account"
              />
            </p>
            <hr>
            <p>
              <span>Smart Contract:</span>
              <br>
              <IconLink
                v-if="this.liability!=''"
                :href="`https://etherscan.io/address/${this.liability}`"
                :text="this.liability"
              />
            </p>
          </section>
        </div>
      </section>
    </div>
  </fragment>
</template>

<script>
import { mapState } from "vuex";
import Controls from "./Controls";
import { VEHICLE, CONTROLS } from "../config";
import { toWei } from "../utils/utils";

export default {
  components: { Controls },
  data() {
    return {
      vehicle: VEHICLE,
      account: "",
      actionForm: "",
      actionTx: "",
      tx: "",
      error: "",
      amount: 0.0001,
      info: {},
      isShow: false,
      isLoading: false
    };
  },
  computed: {
    ...mapState("data", ["liability", "result"]),
    balance() {
      return this.$store.getters["token/balance"](VEHICLE);
    }
  },
  mounted() {
    this.account = this.$robonomics.account.address;
  },
  methods: {
    lock() {
      this.isLoading = true;
      this.$robonomics.web3.eth.getBlock("latest", (e, r) => {
        const demand = {
          model: CONTROLS.model,
          objective: CONTROLS.actions.lock,
          token: this.$robonomics.xrt.address,
          cost: 0,
          lighthouse: this.$robonomics.lighthouse.address,
          validator: "0x0000000000000000000000000000000000000000",
          validatorFee: 0,
          deadline: r.number + 1000
        };
        this.$robonomics
          .sendDemand(demand, false, () => {
            this.isLoading = false;
          })
          .catch(() => {
            this.isLoading = false;
          });
      });
    },
    show() {
      console.log("sdf");
      this.isShow = !this.isShow;
    },
    submit() {
      this.error = "";
      const value = Number(toWei(this.amount, 9));
      if (value <= this.balance) {
        this.transfer();
      } else {
        this.error = "Не достаточно средств";
      }
      return false;
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
        .then(() => {
          this.actionTx = "";
          this.$wait.end(this.actionForm);
          this.$wait.end(this.actionTx);
        })
        .catch(() => {
          this.$wait.end(this.actionForm);
        });
    }
  }
};
</script>
