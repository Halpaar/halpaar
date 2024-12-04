<script setup>
import { onMounted, ref } from 'vue';
import { loadItems, loadMonsterEncounters, loadSkills } from './assets/data_load';

const items = ref(null);
const monsterEncounters = ref(null);
const skills = ref(null);

onMounted(async () => {
  items.value = await loadItems();
  console.log("Items loaded");
});
onMounted(async () => {
  monsterEncounters.value = await loadMonsterEncounters();
  console.log("Monster encounters loaded");
});
onMounted(async () => {
  skills.value = await loadSkills();
  console.log("Skills loaded");
});

// Initialise tabbing
const tab = ref(1);

</script>

<style>
    .divider-top {
        border-width: 2px;
        margin: -8px 0 5px 0px;
    }

    .divider-mid {
        border-width: 1.5px;
        margin: 5px 0 5px 0px;
    }

    .chip-holder {
        margin: 0px 0 -10px 0px;
    }

    .text-holder {
        margin: 0px 15px 0px 0px;
    }
</style>

<template>
  <v-app>
    <v-main>
      <v-tabs v-model="tab" align-tabs="center" bg-color="orange">
        <v-tab :value="1" bg-color="red">Items</v-tab>
        <v-tab :value="2">Skills</v-tab>
        <v-tab :value="3">Monsters</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab" bg-color="red">

        <v-tabs-window-item :value="1" bg-color="red">
          <ItemList v-if="items" :items="items" />
        </v-tabs-window-item>

        <v-tabs-window-item :value="2">
          <SkillsList v-if="skills" :skills="skills" />
        </v-tabs-window-item>

        <v-tabs-window-item :value="3">
          <MonsterEncountersList v-if="monsterEncounters" :monsterEncounters="monsterEncounters"></MonsterEncountersList>
        </v-tabs-window-item>

      </v-tabs-window>
    </v-main>
  </v-app>
</template>