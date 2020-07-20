<template>
    <v-navigation-drawer  v-model="drawer" class="indigo" >
        <v-list>
            <v-list-tile-action>
                <v-icon class="white--text">dashboard</v-icon>
            </v-list-tile-action>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    props: {
        'drawer': Boolean
    },
    data() {
        return {
        }
    }
}
</script>