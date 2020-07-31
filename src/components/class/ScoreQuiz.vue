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
                    {{ theQuiz.quiz_name }}

                    |
                    {{ studentName }}

                </v-toolbar-title>
                <TopInfo
                        icon="mdi-help"
                        title="تعداد سوالات"
                        :value="answers.length"
                />
                <TopInfo
                        icon="mdi-counter"
                        title="بارم کل"
                        :value="totalScore"
                />
                <v-spacer></v-spacer>
                <v-btn icon link @click="$router.go(-1)"><v-icon>mdi-check</v-icon></v-btn>
            </template>
        </v-toolbar>
        <v-container>
            <v-row v-for="answer in answers" :key="answer.id">
                <v-col cols="12">
                    <v-card>
                        <v-card-title>
                            <span class="px-5">{{ answer.question.text}}</span>
                            <v-spacer></v-spacer>
                            {{ answer.question.credit }}
                            نمره
                        </v-card-title>
                        <v-card-title>
                            <span class="px-5">پاسخ</span>
                        </v-card-title>
                        <v-card-text>
                            <span class="px-10">
                                {{ answer.answer }}
                            </span>
                            <v-text-field
                                    :disabled="!editable"
                                    label="نمره"
                                    block
                                    type="number"
                                    v-model="answer.score"
                            />
                        </v-card-text>
                        <v-btn block @click="setScore(answer)" v-if="editable">
                            ثبت نمره
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import TopInfo from "./TopInfo";
    import QuizService from "../../services/quiz.service";
    import FormValidationMixin from "../mixins/FormValidationMixin";

    export default {
        name: "takeQuiz.vue",
        props: {
            editable: {
                type: Boolean,
                default: true
            }
        },
        components: {
            TopInfo,
        },
        data() {
            return {
                notFound: false,
                loading: false,
                quizAnswerId: null,
                studentName: '',
                theQuiz: {
                    quiz_name: ''
                },
                // an array of questions for this quiz
                answers: []

            }
        },
        methods: {
            load() {
                this.quizAnswerId = this.$route.params['quiz_answer_id']

                QuizService.QuizAnswerRetrieve(this.quizAnswerId).then((res) => {
                    this.answers = res.data.answers;
                    this.theQuiz = res.data.quiz;
                    this.studentName = res.data.user_profile.user.first_name +' ' + res.data.user_profile.user.last_name;


                }).catch((err) => {
                    if(err && err.response && err.response.data)
                        this.$toasted.err(err.response.data.detail);
                    else
                        console.log(err);
                })
            },
            setScore(answer) {
                QuizService.setScore(answer.id, {score: answer.score})
                .then(() => {
                    this.$toasted.success("نمره ثبت شد");
                }).catch((err) => {
                    console.log(err.response.data);
                    if (err && err.response && err.response.data)
                        this.$toasted.error(err.response.data.score[0]);
                    else
                        this.$toasted.error("مشکلی در ثبت نمره رخ داده، دوباره تلاش کنید")
                })
            }
        },
        mixins: [
            FormValidationMixin
        ],
        computed: {
            totalScore() {
                // sum of credits of all the questions
                let sum = 0;
                this.answers.forEach((Q) => {
                    sum += parseInt(Q.question.credit);
                });
                return sum;
            },
        },
        created() {
            this.load();
        }
    }
</script>

<style scoped>

</style>