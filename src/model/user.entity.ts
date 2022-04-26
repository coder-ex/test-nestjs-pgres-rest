import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn
} from "typeorm";
import {Group} from "./group.entity";


@Entity({name: 'users'})
@Tree("closure-table", {
    closureTableName: "users_closure",
    ancestorColumnName: (column) => "ancestor_" + column.propertyName,
    descendantColumnName: (column) => "descendant_" + column.propertyName,
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 100 })
    password: string;

    @Column({ type: 'boolean', name: 'is_activated', default: false })
    isActivated: boolean;

    @CreateDateColumn({
        type: 'timestamptz',
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
        update: false
    })
    updatedAt: Date;

    @TreeChildren()
    children: User[];

    @TreeParent()
    parent: User;

    @ManyToMany(() => Group, (group) => group.users, {
        eager: true
    })
    @JoinTable()
    groups: Group[];
}