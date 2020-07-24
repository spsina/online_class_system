<template>
    <span class="mx-5">
         <v-icon>
            {{ icon }}
        </v-icon>
        {{ title }}
        :
        {{ value }}
    </span>
</template>

<script>
    export default {
        props:[
            'icon',
            'title',
            'value'
        ],
        name: "TopInfo.vue"
    }
</script>

<style scoped>

</style>