<template>
    <span>
        <v-container>
            <v-row>
                <v-col cols="12">
                    {{ label }}
                    <v-btn icon link>
                        <v-icon :id="activatorId">mdi-calendar-range</v-icon>
                    </v-btn>
                    <template v-if="displayDateMoment != null">
                        <span class="">
                            {{ displayDateMoment.format('dddd jDD jMMMM jYYYY ساعت HH:mm') }}
                        </span>

                </template>

                    <date-picker
                            :element="activatorId"
                            :min="min"
                            :placeholder="label"
                            @change="dateChanged"
                            display-format="jDD jMMMM jYYYY - HH:mm"
                            format="YYYY-MM-DDTHH:mm:ss"
                            type="datetime"
                            v-model="value_"
                            local="fa"
                            :timezone="true"

                    />
                </v-col>
            </v-row>
            <v-row class="my-n5 red--text" v-for="error in errors" :key="error">
                <v-col cols="12">
                    {{ error }}
                </v-col>
            </v-row>
        </v-container>
    </span>
</template>

<script>
    import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
    import moment from 'jalali-moment'

    export default {
        components: {
            datePicker: VuePersianDatetimePicker
        },
        name: "MyDatePicker.vue",
        props: [
            'activatorId',
            'min',
            'label',
            'value',
            'errors'
        ],
        methods: {
            dateChanged($event) {
                this.dateMoment = $event;
                this.$emit('change', this.dateMoment);
                this.$emit('input', this.value_);
            },
        },
        watch: {
            value(_value)  {

                this.value_ = _value;

                if (this.value_) {
                    if (this.value_[this.value_.length - 1] !== 'Z')
                        this.value_ += 'Z';
                    this.displayDateMoment = moment(new Date(this.value_));
                }
            }
        },

        data() {
            return {
                dateMoment: null,
                displayDateMoment: null,    // this is tz aware
                value_: ''
            }
        },
    }
</script>

<style scoped>

</style>