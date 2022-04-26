import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Group} from "../model/group.entity";
import {GroupController} from "./group.controller";
import {GroupService} from "./group.service";
import {User} from "../model/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Group]),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [GroupController],
    providers: [GroupService],
    exports: [GroupService]
})
export class GroupModule {}