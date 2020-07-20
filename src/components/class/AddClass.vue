<template>
    <div>
        <v-card>
            <v-row>
                <v-col cols="12">
                    <v-card-title>
                        اضاف کردن کلاس جدید
                    </v-card-title>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" >
                    <v-form class="mx-10">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="newClass.class_name" label="عنوان کلاس" prepend-icon="title" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-autocomplete v-model="newClass.class_teacher_id" label="انتخاب مدرس کلاس"
                                    item-text="full_name"
                                    item-value="id"
                                    :items="users" prepend-icon="mdi-account-box"/>
                            </v-col>
                        </v-row>
                        <v-btn class="success">ثبت</v-btn>
                    </v-form>
                </v-col>
            </v-row>
        </v-card>
        <ListClass :show-add-class-btn="false"/>

    </div>
</template>

<script>
    import ListClass from "./ListClass";
    export default {
        props: {
            showClassList: {
                type: Boolean,
                default: true
            }
        },
        name: "AddClass",
        components: {ListClass},
        comments: {
            ListClass
        },
        data() {
            return {
                users: [
                    {
                        'id': 1,
                        'full_name': 'Sina Parvizi'
                    },
                    {
                        'id': 3,
                        'full_name': 'Amir Erfan'
                    }
                ],
                newClass: {
                    class_name: '',
                    class_teacher_id: 0
                }
            }
        }
    }
</script>

<style scoped>

</style>