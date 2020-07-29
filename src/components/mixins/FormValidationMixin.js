export default  {
    methods: {
        isObject(candidObject){
            return candidObject && candidObject.constructor === Object
        },
        saveCurrentValues (rawFormData) {
            for (let key in rawFormData){
                if (this.isObject(rawFormData[key].value))
                    this.saveCurrentValues(rawFormData[key].value)
                else
                    rawFormData[key].saved_value = rawFormData[key].value;
            }
        },
        isChanged(rawFormData) {

            for (let key in rawFormData){
                if (this.isObject(rawFormData[key].value)) {
                    if (this.isChanged(rawFormData[key].value))
                        return true
                }
                if (rawFormData[key].saved_value !== rawFormData[key].value)
                    return true
            }

            return false;
        },
        clearRawForm(rawFormData) {
            let _cleared = {}
            for (let key in rawFormData){
                if (this.isObject(rawFormData[key].value))
                    _cleared[key] = this.clearRawForm(rawFormData[key].value)
                else
                    _cleared[key] = rawFormData[key].value
            }

            return _cleared;
        },
        clearFormErrors(rawFormData){
            for (let key in rawFormData){
                if (this.isObject(rawFormData[key].value))
                    this.clearFormErrors(rawFormData[key].value)
                rawFormData[key].errors = []
            }
        },
        setErrors(rawFormData, err){
            this.clearFormErrors(rawFormData);
            if (err && err.response && err.response.data) {
                for (let key in err.response.data) {
                    if (key === 'non_field_errors') {
                        for (let _err in err.response.data[key])
                            this.$toasted.error(err.response.data[key][_err])
                    }
                    for (let _err in err.response.data[key]) {
                        rawFormData[key].errors.push(err.response.data[key][_err])
                    }
                }
            }
        },
        bindToDate(rawFormData, data) {
            // set form fields according to the given date
            for (let key in rawFormData){
                if (this.isObject(rawFormData[key].value))
                    this.bindToDate(rawFormData[key], data[key]);
                rawFormData[key].value = data[key];
                rawFormData[key].saved_value = data[key];
            }
        }
    }
}