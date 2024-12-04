<script setup>

import { defineProps, ref, computed, onMounted } from 'vue';
import { chip_tag_color } from '@/utils/tag_color.js';
import SkillItem from './SkillItem.vue';
const props = defineProps({
    skills: {
        type: Array,
        required: true,
    },
});
props.skills.sort((a, b) => a.name.localeCompare(b.name));

</script>


<template>
    <v-container>
    <v-row justify="center">
        <v-col cols="12" md="8">
            <p class="text-h6">
                {{ skills.length }} Skills
            </p>
        </v-col>
    </v-row>

    <v-row justify="center">
        <v-col cols="12" md="8" v-for="skill in skills" :key="skill.id">
            <SkillItem :skill="skill"></SkillItem>
        </v-col>
    </v-row>
</v-container>
</template>