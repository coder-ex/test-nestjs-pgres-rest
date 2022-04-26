import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";

@Entity({name: 'groups'})
export class Group {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ManyToMany(() => User, (user) => user.groups)
    users: User[]
}
