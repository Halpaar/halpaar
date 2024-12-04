<script setup>
import { defineProps, ref, computed, onMounted } from 'vue';
import { chip_tag_color } from '@/utils/tag_color.js';
import ItemFrame from './ItemFrame.vue';
const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
});

const searchQuery = ref('');
const page = ref(1);
const pageSize = 10;
const heroTags = ref([]);
const tags = ref([]);
const hiddenTags = ref([]);
const sizeTags = ref([]);

// Setup item tags
onMounted(() => {
    props.items.forEach((item, _) => {
        item.tags.filter(tag => !tags.value.includes(tag)).forEach(tag => tags.value.push(tag));
        item.heroes.filter(tag => !heroTags.value.includes(tag)).forEach(tag => heroTags.value.push(tag));
        item.hiddenTags.filter(tag => !hiddenTags.value.includes(tag)).forEach(tag => hiddenTags.value.push(tag));
        if (!sizeTags.value.includes(item.size)) sizeTags.value.push(item.size);
    });

    heroTags.value.sort();
    tags.value.sort();
    hiddenTags.value.sort();
    sizeTags.value.sort();
});

// Item searching

// Adding clicked tags to list of "search tag"
const searchTags = ref([])
function addSearchTerm(tag) {
    if (!searchTags.value.includes(tag))
        searchTags.value.push(tag)

    console.log(searchTags.value);
}
function removeSearchTerm(tag) {
    searchTags.value = searchTags.value.filter(item => item !== tag);
}

// Filtering of items
let filteredItems = computed(() => {
    if ((!searchQuery.value || searchQuery.value.length <= 0) && searchTags.value.length <= 0) return props.items ?? [];

    console.log("Filtering");

    // filter with tags
    let filtered = props.items.filter(item =>
    {
        // console.log(searchTags.value.forEach(tag => item.tags.includes(tag)));

        return searchTags.value.every(tag =>
        item.size == tag ||
        item.heroes.includes(tag) ||
        item.tags.includes(tag) ||
        item.hiddenTags.includes(tag) ||
        item.activeTooltops.includes(tag) ||
        item.passiveTooltops.includes(tag))
    }
    );

    // filter with search query
    if (searchQuery) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.tags.some(x => x.toLowerCase().includes(query)) ||
            item.hiddenTags.some(x => x.toLowerCase().includes(query)) ||
            item.activeTooltops.some(x => x.toLowerCase().includes(query)) ||
            item.passiveTooltops.some(x => x.toLowerCase().includes(query))
        );
    }

    page.value = 1
    return filtered;
});


// Item pagination

// Filter list based on page number
let paginatedItems = computed(() => {
    if (filteredItems) {
        return filteredItems.value.slice(0, Math.min(filteredItems.value.length, page.value * pageSize))
    }
    else
        return []
});

// Detect bottom of page
const sentinel = ref(null);
const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
        page.value += 1;
    }
});
onMounted(() => {
    if (sentinel.value) {
        observer.observe(sentinel.value);
    }
});


</script>

<template>

    <!-- Search bar -->
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8" style="padding-bottom: 0px; margin-bottom: -15px;">
                <v-text-field v-model="searchQuery" label="Search" variant="outlined" clearable />
            </v-col>
        </v-row>
        <v-row v-if="searchTags.length > 0" justify="center">
            <v-col cols="12" md="8" style="padding-top: 0px;">
                <v-chip v-for="(tag, index) in searchTags" :id="index" class="ma-2" label link
                    @click="removeSearchTerm(tag)" @click:close="removeSearchTerm(tag)">
                    {{ tag }}
                    &nbsp;
                    <v-icon icon="mdi-close-circle" />
                </v-chip>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" md="8" style="padding-top: 0px;">
                <v-card dark>
                    <div style="margin: 6px 3px;">
                        <v-row v-if="heroTags.length > 0" style="margin: 0px;">
                            <v-col cols="1" class="d-flex align-center">
                                Heroes
                            </v-col>
                            <v-col cols="10">
                                <v-chip v-for="(tag, index) in heroTags" :id="index" class="ma-2" label link
                                    @click="addSearchTerm(tag)" :color="chip_tag_color(tag)">
                                    <v-icon icon="mdi-account" start />
                                    {{ tag }}
                                </v-chip>
                            </v-col>
                        </v-row>
                        <v-row v-if="tags.length > 0" style="margin: 0px;">
                            <v-col cols="1" class="d-flex align-center">
                                Tags
                            </v-col>
                            <v-col cols="10">
                                <v-chip v-for="(tag, index) in tags" :id="index" class="ma-2" label link
                                    @click="addSearchTerm(tag)" :color="chip_tag_color(tag)">
                                    <v-icon icon="mdi-account" start />
                                    {{ tag }}
                                </v-chip>
                            </v-col>
                        </v-row>
                        <v-row v-if="sizeTags.length > 0" style="margin: 0px;">
                            <v-col cols="1" class="d-flex align-center">
                                Size
                            </v-col>
                            <v-col cols="10">
                                <v-chip v-for="(tag, index) in sizeTags" :id="index" class="ma-2" label link
                                    @click="addSearchTerm(tag)" :color="chip_tag_color(tag)">
                                    <v-icon icon="mdi-account" start />
                                    {{ tag }}
                                </v-chip>
                            </v-col>
                        </v-row>
                        <v-row v-if="hiddenTags.length > 0" style="margin: 0px;">
                            <v-col cols="1" class="d-flex align-center">
                                Hidden
                            </v-col>
                            <v-col cols="10">
                                <v-chip v-for="(tag, index) in hiddenTags" :id="index" class="ma-2" label link
                                    @click="addSearchTerm(tag)" :color="chip_tag_color(tag)">
                                    <v-icon icon="mdi-eye-off" start />
                                    {{ tag }}
                                </v-chip>
                            </v-col>
                        </v-row>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <!-- Tag bar -->
    <!-- <v-container>
    </v-container> -->

    <!-- Item list -->
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <p class="text-h6">
                    {{ filteredItems.length }} Items
                </p>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12" md="8" v-for="item in paginatedItems" :key="item.id">
                <ItemFrame :item="item"></ItemFrame>
            </v-col>
            <!-- Pagination sentinel -->
            <div ref="sentinel" style="height: 1px;"></div>
        </v-row>
    </v-container>

</template>