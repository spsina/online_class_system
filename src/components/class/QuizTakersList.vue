<template>
<v-dialog v-model="dialog" @input="$emit('input', !dialog)" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template v-slot:activator="dActivator">
        <v-tooltip top v-if="isTeacher" v-bind="dActivator.attr" v-on="dActivator.on">
            <template v-slot:activator="{on, attr}">
                <v-btn v-bind="attr" v-on="on" icon link @click="dialog=true">
                    <v-icon class="green--text">
                        mdi-auto-fix
                    </v-icon>
                </v-btn>
            </template>
            تصحیح امتحان
        </v-tooltip>
    </template>
    <v-card>
        <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>دانشجو را انتخاب کنید</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-data-table :header-props="header_props" :headers="quiz_takers_headers" :items="quiz_takers" :footer-props="footer_props" no-data-text="هنوز دانشجویی اضافه نشده :(">
                        <template v-slot:item.user.actions="{ item }" v-if="isTeacher">
                            <v-tooltip top>
                                <template v-slot:activator="{on, attrs}">
                                    <span v-bind="attrs" v-on="on">
                                        <v-btn link icon :to="{name: 'Quiz-Score', params: {'quiz_answer_id': item.id}}">
                                            <v-icon class="blue--text">mdi-pencil</v-icon>
                                        </v-btn>
                                    </span>
                                </template>
                                <span>
                                    تصحیح
                                </span>

                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</v-dialog>
</template>

<script>
    import QuizServices from '../../services/quiz.service'

export default {
    name: "QuizTakersList.vue",
    props: [
        'quiz_id',
        'isTeacher',
    ],

    created() {
    },
    mounted() {
        // get class quiz data

        QuizServices.TakersList(this.quiz_id).then((res) => {
            this.quiz_takers = res.data;
        }).catch((err) => {
            if (err && err.response && err.response.data)
                this.$toasted.error(err.response.data.detail);
        })
    },
    data() {
        return {
            dialog: false,
            quiz_takers: [],
            header_props: {
                'sort-by-text': 'مرتب سازی بر اساس',
            },
            footer_props: {
                showFirstLastPage: true,
                'items-per-page-text': 'تعداد در در صفحه',
            },
            quiz_takers_headers: [
                {
                    text: 'نام',
                    align: 'start',
                    sortable: true,
                    value: 'user_profile.user.first_name',
                },
                {
                    text: 'نام خانوادگی',
                    align: 'start',
                    sortable: true,
                    value: 'user_profile.user.last_name',
                },
                {
                    text: 'نام کاربری',
                    align: 'start',
                    sortable: true,
                    value: 'user_profile.user.username',
                },
                {
                    text: 'نمره',
                    align: 'start',
                    sortable: true,
                    value: 'score',
                },
                {
                    text: 'عملیات',
                    align: 'start',
                    sortable: true,
                    value: 'user.actions',
                },
            ],
        }
    }
}
</script>

<style scoped>

</style>
