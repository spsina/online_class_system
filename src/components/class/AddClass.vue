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
                    <v-form class="mx-10" @submit.prevent.stop="addNewClass" id="add-new-class-form">
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

    export default {
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
            clearRawForm(rawFormData) {
                let _class = {}
                for (let key in rawFormData){
                    _class[key] = rawFormData[key].value
                }

                return _class;
            },
            clearFormErrors(rawFormData){
                for (let key in rawFormData){
                    rawFormData[key].errors = []
                }
            },
            addNewClass() {
                this.clearFormErrors(this.newClass);
                this.$store.dispatch('addClass', this.clearRawForm(this.newClass) ).
                then(() => this.$toasted.success('کلاس جدید اضافه شد'))
                .catch((err) => {
                    if (err && err.response && err.response.data) {
                        for (let key in err.response.data) {
                            if (key === 'non_field_errors') {
                                for (let _err in err.response.data[key])
                                    this.$toasted.error(err.response.data[key][_err])
                            }
                            for (let _err in err.response.data[key]) {
                                this.newClass[key].errors.push(err.response.data[key][_err])
                            }
                        }
                    }
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