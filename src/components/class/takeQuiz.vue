<template>
    <div>
        <v-toolbar >
            <template v-if="notFound">
                <v-toolbar-title class="warning--text">
                    امتحان با کد وارد شده یافت نشد
                </v-toolbar-title>
            </template>
            <template v-else>
                <v-toolbar-title >
                    {{ theQuiz.quiz_name.value }}

                </v-toolbar-title>
                <TopInfo
                        icon="mdi-help"
                        title="تعداد سوالات"
                        :value="questions.length"
                />
                <TopInfo
                        icon="mdi-counter"
                        title="بارم کل"
                        :value="totalScore"
                />
                <TopInfo
                        icon="mdi-watch"
                        title="زمان پایان"
                        :value="end_datetime_text"
                />
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{on, attr}">
                        <v-btn icon link v-bind="attr" v-on="on" :loading="loading" @click="end">
                            <v-icon class="green--text">check</v-icon>
                        </v-btn>
                    </template>
                    پایان آزمون
                </v-tooltip>
            </template>
        </v-toolbar>
        <v-container>
            <v-row v-for="question in questions" :key="question.id">
                <v-col cols="12">
                    <v-card>
                        <v-card-title>
                            <span class="px-5">{{ question.fields.text.value }}</span>
                            <v-spacer></v-spacer>
                            {{ question.fields.credit.value }}
                            نمره
                        </v-card-title>
                        <v-card-text>
                            <v-textarea
                                    v-model="question.fields.answer.value"
                                    :error-messages="question.fields.answer.errors"
                                    placeholder="پاسخ خود را در این قسمت بنویسید"
                            />

                        </v-card-text>

                        <v-card-actions>
                            <p class="warning--text" v-if="isChanged(question.fields)">
                                پاسخ شما ثبت نشده، لطفا قبل از پایان آزمون پاسخ خود را ثبت کنید
                            </p>
                        </v-card-actions>
                        <v-btn
                                @click="submitAnswer(question)"
                                block
                                class="lighten-5"
                                :class="{ 'green': !isChanged(question.fields) }"
                        >
                            ثبت پاسخ
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import TopInfo from "./TopInfo";
    import moment from 'jalali-moment'
    import QuizService from "../../services/quiz.service";
    import FormValidationMixin from "../mixins/FormValidationMixin";

    export default {
        name: "takeQuiz.vue",
        components: {
            TopInfo,
        },
        data() {
            return {
                notFound: false,
                quiz_id: null,
                loading: false,
                quizAnswerId: null,
                theQuiz: {
                    quiz_name: {
                        saved_value: '',
                        value: '',
                        errors: []
                    },
                    start_datetime: {
                        value: '',
                        saved_value: '',
                        errors: []
                    },
                    end_datetime: {
                        saved_value: '',
                        value: '',
                        errors: []
                    }
                },
                // an array of questions for this quiz
                questions: []

            }
        },
        methods: {
            load() {
                let _quiz_id = this.$route.params['quiz_id'];

                if (_quiz_id){
                    this.quiz_id = _quiz_id;
                    this.isUpdatePage = true;

                    /*
                    fetch quiz general info, the fetch quiz questions and
                    setup the page accordingly

                    if quiz with the given id is not found, show an error message
                    * */

                    // set loading indicator
                    this.loading = true;

                    QuizService.startQuiz(this.quiz_id)
                        .then((quizRaw) => {
                            this.bindToData(this.theQuiz, quizRaw.data.quiz);
                            this.quizAnswerId = quizRaw.data.id;

                            // load current answers into dic
                            let answers = {};
                            quizRaw.data.answers.forEach((answer) => {
                                answers[answer.question] = answer;
                            });

                            // load questions
                            QuizService.getQuizQuestions(this.quiz_id)

                                .then((QRaw) => {
                                    QRaw.data.forEach((Q) => {
                                        // get a raw question structure
                                        let q = this.rawQuestion();

                                        // set db id
                                        q.id = Q.id;

                                        // bind to data and push to local q array
                                        this.bindToData(q.fields, Q);

                                        // load answer if one exists
                                        if (answers[Q.id]) {
                                            q.fields.answer.value = answers[Q.id].answer;
                                            q.fields.answer.saved_value = answers[Q.id].answer;
                                        }

                                        this.questions.push(q);
                                    });
                                })
                                .catch((err) => {
                                    if(err.response && err.response.data)
                                    this.$toasted.error(err.response.data.detail);
                                    else
                                        this.$toasted.error(err);
                                })

                            this.loading = false;
                        })
                        .catch((err) => {
                            if (err.response && err.response.status === 404)
                                this.notFound = true;
                            else if (err.response && err.response.data && err.response.data.detail)
                                this.$toasted.error(err.response.data.detail)
                            else
                                this.$toasted.error(err);
                            this.loading = false;
                        });
                }
            },
            submitAnswer(question) {
                if (question.fields.answer.value === '')
                    return;

                QuizService.submitAnswer({
                    question: question.id,
                    quiz_answer: this.quizAnswerId,
                    answer: question.fields.answer.value
                }).then(() => {
                    this.saveCurrentValues(question.fields);
                }).catch((err) => {
                    this.setErrors(question.fields, err);
                })
            },
            end() {
                if (confirm("آیا مطمئنید؟")){
                    this.$router.push({name: 'Class-Page', params: {'class_id': this.$route.params['class_id']}})
                }
            },
            rawQuestion() {
                // return an empty structure for question
                return {
                    id: null,   // question id in db
                    _id: 'id' + (new Date()).getTime(), // internal id (used only in front)
                    saving: false,                      // indicates if question is being saved

                    // question form data structure
                    fields: {
                        text: {
                            value: '',
                            saved_value: '',
                            errors: []
                        },
                        credit: {
                            value: 1,
                            saved_value: 0,
                            errors: []
                        },
                        answer: {
                            value: '',
                            saved_value: '',
                            errors: []
                        }
                    }
                }
            },
        },
        mixins: [
            FormValidationMixin
        ],
        computed: {
            totalScore() {
                // sum of credits of all the questions
                let sum = 0;
                this.questions.forEach((Q) => {
                    sum += parseInt(Q.fields.credit.value);
                });
                return sum;
            },
            end_datetime_text(){
                if (this.theQuiz.end_datetime.value)
                return moment(new Date(this.theQuiz.end_datetime.value)).locale('fa').format('YYYY/MM/DD ساعت HH:mm')
                return ""
            }
        },
        created() {
            this.load();
        }
    }
</script>

<style scoped>

</style>