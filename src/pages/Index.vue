<template>
  <q-page padding class="bg-dark">
    <div v-if="loaded">
      <q-form class="div-bordered" @submit.prevent="">
        <q-list dense class="flex div-bordered-btm">
          <q-item
            v-for="item in weaponTypeOptions"
            :key="item.id"
            tag="weapon"
            v-ripple
            dense
          >
            <q-item-section>
              <q-radio
                dark
                v-model="weaponType"
                :val="item.id"
                color="primary"
                :disable="searched"
              />
            </q-item-section>
            <q-item-section>
              <img
                :src="`weaponIcons/${item.name}.png`"
                :alt="item.name"
                style="max-width: 30px"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <q-list dense class="flex div-bordered-btm">
          <q-item
            v-for="item in elementTypeOptions"
            :key="item.id"
            tag="element"
            v-ripple
            dense
          >
            <q-item-section>
              <q-radio
                dark
                v-model="elementType"
                :val="item.id"
                color="primary"
                :disable="searched"
              />
            </q-item-section>
            <q-item-section>
              <img
                :src="`attributeIcons/${item.name}.png`"
                :alt="item.name"
                style="max-width: 30px"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <div class="row items-center q-pa-sm">
          <div class="col-8 col-md-6">
            <q-input dark dense filled v-model="searchText" label="Search" />
          </div>
          <div class="col-grow q-pl-md">
            <q-btn
              dense
              label="Search"
              color="positive"
              size="sm"
              :disable="searchText.length <= 0"
              @click="onSearch"
            />
            <q-btn
              dense
              label="Reset"
              color="negative"
              size="sm"
              class="q-ml-sm"
              @click="onReset"
            />
          </div>
        </div>
      </q-form>

      <div v-if="ready" class="q-px-none q-px-md-xl q-mt-md">
        <div
          v-if="
            filteredEquipmentList &&
            Object.keys(filteredEquipmentList).length !== 0
          "
        >
          <div
            v-for="item in filteredEquipmentList"
            :key="item.id"
            class="q-px-none q-px-md-xl"
          >
            <EquipmentInfo :equipment="item" class="q-mb-sm" />
          </div>
        </div>
        <div v-else>
          <div class="row justify-center text-center text-white">
            No item matches
          </div>
        </div>
      </div>

      <div v-else>
        <CircularProgress />
      </div>

      <q-page-scroller
        position="bottom-right"
        :scroll-offset="150"
        :offset="[18, 18]"
      >
        <q-btn fab glossy icon="keyboard_arrow_up" color="grey" padding="sm" />
      </q-page-scroller>
    </div>

    <div v-else>
      <CircularProgress />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { db } from "src/boot/firebase";
import { Collection, ElementAffinity } from "src/constant";
import EquipmentInfo from "src/components/EquipmentInfo.vue";
import CircularProgress from "src/components/CircularProgress.vue";

export default defineComponent({
  name: "PageIndex",
  components: {
    EquipmentInfo,
    CircularProgress,
  },
  data() {
    return {
      loaded: false,
      ready: true,
      weaponType: null,
      weaponTypeOptions: [],
      elementType: 0,
      searchText: "",
      searched: false,
      equipmentList: {},
    };
  },
  computed: {
    elementTypeOptions: function () {
      const arr = [
        {
          id: 0,
          name: "all",
        },
      ]; // Add first item to search all elements

      for (const key in ElementAffinity) {
        arr.push({
          id: ElementAffinity[key],
          name: key,
        });
      }
      return arr;
    },
    filteredEquipmentList: function () {
      // Check if the user selected any element other than all
      if (this.elementType) {
        const result = {};
        for (const key in this.equipmentList) {
          if (
            this.equipmentList.hasOwnProperty(key) &&
            this.equipmentList[key].elementAffinity === this.elementType
          ) {
            result[key] = this.equipmentList[key];
          }
        }
        return result;
      }

      // No filter selected, return full list
      return this.equipmentList;
    },
  },
  watch: {
    weaponType: function () {
      if (!this.weaponType) return;
      this.getEquipmentById(this.weaponType);
    },
  },
  mounted: function () {
    this.getWeaponType();
  },
  methods: {
    getWeaponType: function () {
      db.ref(Collection.WeaponType)
        .orderByChild("id")
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.weaponTypeOptions = snapshot.val();
            this.weaponTypeOptions.shift(); // Remove first empty data
            this.loaded = true;
          } else {
            console.log("No data available");
          }
        });
    },
    getEquipmentById: function (id) {
      this.ready = false;
      db.ref(Collection.EquipmentItem)
        .orderByChild("typeId")
        .equalTo(id)
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.equipmentList = snapshot.val();
          } else {
            this.equipmentList = {};
            console.log("No data available");
          }
          this.ready = true;
        });
    },
    onSearch: function () {
      this.ready = false;
      this.weaponType = null;
      this.elementType = 0;
      this.equipmentList = {};

      db.ref(Collection.EquipmentItem)
        .orderByChild("name")
        .startAt(this.searchText)
        .endAt(this.searchText + "\uf8ff")
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            const bundle = snapshot.val();

            // Filter weapon only
            for (const key in bundle) {
              if (
                bundle.hasOwnProperty(key) &&
                bundle[key].typeId > 0 &&
                bundle[key].typeId <= 12
              ) {
                this.equipmentList[key] = bundle[key];
              }
            }

            // Set this to disable filters
            this.searched = true;
          } else {
            this.equipmentList = {};
            console.log("No data available");
          }
          this.ready = true;
        });
    },
    onReset: function () {
      this.weaponType = null;
      this.elementType = 0;
      this.searchText = "";
      this.searched = false;
      this.equipmentList = {};
    },
  },
});
</script>

<style lang="scss">
.div-bordered {
  border: 1px solid white;
}
.div-bordered-btm {
  border-bottom: 1px solid white;
}
</style>