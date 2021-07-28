<template>
  <div>
    <div class="row div-bordered-btm q-px-sm">
      <div class="col-3 row">
        <div class="q-mr-xs">HP:</div>
        <div>{{ stat.maxHitPoint }}</div>
      </div>
      <div class="col-3 row">
        <div class="q-mr-xs">PATK:</div>
        <div>{{ stat.physicalPower }}</div>
      </div>
      <div class="col-3 row">
        <div class="q-mr-xs">PDEF:</div>
        <div>{{ stat.physicalResist }}</div>
      </div>
      <div class="col-3 row">
        <div class="q-mr-xs">Accuracy:</div>
        <div>{{ stat.hitRating }}</div>
      </div>
    </div>

    <div class="row div-bordered-btm q-px-sm">
      <div class="col-3 row">
        <div class="q-mr-xs">Crit:</div>
        <div>{{ stat.critChance }}</div>
      </div>
      <div class="col-3 row">
        <div class="q-mr-xs">MATK:</div>
        <div>{{ stat.spellPower }}</div>
      </div>
      <div class="col-3 row">
        <div class="q-mr-xs">MDEF:</div>
        <div>{{ stat.spellResist }}</div>
      </div>
      <div class="col-3 row">
        <div class="q-mr-xs">Evasion:</div>
        <div>{{ stat.evasionRating }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SkillInfo",
  props: {
    stat: Object,
  },
};
</script>

<style>
</style>