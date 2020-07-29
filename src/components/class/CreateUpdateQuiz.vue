<template>
    <div>
        <v-app-bar
                app
                fixed
                    class="lighten-4 ma-5 toolbar"
                    :class="{
                        'green': !loading && quiz_id != null && !isQuizDataChanged,
                        'red': (quiz_id == null && !loading) || isQuizDataChanged,
                        'orange': loading
                    }"
            >
            <template v-if="isUpdatePage && notFound">
                <v-toolbar-title>
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
                        icon="mdi-earth"
                        title="وضعیت انتشار"
                        value="پیش نویس"
                />
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{on, attr}">
                        <v-btn icon link v-bind="attr" v-on="on">
                            <v-icon class="green--text">publish</v-icon>
                        </v-btn>
                    </template>
                    انتشار امتحان
                </v-tooltip>
            </template>
            </v-app-bar>
        <div class="spacer"></div>
        <v-container v-if="isValid">

            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-title>
                            اطلاعات کلی
                        </v-card-title>
                        <v-card-text>
                            <v-form @submit.prevent="makeOrUpdate" id="make-or-update">
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                                v-model="theQuiz.quiz_name.value"
                                                :error-messages="theQuiz.quiz_name.errors"
                                                label="عنوان امتحان"
                                        >
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row justify="start" align="start">
                                    <v-col cols="12" md="6">
                                        <MyDatePicker v-model="theQuiz.start_datetime.value"
                                                      activator-id="start-date"
                                                      @change="startDateMoment=$event"
                                                      :errors="theQuiz.start_datetime.errors"
                                                      label="تاریخ شروع امتحان"
                                        />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <MyDatePicker v-model="theQuiz.end_datetime.value"
                                                      activator-id="end-date"
                                                      @change="endDateMoment=$event"
                                                      label="تاریخ پایان امتحان"
                                                      :min="theQuiz.start_datetime.value"
                                                      :errors="theQuiz.end_datetime.errors"
                                        />
                                    </v-col>

                                </v-row>
                                <v-btn
                                        class="my-5"
                                        block
                                        type="submit"
                                        :disabled="!datesSet"
                                        :loading="loading"
                                >
                                    ثبت یا ویرایش اطلاعات
                                </v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row >
                <v-col cols="12" v-for="(question, index) in questions" :key="question._id" :id="question._id">
                    <span class="mx-5">
                        سوال
                        {{ index+1 }}
                    </span>
                    <v-card class="mt-5 lighten-5"
                            :class="{
                                orange: question.saving,
                                red: !question.saving && ( question.id === null ||
                                    isChanged(question.fields)
                                ),
                                green: question.id !== null && !question.saving && !isChanged(question.fields)

                            }"
                    >
                        <v-card-title>
                            <v-text-field
                                    v-model="questions[index].fields.text.value"
                                    :error-messages="questions[index].fields.text.errors"
                            label="عنوان سوال"
                            />
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field
                                            v-model="question.fields.credit.value"
                                            label="بارم سوال"
                                            type="number"
                                            :rules="[ v => v > 0 || 'بارم سوال مثبت نیست']"
                                    />
                                </v-col>
                                <v-col cols="9">
                                    <v-btn
                                            @click="addSaveQuestion(question)"
                                        block
                                    >
                                        ثبت یا ویرایش سوال
                                    </v-btn>
                                </v-col>
                                <v-col cols="3">
                                    <v-btn
                                            @click="removeQuestion(question)"
                                            class="red lighten-1 white--text"
                                            block
                                    >
                                        حذف این سوال
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-tooltip bottom>
                <template v-slot:activator="{on, attr}">
                    <v-btn @click="addRawQuestion" icon link v-bind="attr" v-on="on" :disabled="quiz_id === null">
                        <v-icon>mdi-plus-box</v-icon>
                    </v-btn>
                </template>
                سوال جدید
            </v-tooltip>
        </v-container>
    </div>
</template>

<script>
    import TopInfo from "./TopInfo";
    import MyDatePicker from "./MyDatePicker";
    import FormValidationMixin from "../mixins/FormValidationMixin";
    import QuizService from '../../services/quiz.service'

    export default {
        name: "AddQuiz.vue",
        data() {
            return {
                startDateMoment: null,      // quiz start time
                endDateMoment: null,        // quiz end time
                quiz_id: null,              // quiz id
                doScroll: false,            // if window should scroll to the latest question
                class_id: null,             //  id of the class, this quiz is being created for
                loading: false,             // saving/updating/fetching indicator
                isUpdatePage: false ,       // if this is a quiz update page
                notFound: false,            // if the given quiz id for update is not found

                // structure of a the quiz form data
                theQuiz: {
                    quiz_name: {
                        saved_value: '',
                        value: 'name',
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
        created() {
            // get class id
            this.class_id = this.$route.params['class_id'];
        },

        computed: {
            isValid() {
                // page is valid unless this is an update page and notFound is true
                return !(this.isUpdatePage && this.notFound);
            },
            datesSet() {
                // if start date time and end date time of the quiz are set
                return !!this.theQuiz.start_datetime.value &&
                    !!this.theQuiz.end_datetime.value &&
                    this.isQuizDataChanged;
            },
            isQuizDataChanged() {
                // if there has been any unsaved changes
                return this.isChanged(this.theQuiz) || this.anyQuestionsChanged;
            },
            totalScore() {
                // sum of credits of all the questions
                let sum = 0;
                this.questions.forEach((Q) => {
                    sum += parseInt(Q.fields.credit.value);
                });
                return sum;
            },
            anyQuestionsChanged() {
                // if there is any unsaved questions or changes is questions

                // no change if no questions
                if (this.questions.length === 0)
                    return false;

                // detect any unsaved changes
                let changed = false;
                this.questions.forEach((Q) => {
                    if (this.isChanged(Q.fields)) {
                        changed = true;
                    }
                });

                return changed;
            },
        },
        methods: {
            setupAsUpdatePage() {
                // if quiz id is present, then this is an update page
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

                    QuizService.quizRetrieve(this.quiz_id)
                        .then((res) => {
                            console.log(res.data);
                            this.loading = false;
                        })
                        .catch((err) => {
                            if (err.response.status === 404)
                                this.notFound = true;
                            this.loading = false;
                        });
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
                        }
                    }
                }
            },

            addSaveQuestion(question, isDelete=false) {
                /* create a new question based on the given data
                 or update/delete an existing question
                 */

                // get all field values
                let qData = this.clearRawForm(question.fields);

                // set saving indicator
                question.saving = true;

                // determine the id and endpoint
                let id;
                let endpoint;

                // new question
                if (question.id === null) {
                    id = this.quiz_id;
                    endpoint = QuizService.addQuestion
                } else {
                    // update question
                    id = question.id;
                    endpoint = QuizService.updateDeleteQuestion;
                }

                // send the request
                endpoint(id, qData, isDelete)
                    .then((response) => {
                        this.saveCurrentValues(question.fields);
                        question.id = response.data.id;
                        this.clearFormErrors(question.fields);
                    })
                    .catch((err) => {
                        this.setErrors(question.fields, err);
                    }).finally(() => {question.saving = false;});

            },
            removeQuestion(question) {
                /* Delete a question */

                // the question is locally created, so no server side request needed
                if (question.id === null) {
                    this.questions = this.questions.filter((q) => q._id !== question._id)

                    return;
                }

                // send delete request and remove locally only if server request is successful
                QuizService.updateDeleteQuestion(question.id, {}, true)
                .then(() => {
                    this.$toasted.success("سوال حذف شد");
                    this.questions = this.questions.filter((q) => q._id !== question._id)

                } )
                .catch( () => this.$toasted.error("خظا در حذف سوا") );
            },
            addRawQuestion() {
                // append an empty question structure to the array of questions

                let newQ = this.rawQuestion();
                this.questions.push(newQ);
                this.doScroll = true;

            },
            makeOrUpdate() {
                /*
                * create a new quiz or update an existing quiz data
                * */

                // get all quiz fields values
                let quizData = this.clearRawForm(this.theQuiz);

                // if the dates are not set, don't send any requests
                // because the dates are mandatory
                if (!this.datesSet)
                    return;

                this.loading = true;

                // determine id and endpoint
                let endpoint;
                let id;

                // new quiz to be created
                if (this.quiz_id == null) {
                    endpoint = QuizService.createQuiz;
                    id = this.class_id;
                }

                // update
                else {
                    endpoint = QuizService.updateQuiz;
                    id = this.quiz_id;
                }

                // send the appropriate request
                endpoint(id, quizData)
                    .then((response) => {
                        this.saveCurrentValues(this.theQuiz);
                        this.quiz_id = response.data.id;
                        this.loading = false;
                        this.clearFormErrors(this.theQuiz);
                    })
                    .catch((err) => {
                        this.setErrors(this.theQuiz, err);
                        this.loading = false;
                    })
            }
        },
        mixins: [
            FormValidationMixin
        ],
        updated() {

            if (this.doScroll) {
                // do scroll is set by addRawQuestion each time a new question is added
                // automatically scroll to the beginning of newly added question only once

                // set doScroll to false, so the next time an update happens we don't scroll again
                this.doScroll = false;

                if (this.questions.length > 0) {
                    let _id = this.questions[this.questions.length - 1]._id;
                    document.getElementById(_id + '').scrollIntoView()
                }
            }
        },

        components: {
            MyDatePicker,
            TopInfo,

        },
        mounted() {
            // set page as update if quiz_is is present in the url
            if (this.$route.params['quiz_id'])
                this.setupAsUpdatePage();
        }
    }
</script>

<style scoped>
   .toolbar{
       top: 56px;
   }
    .spacer {
        height: 56px;
        display: block;
    }
</style>