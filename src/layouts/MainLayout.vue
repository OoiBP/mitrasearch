<template>
  <q-layout view="hHh lpR fff">
    <q-header reveal>
      <q-toolbar>
        <img src="fv_logo.png" alt="Logo" style="max-width: 150px" />
        <q-toolbar-title class="q-ml-xl">
          Mitrasearch
          <sup style="font-size: 10px"> v{{ meta.version }} </sup> by
          {{ meta.author }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import meta from "../../package.json";

export default defineComponent({
  name: "MainLayout",

  data() {
    return { meta };
  },
});
</script>
