import {Body, Controller, Delete, Get, Param, Post} from "@nestjs/common";
import {UserService} from "./user.service";
import {User} from "../model/user.entity";
import {ObjectID} from "typeorm";
import {ApiException} from "../exceptions/api.exception";

@Controller('/auth')
export class UserController {
    constructor(private service: UserService) {}

    @Post('/create')
    create(@Body() req: {email, password, groupName, parent}): Promise<User> {
        let {email, password, groupName, parent} = req;
        return this.service.create(email, password, groupName, parent);
    }

    @Get('/users')
    findAll(): Promise<User[]> {
        return this.service.findAll();
    }

    @Get('/users/tree')
    findTreeAll(): Promise<User[]> {
        return this.service.findTreeAll();
    }

    @Get('/user/:id')
    findOne(@Param('id') id: ObjectID) {
        return this.service.findOne(id);
    }

    @Get('/user/tree/:id')
    findTreeOne(@Param('id') id: ObjectID): Promise<User> {
        return this.service.findTreeOne(id);
    }

    @Delete('/delete/:id')
    delete(@Param('id') id: ObjectID) {
        return this.service.delete(id);
    }

    @Post('/update')
    update(@Body() req: {id: ObjectID, email: string, isActivated: boolean, groups: [], parent: string}): Promise<User> {
        const {id, email, isActivated, groups, parent} = req;
        return this.service.update(id, email, isActivated, groups, parent);
    }
}