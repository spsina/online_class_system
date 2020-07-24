<template>
    <div>
        <v-toolbar
                class="lighten-5"
                :class="{
                        'green': !saving_general_quiz_data && quiz_id != null && !isQuizDataChanged,
                        'red': (quiz_id == null && !saving_general_quiz_data) || isQuizDataChanged,
                        'orange': saving_general_quiz_data
                    }"
        >
            <v-toolbar-title>
                {{ theQuiz.quiz_name.value }}

                <template v-if="startDateMoment">
                    -
                    از
                    {{ startDateMoment.format('dddd jDD jMMMM jYYYY ساعت HH:mm') }}
                </template>
                <template v-if="endDateMoment">
                    تا
                    {{ endDateMoment.format('dddd jDD jMMMM jYYYY ساعت HH:mm') }}
                </template>
            </v-toolbar-title>
            <TopInfo
                    icon="mdi-help"
                    title="تعداد سوالات"
                    value="12"
            />
            <TopInfo
                    icon="mdi-counter"
                    title="بارم کل"
                    value="20"
            />
            <v-spacer></v-spacer>
            وضعیت انتشار: پیش نویس
            <v-tooltip bottom>
                <template v-slot:activator="{on, attr}">
                    <v-btn icon link v-bind="attr" v-on="on">
                        <v-icon class="green--text">publish</v-icon>
                    </v-btn>
                </template>
                انتشار امتحان
            </v-tooltip>
        </v-toolbar>

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
                                    <v-col cols="6">
                                        <MyDatePicker v-model="theQuiz.start_datetime.value"
                                                      activator-id="start-date"
                                                      @change="startDateMoment=$event"
                                                      :errors="theQuiz.start_datetime.errors"
                                                      label="تاریخ شروع امتحان"
                                        />
                                    </v-col>

                                    <v-col cols="6">
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
                startDateMoment: null,
                endDateMoment: null,
                quiz_id: null,
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
            }
        },
        created() {
            this.class_id = this.$route.params['class_id'];
        },

        computed: {
            datesSet() {
                return !!this.theQuiz.start_datetime.value && !!this.theQuiz.end_datetime.value;
            },
            isQuizDataChanged() {
                return this.isChanged(this.theQuiz);
            },
        },
        methods: {

            makeOrUpdate() {
                let quizData = this.clearRawForm(this.theQuiz);
                if (!this.datesSet)
                    return

                this.saving_general_quiz_data = true;

                // create a new quiz
                if (this.quiz_id == null) {
                    ClassServices.createQuiz(this.class_id, quizData)
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
            }
        },
        mixins: [
            FormValidationMixin
        ],
        components: {
            MyDatePicker,
            TopInfo,

        },
    }
</script>

<style scoped>

</style>