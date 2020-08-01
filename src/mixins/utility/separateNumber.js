export default {
    methods: {
        separateNumber (value) {
            if (Number.isNaN(value) || value === null) {
                return '0'
            }
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        }
    }
}
