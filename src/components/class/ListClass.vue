<template>
    <div >
        <v-row>
            <v-spacer></v-spacer>
            <v-col 
                cols="6"
                md="3"
                style="text-align: center"
                >
                <v-btn
                        v-if="showAddClassBtn"
                        class="ma-auto success "
                        :to="{ name: 'Class-Add' } "
                >
                    <v-icon small left @click="alert('hi')">add</v-icon>
                    اضاف کردن کلاس جدید
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        کلاس ها
                        <v-spacer></v-spacer>
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="جست و جو"
                            single-line
                            hide-details
                        ></v-text-field>
                    </v-card-title>
                    
                    <v-data-table
                        :header-props="{
                            'sort-by-text':'مرتب سازی بر اساس',
                        }"
                        :headers="headers"
                        :items="classes"
                        :search="search"
                        :loading="!classesSet"
                        :footer-props="{
                            showFirstLastPage: true,
                            'items-per-page-text':'کلاس در صفحه',
                        }"
                        no-data-text="هنوز کلاسی اضافه نشده :("
                    >

                    <template v-slot:footer.page-text="items"> 
                        {{ items.pageStart }} - {{ items.pageStop }} از {{ items.itemsLength }} 
                    </template>
                        <template v-slot:item.teacher=" {item} ">
                            {{ item.teacher.user.first_name }} {{ item.teacher.user.last_name }}
                        </template>
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{on, attrs}">
                                <span v-bind="attrs" v-on="on">
                                    <v-icon
                                            small
                                            class="mr-2"
                                            @click="goToClass(item)"
                                            color="green"
                                    >
                                        open_in_browser
                                    </v-icon>
                                </span>
                            </template>
                            <span>
                                ورود به صفحه کلاس
                            </span>
                        </v-tooltip>
                        <template>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                <span v-bind="attrs" v-on="on">
                                    <v-icon
                                            small
                                            class="mr-2"
                                            @click="editItem(item)"
                                            color="blue"
                                    >
                                        mdi-pencil
                                    </v-icon>
                                </span>
                                </template>
                                <span>ویرایش</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                                <template v-slot:activator="{on, attrs}">
                                <span v-bind="attrs" v-on="on" >
                                     <v-icon
                                             small
                                             @click="deleteItem(item)"
                                             color="red"
                                     >
                                        mdi-delete
                                    </v-icon>
                                </span>
                                </template>
                                <span>
                                حذف
                            </span>
                            </v-tooltip>

                        </template>
                    </template>
                    </v-data-table>

                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import {mapActions} from 'vuex';

export default {
    props: {
        showAddClassBtn: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        ...mapGetters(['classes', 'classesSet'])
    },
    methods: {
        ...mapActions(['addClass', 'removeClass', 'fetchAllClasses']),
        deleteItem(item) {
            if (confirm("آیا از پاک کردن این کلاس اطمینان دارید؟")) {
                this.removeClass(item.id);
            }
        }
    },
     data() {
        return {
            rppt: "ردیف در صفحه",
            headers: [
                {
                    text: 'نام کلاس',
                    align: 'start',
                    sortable: true,
                    value: 'class_name',
                },
                 {
                    text: 'مدرس',
                    align: 'start',
                    sortable: true,
                    value: 'teacher'
                },
                {
                    text: 'تعداد دانشجو',
                    align: 'start',
                    sortable: true,
                    value: 'students_count',
                },
                {
                    text: 'عملیات',
                    align: 'start',
                    value: "actions",
                    sortable: false,
                },
            ],
            search: '',
        }
    },
    mounted() {
        this.fetchAllClasses();
    }
}
</script>