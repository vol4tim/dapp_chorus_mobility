<template>
  <a
    v-if="text"
    :href="href"
    target="_blank"
    class="white--text font-weight-bold"
    style="text-decoration: none"
  >
    <img v-if="isIcon" :src="icon()" alt class="avatar-small align-vertical m-r-10">
    <b class="align-vertical">{{ text.slice(0, 6) + '...' + text.slice(-4) }}</b>
  </a>
</template>

<script>
import makeBlockie from "ethereum-blockies-base64";

export default {
  props: {
    href: {
      type: String
    },
    text: {
      type: String
    },
    isIcon: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    icon() {
      return makeBlockie(this.text);
    }
  }
};
</script>
