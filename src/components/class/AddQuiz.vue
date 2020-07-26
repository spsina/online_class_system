<template>
    <div>
        <v-app-bar
                app
                fixed
                    class="lighten-4 ma-5 toolbar"
                    :class="{
                        'green': !saving_general_quiz_data && quiz_id != null && !isQuizDataChanged,
                        'red': (quiz_id == null && !saving_general_quiz_data) || isQuizDataChanged,
                        'orange': saving_general_quiz_data
                    }"
            >
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
                        value="20"
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
            </v-app-bar>
        <div class="spacer"></div>
        <v-container>
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
                                        :loading="saving_general_quiz_data"
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
    import ClassServices from '../../services/class.service'

    export default {
        name: "AddQuiz.vue",
        data() {
            return {
                lastQ: null,
                startDateMoment: null,
                endDateMoment: null,
                quiz_id: null,
                doScroll: false,
                class_id: null,
                saving_general_quiz_data: false,
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
                questions: []
            }
        },
        created() {
            this.class_id = this.$route.params['class_id'];
        },

        computed: {
            datesSet() {
                return !!this.theQuiz.start_datetime.value && !!this.theQuiz.end_datetime.value && this.isQuizDataChanged;
            },
            isQuizDataChanged() {
                return this.isChanged(this.theQuiz);
            },
        },
        methods: {
            rawQuestion() {
                return {
                    id: null,
                    _id: 'id' + (new Date()).getTime(),
                    saving: false,
                    fields: {
                        text: {
                            value: '',
                            save_value: '',
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
                let qData = this.clearRawForm(question.fields);
                question.saving = true;

                let id;
                let endpoint;

                if (question.id === null) {
                    id = this.quiz_id;
                    endpoint = ClassServices.addQuestion
                } else {
                    id = question.id;
                    endpoint = ClassServices.updateDeleteQuestion;
                }

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

                if (question.id === null)
                    return;

                ClassServices.updateDeleteQuestion(question.id, {}, true)
                .then(() => {
                    this.$toasted.success("سوال حذف شد");
                    this.questions = this.questions.filter((q) => q._id !== question._id)

                } )
                .catch( () => this.$toasted.error("خظا در حذف سوا") );
            },
            addRawQuestion() {
                let newQ = this.rawQuestion();
                this.lastQ = newQ._id;
                this.questions.push(newQ);
                this.doScroll = true;

            },
            makeOrUpdate() {
                let quizData = this.clearRawForm(this.theQuiz);
                if (!this.datesSet)
                    return

                this.saving_general_quiz_data = true;
                let endpoint;
                let id;
                // select endpoint
                if (this.quiz_id == null) {
                    endpoint = ClassServices.createQuiz;
                    id = this.class_id;
                }
                else {
                    endpoint = ClassServices.updateQuiz;
                    id = this.quiz_id;
                }

                endpoint(id, quizData)
                    .then((response) => {
                        this.saveCurrentValues(this.theQuiz);
                        this.quiz_id = response.data.id;
                        this.saving_general_quiz_data = false;
                        this.clearFormErrors(this.theQuiz);
                    })
                    .catch((err) => {
                        this.setErrors(this.theQuiz, err);
                        this.saving_general_quiz_data = false;
                    })
            }
        },
        mixins: [
            FormValidationMixin
        ],
        updated() {
            if (this.doScroll) {
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