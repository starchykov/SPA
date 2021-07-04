class UserDto {
    id;
    email;
    isActivated;

    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        this.isActivated = model.isActivated || false;
    }
}

module.exports = UserDto;