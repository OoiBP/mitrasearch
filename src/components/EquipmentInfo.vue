<template>
  <div>
    <div v-if="loaded">
      <q-card flat square class="outset-bordered" :class="getElementBg">
        <div class="row items-center div-bordered-btm">
          <div class="col-3 q-pl-sm">
            <img :src="imagePath" alt="thumbnail" style="max-width: 50px" />
          </div>
          <div class="col-3">{{ equipment.name }}</div>
          <div class="col-3">Lv. {{ equipment.maxLevelLimit }}</div>
          <div class="col-3 row">
            <div v-for="index in equipment.rarity" :key="index">
              <q-icon name="grade" />
            </div>
          </div>
        </div>

        <div ref="stats">
          <StatInfo :stat="equipment.limitBreakMaxStat" />
        </div>

        <div ref="skill" v-if="skill" class="q-px-sm q-mt-md">
          <SkillInfo
            :name="skill.name"
            :rowTypeAfterCast="skill.rowTypeAfterCast"
            :castDuration="skill.castDuration"
            :cooldown="skill.cooldown"
            :display="skill.display"
          />
          <SkillInfo
            :name="'Dragon - ' + skill.name"
            :rowTypeAfterCast="skill.rowTypeAfterCast"
            :castDuration="skill.enhancedCastDuration"
            :cooldown="skill.enhancedCooldown"
            :display="skill.displayForEnhancement"
          />
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import { db, storage } from "src/boot/firebase";
import { Collection, ElementAffinity } from "src/constant";

import StatInfo from "src/components/StatInfo.vue";
import SkillInfo from "src/components/SkillInfo.vue";

export default {
  name: "EquipmentInfo",
  components: {
    StatInfo,
    SkillInfo,
  },
  props: {
    equipment: Object,
  },
  data() {
    return {
      loaded: false,
      imagePath: "",
      skill: null,
    };
  },
  computed: {
    getElementBg: function () {
      let color = "";
      switch (this.equipment.elementAffinity) {
        case ElementAffinity.fire:
          color = "fire-bg";
          break;
        case ElementAffinity.water:
          color = "water-bg";
          break;
        case ElementAffinity.wind:
          color = "wind-bg";
          break;
        case ElementAffinity.earth:
          color = "earth-bg";
          break;
        case ElementAffinity.light:
          color = "light-bg";
          break;
        case ElementAffinity.dark:
          color = "dark-bg";
          break;

        default:
          break;
      }
      return color;
    },
  },
  mounted: async function () {
    await this.getSkill();
    await this.getEquipmentImage();
    this.loaded = true;
  },
  methods: {
    getEquipmentImage: function () {
      storage
        .ref()
        .child(this.equipment.imagePath + ".png")
        .getDownloadURL()
        .then((url) => {
          this.imagePath = url;
        });
    },
    getSkill: function () {
      db.ref(Collection.CommandSkill)
        .orderByChild("id")
        .equalTo(this.equipment.skillId)
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            const temp = snapshot.val();
            this.skill = temp[this.equipment.skillId];
          } else {
            console.log("No data available");
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.outset-bordered {
  border: 3px outset white;
}
.dark-bg {
  background-color: #8e37e3;
}
.earth-bg {
  background-color: #a48765;
}
.fire-bg {
  background-color: #e24e42;
}
.light-bg {
  background-color: #ffcf3c;
}
.water-bg {
  background-color: #3cb4c7;
}
.wind-bg {
  background-color: #64b23d;
}
</style>