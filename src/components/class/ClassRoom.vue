<template>
    <div>

        <v-toolbar>
            <v-toolbar-title>
                <v-icon>class</v-icon>
                <template v-if="isDataSet">
                    {{ theClass.class_name }} |
                    <span class="h6">
                        {{ theClass.teacher.user.first_name }} {{ theClass.teacher.user.last_name }}
                    </span>
                </template>
                <template v-else>
                     <span class="error--text" v-if="tried">
                        خطا در دریافت اطلاعات
                    </span>
                </template>
            </v-toolbar-title>
            <v-spacer>
            </v-spacer>
            <template v-if="!loading">
                <v-icon @click="loadClassData">refresh</v-icon>
            </template>
            <template v-else>
                <v-progress-circular :indeterminate="true"></v-progress-circular>
            </template>

        </v-toolbar>
        <v-progress-linear indeterminate v-if="loading">
        </v-progress-linear>

        <v-container v-if="isDataSet">
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-title>
                            امتحانات
                            <v-spacer>
                            </v-spacer>
                            <v-tooltip bottom v-if="isTeacher">
                                <template v-slot:activator="{on, attr}">
                                    <v-btn  v-bind="attr" v-on="on"
                                            :to="{name: 'Quiz-Add', params: {class_id: class_id}}"
                                            icon
                                            link >
                                        <v-icon >mdi-plus-box</v-icon>
                                    </v-btn>
                                </template>
                                اضاف کردن امتحان جدید
                            </v-tooltip>
                        </v-card-title>
                        <v-card-text>
                            <v-data-table
                                    :header-props="{
                                    'sort-by-text':'مرتب سازی بر اساس',
                                }"
                                    :headers="quiz_data_headers"
                                    :items="theClass.quizzes"
                                    :search="search"
                                    :footer-props="{
                                    showFirstLastPage: true,
                                    'items-per-page-text':'امتحان در صفحه',
                                }"
                                    no-data-text="هنوز امتحانی اضافه نشده :("
                            >

                                <template v-slot:footer.page-text="items">
                                    {{ items.pageStart }} - {{ items.pageStop }} از {{ items.itemsLength }}
                                </template>
                                <template v-slot:item.start_datetime="{item}">
                                    {{ moment(new Date(item.start_datetime)).locale('fa').format('YYYY/MM/DD ساعت HH:mm') }}
                                </template>
                                <template v-slot:item.end_datetime="{item}">
                                    {{ moment(new Date(item.end_datetime)).locale('fa').format('YYYY/MM/DD ساعت HH:mm') }}
                                </template>
                                <template v-slot:item.is_active="{item}">
                                    <template v-if="item.is_active">

                                        <v-tooltip top>
                                            <template v-slot:activator="{on, attr}">
                                                <span v-bind="attr" v-on="on">
                                                    <v-icon   class="green--text blink">
                                                    mdi-radiobox-marked
                                                </v-icon>
                                                </span>
                                            </template>
                                            امتحان در حال برگزاری است
                                        </v-tooltip>

                                    </template>

                                    <template v-else>

                                        <v-tooltip top>
                                            <template v-slot:activator="{on, attr}">
                                                <v-icon v-bind="attr" v-on="on"  >
                                                    mdi-radiobox-marked
                                                </v-icon>
                                            </template>
                                            امتحان فعال نیست
                                        </v-tooltip>
                                    </template>

                                </template>
                                <template v-slot:item.actions="{  }">
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-title>

                            <v-container>
                                <v-row>
                                    دانشجویان
                                    <v-spacer></v-spacer>
                                    <template v-if="!showRegister && isTeacher">
                                        <v-tooltip top>
                                            <template v-slot:activator="{on, attr}">
                                                <v-icon
                                                        v-bind="attr"
                                                        v-on="on"
                                                        @click="showRegister=!showRegister">mdi-plus-box
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
                                                    <v-text-field
                                                            label="نام کاربری دانشجو"
                                                            v-model="newUserRegister.username.value"
                                                            :error-messages="newUserRegister.username.errors"
                                                    >

                                                    </v-text-field>
                                                    <v-btn
                                                            type="submit"
                                                    >
                                                        ثبت نام
                                                    </v-btn>
                                                </v-form>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <v-text-field
                                        v-model="std_search"
                                        append-icon="mdi-magnify"
                                        label="جست و جو"
                                        single-line
                                        hide-details
                                ></v-text-field>
                            </v-container>
                        </v-card-title>
                        <v-card-text>
                            <v-data-table
                                    :header-props="{
                                    'sort-by-text':'مرتب سازی بر اساس',
                                }"
                                    :search="std_search"
                                    :headers="student_data_headers"
                                    :items="theClass.students"
                                    :footer-props="{
                                    showFirstLastPage: true,
                                    'items-per-page-text':'تعداد در در صفحه',
                                }"
                                    no-data-text="هنوز دانشجویی اضافه نشده :("
                            >
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
                </v-col>
            </v-row>

        </v-container>

    </div>
</template>

<script>
    import ClassServices from '../../services/class.service'
    import FormValidationMixin from "../mixins/FormValidationMixin";
    import moment from 'jalali-moment'

    export default {
        mixins: [FormValidationMixin,],
        data() {
            return {
                showRegister: false,
                search: '',
                std_search: '',
                newUserRegister: {
                    username: {
                        value: '',
                        errors: []
                    },
                },
                quiz_data_headers: [
                    {
                        text: 'عنوان',
                        align: 'start',
                        sortable: true,
                        value: 'quiz_name',
                    },
                    {
                        text: 'تاریخ شروع',
                        align: 'start',
                        sortable: true,
                        value: 'start_datetime',
                    },
                    {
                        text: 'تاریخ پایان',
                        align: 'start',
                        sortable: true,
                        value: 'end_datetime',
                    },
                    {
                        text: 'نمره کل',
                        align: 'start',
                        sortable: true,
                        value: 'credit',
                    },
                    {
                        text: 'تعداد سوالات',
                        align: 'start',
                        sortable: true,
                        value: 'questions_count',
                    },
                    {
                        text: '',
                        align: 'start',
                        sortable: true,
                        value: 'is_active',
                    },
                ],
                student_data_headers: [
                    {
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
                class_id: -1,
                loading: true,
                tried: false,
                isDataSet: false,
                theClass: {}
            }
        },
        computed: {
            isTeacher() {
                return this.$store.getters.user.id === this.theClass.teacher.id ||
                    this.$store.getters.user.user.is_superuser;
            }
        },
        methods: {
            moment,
            fire(item) {
                if (confirm("آیا مطمئنید؟")) {
                    ClassServices.fire(this.class_id, item.user.username)
                        .then( () => {
                            this.theClass.students = this.theClass.students.filter((std) => std.id !== item.id);
                            this.$toasted.success("دانشجو اخراج شد");
                        })
                        .catch((err) => {
                            if (err && err.response && err.response.data)
                                this.$toasted.error(err.response.data)
                        })
                }
            },
            registerNewUser() {
                if (this.newUserRegister.username.value === '')
                    return
                ClassServices.register(this.class_id, this.newUserRegister.username.value)
                    .then(() => {
                        this.$toasted.success("دانشجو جدید ثبت نام شد");
                        this.loadClassData();
                        this.newUserRegister.username.value = '';
                        this.newUserRegister.username.errors= [];
                    })
                    .catch((err) => {
                        this.setErrors(this.newUserRegister, err);
                    })
            },

            loadClassData() {
                this.loading = true;
                ClassServices.classRetrieve(this.class_id)
                    .then((response) => {
                        this.theClass = response.data;
                        console.log(this.theClass)
                        this.loading = false;
                        this.isDataSet = true;
                    })
                    .catch((err) => {
                        if (err && err.response && err.response.data)
                            this.$toasted.error(err.response.data.detail)
                        this.loading = false;
                    }).finally(() => {
                    this.tried = true;
                })
            }
        },
        mounted() {
            this.class_id = this.$route.params.class_id;
            this.loadClassData();
        }
    }
</script>

<style scoped>
    .blink {
        animation: blink-animation 1s steps(5, start) infinite;
        -webkit-animation: blink-animation 1s steps(5, start) infinite;
    }

    @keyframes blink-animation {
        to {
            visibility: hidden;
        }
    }

    @-webkit-keyframes blink-animation {
        to {
            visibility: hidden;
        }
    }
</style>