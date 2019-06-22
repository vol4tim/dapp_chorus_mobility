<template>
  <a
    v-if="text"
    :href="href"
    target="_blank"
    class="white--text font-weight-bold"
    style="text-decoration: none"
  >
    <v-avatar size="40px">
      <img v-if="isIcon" :src="icon()" alt class="elevation-6">
    </v-avatar>
    {{ text.slice(0, 6) + '...' + text.slice(-4) }}
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
