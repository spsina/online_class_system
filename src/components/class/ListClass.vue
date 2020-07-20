<template>
    <div >
        <v-row>
            
            <v-spacer></v-spacer>
            <v-col 
                cols="6"
                md="3"
                style="text-align: center"
                >
                <v-btn class="ma-auto success ">
                    <v-icon small left>add</v-icon>
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
                        :headers="headers"
                        :items="classes"
                        :search="search"
                        :loading="loading"
                        :footer-props="{
                            'pageText': 'sadf',
                            showFirstLastPage: true,
                            'items-per-page-text':'کلاس در صفحه',
                        }"
                        no-data-text="هنوز کلاسی اضافه نشده :("
                    >

                    <template v-slot:footer.page-text="items"> 
                        {{ items.pageStart }} - {{ items.pageStop }} از {{ items.itemsLength }} 
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-icon
                            small
                            class="mr-2"
                            @click="editItem(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteItem(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                    </v-data-table>

                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rppt: "ردیف در صفحه",
            classes: [
                {
                    class_name: 'برنامه نویسی وب',
                    teacher: 'علی پرویزی',
                    students_count: 15
                },
                {
                    class_name: 'برنامه نویسی وب',
                    teacher: 'علی پرویزی',
                    students_count: 15
                },
                {
                    class_name: 'برنامه نویسی وب',
                    teacher: 'علی پرویزی',
                    students_count: 15
                },
                {
                    class_name: 'برنامه نویسی وب',
                    teacher: 'علی پرویزی',
                    students_count: 15
                },
                {
                    class_name: 'برنامه نویسی وب',
                    teacher: 'علی پرویزی',
                    students_count: 15
                },
                {
                    class_name: 'برنامه نویسی وب',
                    teacher: 'علی پرویزی',
                    students_count: 15
                }
            ],
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
                    value: 'teacher',
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
            loading: false
        }
    },
    mounted() {
    }
}
</script>