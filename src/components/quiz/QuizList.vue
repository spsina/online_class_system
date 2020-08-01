<template>
    <v-card>
        <v-card-title>
            امتحانات
            <v-spacer>
            </v-spacer>
            <v-tooltip bottom v-if="isTeacher">
                <template v-slot:activator="{on, attr}">
                    <v-btn v-bind="attr" v-on="on" :to="{name: 'Quiz-Add', params: {class_id: class_id}}" icon link>
                        <v-icon>mdi-plus-box</v-icon>
                    </v-btn>
                </template>
                اضاف کردن امتحان جدید
            </v-tooltip>
        </v-card-title>
        <v-card-text>
            <v-data-table :header-props="{
                                    'sort-by-text':'مرتب سازی بر اساس',
                                }" :headers="quiz_data_headers" :items="quizzes" :search="search" :footer-props="{
                                    showFirstLastPage: true,
                                    'items-per-page-text':'امتحان در صفحه',
                                }" no-data-text="هنوز امتحانی اضافه نشده :(">

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
                                                <v-icon class="green--text blink">
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
                                <v-icon v-bind="attr" v-on="on">
                                    mdi-radiobox-marked
                                </v-icon>
                            </template>
                            امتحان فعال نیست
                        </v-tooltip>
                    </template>

                </template>
                <template v-slot:item.actions="{ item }">
                    <v-tooltip top v-if="isTeacher">
                        <template v-slot:activator="{on, attr}">
                            <v-btn v-bind="attr" v-on="on" icon link :to="{ name: 'Quiz-Update', params: {class_id, quiz_id: item.id }}">
                                <v-icon class="blue--text">
                                    edit
                                </v-icon>
                            </v-btn>
                        </template>
                        ویرایش
                    </v-tooltip>
                    <QuizTakersList :is-teacher="isTeacher" :quiz_id="item.id" />

                    <v-tooltip top v-if="!isTeacher && item.is_active">
                        <template v-slot:activator="{on, attr}">
                            <v-btn v-bind="attr" v-on="on" icon link class="green--text" :to="{ name: 'Quiz-Take', params: {class_id, quiz_id: item.id }}">
                                <v-icon>
                                    open_in_browser
                                </v-icon>
                            </v-btn>
                        </template>
                        شرکت در آزمون
                    </v-tooltip>
                    <v-tooltip top v-if="tookQuiz(item)">
                        <template v-slot:activator="{on, attr}">
                            <v-btn v-bind="attr" v-on="on" icon link class="blue--text" :to="{ name: 'Quiz-Score-See', params: {quiz_answer_id: tookQuiz(item).id }}">
                                <v-icon>
                                    mdi-chart-timeline
                                </v-icon>
                            </v-btn>
                        </template>
                        مشاهده نمرات
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
    import QuizTakersList from "./QuizTakersList";
    import QuizServices from "../../services/quiz.service";
    import moment from 'jalali-moment'

    export default {
        props: [
            'isTeacher',
            'class_id',
            'quizzes'
        ],
        name: "QuizList.vue",
        data() {
            return {
                search: '',
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
                        text: 'عملیات',
                        align: 'start',
                        value: 'actions',
                    },
                    {
                        text: '',
                        align: 'start',
                        sortable: true,
                        value: 'is_active',
                    },

                ],
                quiz_takers: {}
            }
        },
        created() {
            // load quiz takers
            if (this.isTeacher) {
                this.quizzes.forEach( (quiz) => {
                    QuizServices.TakersList(quiz.id)
                        .then((res) => {
                            this.$set(this.quiz_takers, quiz.id, res.data);
                        })
                        .catch(() => {
                            this.$toasted.error("اطلاعات به طور کامل دریافت نشد")
                        })
                });
            }
        },
        methods: {
            moment,
            tookQuiz(quiz) {
                if (quiz.id in this.quiz_takers) {
                    return this.quiz_takers[quiz.id].find( (qa) => {
                        let qid = qa.user_profile.id;
                        let myId = this.$store.getters.user.id
                        return qid === myId;
                    })
                }
                return false;
            },
        },
        components: {
            QuizTakersList
        }
    }
</script>

<style scoped>

</style>