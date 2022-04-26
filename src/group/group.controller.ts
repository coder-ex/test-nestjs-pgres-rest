import {Body, Controller, Delete, Get, Param, Post} from "@nestjs/common";
import {GroupService} from "./group.service";
import {ObjectID} from "typeorm";
import {Group} from "../model/group.entity";

@Controller('/permissions')
export class GroupController {
    constructor(private service: GroupService) {}

    @Post('/create')
    create(@Body() req: {name}): Promise<Group> {
        return this.service.create(req.name);
    }

    @Get('/groups')
    findAll(): Promise<Group[]> {
        return this.service.findAll();
    }

    @Get('/group/:id')
    findOne(@Param('id') id: ObjectID) {
        return this.service.findOne(id);
    }

    @Delete('/delete/:id')
    delete(@Param('id') id: ObjectID) {
        return this.service.delete(id);
    }

    @Post('/update')
    update(@Body() req: {id: ObjectID, name: string, users: []}): Promise<Group> {
        const {id, name, users} = req;
        return this.service.update(id, name, users);
    }
}