export default  {
    methods: {
        isObject(candidObject){
            return candidObject && candidObject.constructor === Object
        },
        clearRawForm(rawFormData) {
            let _class = {}
            for (let key in rawFormData){
                if (this.isObject(rawFormData[key].value))
                    _class[key] = this.clearRawForm(rawFormData[key].value)
                else
                    _class[key] = rawFormData[key].value
            }

            return _class;
        },
        clearFormErrors(rawFormData){
            for (let key in rawFormData){
                if (this.isObject(rawFormData[key].value))
                    this.clearFormErrors(rawFormData[key].value)
                rawFormData[key].errors = []
            }
        },
        setErrors(rawFormData, err){
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
        }
    }
}