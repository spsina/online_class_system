<template>
    <div>
        
        <v-toolbar class="">
            <v-toolbar-title  >
                <v-icon>class</v-icon>
                <template v-if="isDataSet">
                    {{ theClass.class_name }} | 
                    <span class="h6" >
                        {{ theClass.teacher.user.first_name }} {{ theClass.teacher.user.last_name }}
                    </span>
                </template>
                <template v-else>
                     <span class="error--text">
                        خطا در دریافت اطلاعات
                    </span>
                </template>
            </v-toolbar-title>
            <v-spacer>
            </v-spacer>
            <template v-if="!loading">
                <v-icon  @click="loadClassData">refresh</v-icon>
            </template>
            <template v-else>
                <v-progress-circular :indeterminate="true"></v-progress-circular>
            </template>
            
        </v-toolbar>
        <v-progress-linear indeterminate v-if="loading" >
        </v-progress-linear>

        <v-container>
            <v-row>
                <v-col cols="12" class="heading">
                    <h4>امتحانات</h4>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" >
                    <v-card>
                        <v-card-text>
                        <v-data-table
                                :header-props="{
                                    'sort-by-text':'مرتب سازی بر اساس',
                                }"
                                :headers="headers"
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
                                {{ moment(new Date(item.start_datetime)).locale('fa').format('YYYY/MM/DD ساعت hh:mm') }}
                            </template>
                            <template v-slot:item.end_datetime="{item}">        
                                {{ moment(new Date(item.end_datetime)).locale('fa').format('YYYY/MM/DD ساعت hh:mm') }}
                            </template>
                            <template v-slot:item.is_active="{item}">        
                                <template v-if="item.is_active">
                                    <v-tooltip top>
                                        <template v-slot:activator="{on, attr}">
                                            <v-icon v-bind="attr" v-on="on" 
                                            class="green--text blink">mdi-radiobox-marked</v-icon>
                                        </template>
                                        امتحان درحال برگزاری است
                                    </v-tooltip>
                                </template>
                                <template v-else>
                                    <v-tooltip top>
                                        <template v-slot:activator="{on, attr}">
                                            <v-icon v-bind="attr" v-on="on" >mdi-radiobox-marked</v-icon>
                                        </template>
                                        امتحان درحال برگزاری است
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
        </v-container>

    </div>
</template>

<script>
import ClassServices from '../../services/class.service'
import moment from 'jalali-moment'

export default {
    data() {
        return {
            search: '',
            headers: [
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
            class_id: -1,
            loading: true,
            isDataSet: false,
            theClass: {}
        }
    },
    methods: {
        moment,
        loadClassData() {
            this.loading = true;
            ClassServices.classRetrieve(this.class_id)
            .then( (response) => {
                this.theClass = response.data;
                console.log(this.theClass)
                this.loading = false;
                this.isDataSet = true;
            } )
            .catch( (err) => {
                if (err && err.response && err.response.data)
                    this.$toasted.error(err.response.data.detail)
                this.loading = false;
            } )
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