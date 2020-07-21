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
                    <v-form       ref="form"
                                  class="mx-10" @submit.prevent.stop="addNewClass" id="add-new-class-form">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        v-model="newClass.class_name.value"
                                        :error-messages="newClass.class_name.errors"
                                        label="عنوان کلاس" prepend-icon="title" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        label="نام کاربری مدرس مورد نظر"
                                        v-model="newClass.teacher_username.value"
                                        :error-messages="newClass.teacher_username.errors"
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
                </v-col>
            </v-row>
        </v-card>
        <ListClass :show-add-class-btn="false"/>

    </div>
</template>

<script>
    import ListClass from "./ListClass";
    import {mapGetters} from 'vuex';
    import FormValidationMixin from "../mixins/FormValidationMixin";

    export default {
        mixins: [
            FormValidationMixin
        ],
        computed: {
            ...mapGetters(['users', ]),
        },
        props: {
            showClassList: {
                type: Boolean,
                default: true
            }
        },
        methods: {

            clearForm(){
                this.$refs.form.reset();
                this.newClass.teacher_username.value = this.$store.getters.user.user.username;
            },

            addNewClass() {
                this.clearFormErrors(this.newClass);
                this.$store.dispatch('addClass', this.clearRawForm(this.newClass) ).
                then(() => {
                    this.$toasted.success('کلاس جدید اضافه شد');
                    this.clearForm();
                })
                .catch((err) => {
                    this.setErrors(this.newClass, err);
                })
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
                    class_name: {
                        value: '',
                        errors: []
                    },
                    teacher_username: {
                        value: this.$store.getters.user.user.username,
                        errors: []
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>