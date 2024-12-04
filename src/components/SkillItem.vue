<script setup>

import { defineProps, ref, computed, onMounted } from 'vue';
import { chip_tag_color } from '@/utils/tag_color.js';


const defaultSkill = new URL('@/assets/skill_default.png', import.meta.url).href; // Placeholder image
const props = defineProps({
    skill: {
        type: Object,
        required: true,
    },
});

</script>

<template>
    <v-card dark>
        <v-row no-gutters>
            <!-- Left Side (Image) -->
            <v-col cols="1">
                <v-img :src="defaultSkill" width="100%" />
            </v-col>

            <v-col cols="10">
                <div class="chip-holder">

                    <v-chip v-for="hero in props.skill.heroes" :id="hero" class="ma-2" :color="chip_tag_color(hero)" label>
                        <v-icon icon="mdi-account" start></v-icon>
                        {{ hero }}
                    </v-chip>

                    <v-chip v-for="tag in props.skill.tags" :id="tag" class="ma-2" color="blue" label
                        :color="chip_tag_color(tag)">
                        <v-icon icon="mdi-label" start></v-icon>
                        {{ tag }}
                    </v-chip>


                    <v-chip v-for="tag in props.skill.hiddenTags" :id="tag" class="ma-2" color="grey" label
                        :color="chip_tag_color(tag)">
                        <v-icon icon="mdi-eye-off" start></v-icon>
                        {{ tag }}
                    </v-chip>
                </div>

                <div class="text-holder">
                    <v-card-title class="text-h5">{{ props.skill.name }}</v-card-title>
                    <v-divider class="divider-top" />

                    <v-card-text class="text-subtitle-1" v-for="(tooltip, index) in props.skill.passiveTooltops" :key="index">
                        {{ tooltip }}
                    </v-card-text>
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>