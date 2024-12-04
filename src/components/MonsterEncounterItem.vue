<script setup>

import { defineProps, ref, computed, onMounted } from 'vue';
import { chip_tag_color } from '@/utils/tag_color.js';


const logoUrl = new URL('@/assets/logo.png', import.meta.url).href; // Placeholder image
const props = defineProps({
    monsterEncounter: {
        type: Object,
        required: true,
    },
});

</script>

<style scoped>
.divider-top {
    border-width: 2px;
    margin: -8px 0 5px 0px;
}

.text-holder {
    margin: 0px 15px 0px 0px;
}
</style>


<template>
    <v-card dark>
        <v-row no-gutters>
            <!-- Left Side (Image) -->
            <v-col cols="2">
                <!-- <v-img :src="props.monsterEncounter.image" height="100%" /> -->
                <v-img :src="logoUrl" width="100%" />
            </v-col>

            <!-- Right Side (Name and Description) -->
            <div class="text-holder">
                <v-card-title class="text-h5">{{ props.monsterEncounter.name }}</v-card-title>
                <v-divider class="divider-top" />
                <v-card-text class="text-subtitle-1">
                    Level: {{ props.monsterEncounter.level }}
                </v-card-text>
                <v-card-text class="text-subtitle-1">
                    Health: {{ props.monsterEncounter.health }}
                </v-card-text>
                <v-card-text class="text-subtitle-1">
                    XP: {{ props.monsterEncounter.rewardVictoryExperience }}
                </v-card-text>
                <v-card-text class="text-subtitle-1">
                    Gold: {{ props.monsterEncounter.rewardCombatGold }}
                </v-card-text>
            </div>
        </v-row>
    </v-card>
</template>