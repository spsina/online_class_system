<template>
    <div>
        <v-card>
            <v-row>
                <v-col cols="12">
                    <v-card-title>
                        اضاف کردن کلاس جدید
                    </v-card-title>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" >
                    <v-form class="mx-10">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="newClass.class_name" label="عنوان کلاس" prepend-icon="title" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-autocomplete v-model="newClass.class_teacher_id" label="انتخاب مدرس کلاس"
                                    item-text="full_name"
                                    item-value="id"
                                    :items="users" prepend-icon="mdi-account-box"/>
                            </v-col>
                        </v-row>
                        <v-btn
                                color="blue-grey"
                                class="ma-2 white--text"
                        >ثبت</v-btn>
                    </v-form>
                </v-col>
            </v-row>
        </v-card>
        <ListClass :show-add-class-btn="false"/>

    </div>
</template>

<script>
    import ListClass from "./ListClass";
    import {mapGetters} from 'vuex';

    export default {
        computed: {
            ...mapGetters(['users', ])
        },
        props: {
            showClassList: {
                type: Boolean,
                default: true
            }
        },
        name: "AddClass",
        components: {ListClass},
        comments: {
            ListClass
        },
        data() {
            return {

                newClass: {
                    class_name: '',
                    class_teacher_id: 0
                }
            }
        }
    }
</script>

<style scoped>

</style>