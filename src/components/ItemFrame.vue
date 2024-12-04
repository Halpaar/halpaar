<script setup>

import { defineProps, ref, computed, onMounted } from 'vue';
import { chip_tag_color } from '@/utils/tag_color.js';


const logoUrl = new URL('@/assets/logo.png', import.meta.url).href; // Placeholder image
const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

</script>


<template>
    <v-card dark>
        <v-row no-gutters>
            <!-- Left Side (Image) -->
            <v-col cols="2">
                <!-- <v-img :src="props.item.image" height="100%" /> -->
                <v-img :src="logoUrl" width="100%" />
            </v-col>

            <!-- Right Side (Name and Description) -->
            <v-col cols="10">
                <div class="chip-holder">

                    <v-chip v-for="hero in props.item.heroes" :id="hero" class="ma-2" :color="chip_tag_color(hero)" label>
                        <v-icon icon="mdi-account" start></v-icon>
                        {{ hero }}
                    </v-chip>

                    <v-chip v-for="tag in props.item.tags" :id="tag" class="ma-2" color="blue" label
                        :color="chip_tag_color(tag)">
                        <v-icon icon="mdi-label" start></v-icon>
                        {{ tag }}
                    </v-chip>


                    <v-chip v-for="tag in props.item.hiddenTags" :id="tag" class="ma-2" color="grey" label
                        :color="chip_tag_color(tag)">
                        <v-icon icon="mdi-eye-off" start></v-icon>
                        {{ tag }}
                    </v-chip>
                </div>

                <div class="text-holder">
                    <v-card-title class="text-h5">{{ props.item.name }}</v-card-title>
                    <v-divider class="divider-top" />

                    <v-card-text class="text-subtitle-1" v-for="(tooltip, index) in props.item.activeTooltops" :key="index">
                        {{ tooltip }}
                    </v-card-text>

                    <v-divider v-if="props.item.activeTooltops.length > 0 && props.item.passiveTooltops.length > 0"
                        class="divider-mid" />

                    <v-card-text class="text-subtitle-1" v-for="(tooltip, index) in props.item.passiveTooltops" :key="index">
                        {{ tooltip }}
                    </v-card-text>
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>