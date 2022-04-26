import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ObjectID, Repository} from "typeorm";
import {Group} from "../model/group.entity";
import {ApiException} from "../exceptions/api.exception";
import {User} from "../model/user.entity";

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    async create(name: string): Promise<Group> {
        const candidate = await this.groupRepository.findOne({name: name})
        if(candidate) {
            throw ApiException.warning(`Группа \'${name}\' уже существует`);
        }
        const group = await this.groupRepository.save({name: name});
        return group;
    }

    async findAll(): Promise<Group[]> {
        return await this.groupRepository
            .createQueryBuilder('groups')
            .leftJoinAndSelect('groups.users', 'users')
            .getMany();
    }

    async findOne(id: ObjectID): Promise<Group> {
        const groups = await this.groupRepository
            .createQueryBuilder('groups')
            .where("groups.id = :id", {id})
            .leftJoinAndSelect('groups.users', 'users')
            .getMany();

        if(!groups[0]) {
            throw ApiException.warning(`Группа с ID \'${id}\' не найдена`);
        }
        //---
        return groups[0];
    }

    async delete(id: ObjectID): Promise<ObjectID> {
        //let result = await this.repository.delete(id);
        const groups = await this.groupRepository
            .createQueryBuilder('groups')
            .where("groups.id = :id", {id})
            .getMany()

        if(!groups[0]) {
            throw ApiException.warning(`Группа с ID \'${id}\' не найдена`);
        }

        await this.groupRepository.remove(groups)
        //---
        return id;
    }

    async update(id: ObjectID, name: string, users): Promise<Group> {
        const group = await this.groupRepository
            .createQueryBuilder('groups')
            .where("groups.id = :id", {id})
            .leftJoinAndSelect('groups.users', 'users')
            .getMany();

        try {
            //--- если группа не найдена, значит корректируем действующую
            if(!group[0])
                group[0].name = name;

            //--- если список пользователей пуст, то в группе его не правим
            if(users.length > 0) {
                group[0].users.splice(0, group[0].users.length);  // очистка group.users

                //--- добавление из groups в user.groups
                for(let k in users) {

                    let candidate = await this.userRepository.findOne({id: users[k].id});
                    if(!candidate)
                        continue;

                    group[0].users.push(candidate);
                }
            }

            await this.groupRepository.save(group[0]);
        } catch (e) {
            throw ApiException.forbidden(e);
        }
        //---
        return group[0];
    }
}