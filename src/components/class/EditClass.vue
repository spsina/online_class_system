<template>
    <v-card>
        <v-card-title>
            ویرایش کلاس
        </v-card-title>
        <v-card-text>
            <v-form       ref="form"
                          class="mx-10" @submit.prevent.stop="editClass" id="add-new-class-form">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field
                                v-model="classInfo.class_name.value"
                                :error-messages="classInfo.class_name.errors"
                                label="عنوان کلاس" prepend-icon="title" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                                label="نام کاربری مدرس مورد نظر"
                                v-model="classInfo.teacher_username.value"
                                :error-messages="classInfo.teacher_username.errors"
                                prepend-icon="mdi-account-box" />
                    </v-col>
                </v-row>
                <v-btn
                        type="submit"
                        form="add-new-class-form"
                        color="blue-grey"
                        class="ma-2 white--text"
                >ثبت</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        name: "EditClass.vue",
        props: [
            'class_name',
            'teacher_username'
        ],
        created() {
            this.classInfo.class_name.value = this.class_name;
            this.classInfo.teacher_username.value = this.teacher_username.value;
        },
        data() {
            return {
                classInfo: {
                    class_name: {
                        value: '',
                        errors: []
                    },
                    teacher_username: {
                        value: '',
                        errors: []
                    }
                }
            }
        },
        methods: {
            editClass () {

            }
        }
    }
</script>

<style scoped>

</style>