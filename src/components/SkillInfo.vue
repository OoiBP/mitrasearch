<template>
  <div class="radius-bordered q-mb-xs q-pa-xs">
    <div class="row div-bordered-btm">
      <div class="col-3">
        <div class="text-bold">{{ name }}</div>
      </div>
      <div class="col-3 row">
        <div v-if="rowTypeAfterCast == 2">
          <q-icon name="arrow_left" size="sm" />
        </div>
        <div v-else>
          <q-icon name="arrow_right" size="sm" />
        </div>
      </div>
      <div class="col-3 row">
        <div class="q-mr-xs">Cast:</div>
        <div>{{ parseInt(castDuration) / 10 }}s</div>
      </div>
      <div class="col-3 row">
        <div class="q-mr-xs">CD:</div>
        <div>{{ initialCooldown }}-{{ maxCooldown }}s</div>
      </div>
    </div>

    <div>
      <div v-html="display.replace(new RegExp('\n', 'g'), '<br />')"></div>
    </div>
  </div>
</template>

<script>
import { evaluate } from "mathjs";

export default {
  name: "SkillInfo",
  props: {
    name: String,
    rowTypeAfterCast: Number,
    castDuration: String,
    cooldown: String,
    maxLevel: Number,
    display: String,
  },
  computed: {
    initialCooldown: function () {
      const expression = this.cooldown.replace("level", "1");
      return evaluate(expression) / 10;
    },
    maxCooldown: function () {
      const expression = this.cooldown.replace(
        "level",
        this.maxLevel.toString()
      );
      return evaluate(expression) / 10;
    },
  },
};
</script>

<style lang="scss" scoped>
.radius-bordered {
  border: 2px dashed white;
  border-radius: 3px;
}
</style>