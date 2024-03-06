const userResponse = {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
};

exports.userResponse = userResponse;