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
                <QuizList :quizzes="theClass.quizzes" :is-teacher="isTeacher" :class_id="class_id" />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <StudentsList v-model="theClass.students" :is-teacher="isTeacher" :class_id="class_id" />
            </v-col>
        </v-row>

    </v-container>

</div>
</template>

<script>
import ClassServices from '../../services/class.service'
import FormValidationMixin from "../mixins/FormValidationMixin";
import QuizList from "./QuizList";
import StudentsList from "./StudentsList";

export default {
    mixins: [FormValidationMixin, ],
    components: {
        QuizList,
        StudentsList
    },
    data() {
        return {
            class_id: -1,
            loading: true,
            tried: false,
            isDataSet: false,
            theClass: {},
        }
    },
    computed: {
        isTeacher() {
            return this.$store.getters.user.id === this.theClass.teacher.id ||
                this.$store.getters.user.user.is_superuser;
        }
    },
    methods: {
        loadClassData() {
            this.loading = true;
            ClassServices.classRetrieve(this.class_id)
                .then((response) => {

                    this.theClass = response.data;

                    console.log(response.data);

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
