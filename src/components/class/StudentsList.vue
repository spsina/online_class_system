<template>
<v-card>
    <v-card-title>
        <v-container>
            <v-row>
                دانشجویان
                <v-spacer></v-spacer>
                <template v-if="!showRegister && isTeacher">
                    <v-tooltip top>
                        <template v-slot:activator="{on, attr}">
                            <v-icon v-bind="attr" v-on="on" @click="showRegister=!showRegister">mdi-plus-box
                            </v-icon>
                        </template>
                        ثبت نام دانشجو
                    </v-tooltip>
                </template>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card v-show="showRegister">
                        <v-card-title>
                            ثبت نام دانشجو با نام کاربری
                            <v-spacer></v-spacer>
                            <v-icon @click="showRegister=!showRegister">clear</v-icon>
                        </v-card-title>
                        <v-card-text>
                            <v-form @submit.prevent="registerNewUser" id="register-form">
                                <v-text-field label="نام کاربری دانشجو" v-model="newUserRegister.username.value" :error-messages="newUserRegister.username.errors">

                                </v-text-field>
                                <v-btn type="submit">
                                    ثبت نام
                                </v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-text-field v-model="std_search" append-icon="mdi-magnify" label="جست و جو" single-line hide-details></v-text-field>
        </v-container>
    </v-card-title>
    <v-card-text>
        <v-data-table :header-props="{
                                    'sort-by-text':'مرتب سازی بر اساس',
                                }" :search="std_search" :headers="student_data_headers" :items="studentsList" :footer-props="{
                                    showFirstLastPage: true,
                                    'items-per-page-text':'تعداد در در صفحه',
                                }" no-data-text="هنوز دانشجویی اضافه نشده :(">
            <template v-slot:item.user.actions="{ item }" v-if="isTeacher">
                <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                        <span v-bind="attrs" v-on="on">
                            <v-icon @click="fire(item)" class="red--text">mdi-fire</v-icon>
                        </span>
                    </template>
                    <span>
                        اخراج
                    </span>

                </v-tooltip>
            </template>
        </v-data-table>
    </v-card-text>
</v-card>
</template>

<script>
import ClassServices from "../../services/class.service";
import FormValidationMixin from "../mixins/FormValidationMixin";

export default {
    name: "StudentsList.vue",
    props: [
        'isTeacher',
        'class_id',
        'value'
    ],
    created() {
        this.studentsList = this.value;
    },
    watch: {
        studentsList() {
            this.emitStudentsListChange();
        },
    },
    methods: {
        emitStudentsListChange() {
            this.$emit('input', this.studentsList);
        },

        fire(item) {
            if (confirm("آیا مطمئنید؟")) {
                ClassServices.fire(this.class_id, item.user.username)
                    .then(() => {
                        this.studentsList = this.studentsList.filter((std) => std.id !== item.id);
                        this.$toasted.success("دانشجو اخراج شد");
                    })
                    .catch((err) => {
                        if (err && err.response && err.response.data)
                            this.$toasted.error(err.response.data)
                    });
            }
        },

        registerNewUser() {
            // don't send request if no username provided
            if (this.newUserRegister.username.value === '')
                return

            ClassServices.register(this.class_id, this.newUserRegister.username.value)
                .then((res) => {
                    this.$toasted.success("دانشجو جدید ثبت نام شد");
                    this.studentsList.unshift(res.data);
                    this.clearForm(this.newUserRegister);
                })
                .catch((err) => {
                    this.setErrors(this.newUserRegister, err);
                })
        },

    },
    data() {
        return {
            showRegister: false,
            std_search: '',
            studentsList: [],
            newUserRegister: {
                username: {
                    value: '',
                    errors: []
                },
            },
            student_data_headers: [{
                    text: 'نام',
                    align: 'start',
                    sortable: true,
                    value: 'user.first_name',
                },
                {
                    text: 'نام خانوادگی',
                    align: 'start',
                    sortable: true,
                    value: 'user.last_name',
                },
                {
                    text: 'نام کاربری',
                    align: 'start',
                    sortable: true,
                    value: 'user.username',
                },
                {
                    text: 'عملیات',
                    align: 'start',
                    sortable: true,
                    value: 'user.actions',
                },
            ],

        }
    },
    mixins: [
        FormValidationMixin
    ]
}
</script>

<style scoped>

</style>
