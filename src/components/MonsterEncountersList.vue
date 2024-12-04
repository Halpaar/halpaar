<script setup>

import { defineProps, ref, computed, onMounted } from 'vue';
import { chip_tag_color } from '@/utils/tag_color.js';
import MonsterEncounterItem from './MonsterEncounterItem.vue';
const props = defineProps({
    monsterEncounters: {
        type: Array,
        required: true,
    },
});

props.monsterEncounters.sort((a, b) => a.level - b.level)

</script>


<template>
    <v-container>
    <v-row justify="center">
        <v-col cols="12" md="8">
            <p class="text-h6">
                {{ monsterEncounters.length }} Monsters
            </p>
        </v-col>
    </v-row>

    <v-row justify="center">
        <v-col cols="12" md="8" v-for="monsterEncounter in monsterEncounters" :key="monsterEncounter.id">
            <MonsterEncounterItem :monsterEncounter="monsterEncounter"></MonsterEncounterItem>
        </v-col>
    </v-row>
</v-container>
</template>