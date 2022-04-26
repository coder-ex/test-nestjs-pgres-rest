export class UserDto {
    id;
    email;
    password;
    isActivated;

    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        this.password = model.password;
        this.isActivated = model.isActivated;
    }
}