import {Module} from '@nestjs/common';
import {UserModule} from "./user/user.module";
import {GroupModule} from "./group/group.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./model/user.entity";
import {Group} from "./model/group.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            host: process.env.DATABASE_HOST,
            synchronize: true,
            entities: [
                User,
                Group
            ]
        }),
        UserModule,
        GroupModule,
    ],
})
export class AppModule {}
