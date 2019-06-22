<template>
  <v-card class="mx-auto" color="#26c6da" dark>
    <v-card-title>
      <v-icon large left>fa-id-card</v-icon>
      <span class="title font-weight-light">Driver</span>
    </v-card-title>

    <v-card-text>
      <b>Balance:</b>
      {{ balance | fromWei(9, 'XRT') }}
      <template v-if="price > 0">
        <br>
        <b>Approved:</b>
        {{ approveTrade | fromWei(9, 'XRT') }}
      </template>
    </v-card-text>

    <v-card-actions>
      <v-layout align-start justify-space-between row fill-height>
        <v-flex md6>
          <IconLink
            v-if="account!=''"
            :href="`https://etherscan.io/address/${account}`"
            :text="account"
          />
        </v-flex>
        <v-flex v-if="!isShowControls" md6 class="text-xs-right">
          <v-btn
            color="light-blue darken-3"
            v-if="price > 0 && approveTrade < price"
            :disabled="loadingApprove || balance < price"
            @click="approve"
          >Approve</v-btn>

          <v-btn color="light-blue darken-3" v-if="approveTrade >= price" @click="order">Order</v-btn>
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
      account: "",
      price: COLLECTOR.price,
      token: "",
      // approveTrade: 0,
      loadingApprove: false
    };
  },
  computed: {
    ...mapState("data", ["isShowControls"]),
    balance() {
      return this.$store.getters["token/balance"](this.account);
    },
    approveTrade() {
      return this.$store.getters["token/approve"](
        this.account,
        this.$robonomics.factory.address
      );
    }
  },
  mounted() {
    this.account = this.$robonomics.account.address;
    this.token = this.$robonomics.xrt.address;
    this.$robonomics.onDemand(COLLECTOR.model, msg => {
      console.log("demand", msg);
    });
    this.$robonomics.onOffer(COLLECTOR.model, msg => {
      console.log("offer", msg);
    });
    // this.fetchBalance();
  },
  methods: {
    // fetchBalance() {
    //   return this.$robonomics.xrt.call
    //     .balanceOf(this.$robonomics.account.address)
    //     .then(balanceOf => {
    //       this.balance = balanceOf;
    //       if (balanceOf > 0) {
    //         return this.$robonomics.xrt.call.allowance(
    //           this.$robonomics.account.address,
    //           this.$robonomics.factory.address
    //         );
    //       }
    //       return false;
    //     })
    //     .then(allowance => {
    //       if (allowance) {
    //         this.approveTrade = allowance;
    //       }
    //     });
    // },
    approve() {
      this.loadingApprove = true;
      return this.$robonomics.xrt.send
        .approve(this.$robonomics.factory.address, COLLECTOR.price, {
          from: this.$robonomics.account.address
        })
        .then(() => {
          this.loadingApprove = false;
          return this.fetchBalance();
        })
        .catch(() => {
          this.loadingApprove = false;
        });
    },
    order() {
      this.$robonomics.web3.eth.getBlock("latest", (e, r) => {
        const demand = {
          model: COLLECTOR.model,
          objective: COLLECTOR.objective,
          token: this.$robonomics.xrt.address,
          cost: COLLECTOR.price,
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
              liability.onResult().then(result => {
                console.log(result);
                this.$store.commit("data/showControls", false);
              });
            });
          });
      });
    }
  }
};
</script>
