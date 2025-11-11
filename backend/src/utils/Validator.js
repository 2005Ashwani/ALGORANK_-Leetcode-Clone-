const validator = require('validator');

const validate = (data) => {

    const mandatoryField = ['firstName', 'email', 'password']

    const isAllowed = mandatoryField.every((k) => Object.keys(data).includes(k))

    if (!isAllowed) {
        throw new Error("Some Field Missing");

    }

    if (!validator.isEmail(data.email)) {
        throw new Error("Invalid Email");

    }
    if (!validator.isStrongPassword(data.password)) {
        throw new Error("Weak Password");

    }


}

module.exports = validate