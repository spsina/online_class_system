<template>
    <div >
        <v-row>
            <v-col 
                cols="6"
                md="3"
                align-self="center"
                style="text-align: center"
                >
            <h3 class="mx-auto heading">لیست کلاس ها</h3>
            </v-col>
            <v-spacer></v-spacer>
            <v-col 
                cols="6"
                md="3"
                style="text-align: center"
                >
                <v-btn class="ma-auto success ">
                    <v-icon small left>add</v-icon>
                    اضاف کردن کلاس جدید
                </v-btn>
            </v-col>
        </v-row>
        <v-row v-if="!classes.length">
            <p class="mx-auto my-10 grey--text">هنوز هیچ کلاسی اضاف نشده :(</p>
        </v-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            classes: []
        }
    },

    mounted() {
    }
}
</script>