import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../model/user.entity";
import {ObjectID, Repository, TreeRepository} from "typeorm";
import {ApiException} from "../exceptions/api.exception";
import {Group} from "../model/group.entity";
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        @InjectRepository(User) private readonly treeRepository: TreeRepository<User>
    ) {}

    async create(email, password, groupName='user', parent=null): Promise<User> {
        let candidate = await this.userRepository.findOne({email: email});
        if(candidate) {
            throw ApiException.warning(`Пользователь с E-Mail ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);

        //--- создадим группу<Group> - по умолчанию группа user
        let group = await this.addGroup(groupName);
        group = await this.groupRepository.save(group);

        //--- создадим пользователя
        let user = new User();
        user.email = email;
        user.password = hashPassword;
        user.isActivated = false;
        if(parent)
            user.parent = await this.userRepository.findOne(parent);

        user.groups = [group];
        user = await this.userRepository.save(user);
        //---
        return user;
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findTreeAll(): Promise<User[]> {
        return await this.treeRepository.findTrees();
    }

    async findOne(id: ObjectID): Promise<User> {
        const user = await this.userRepository.findOne(id);
        if(!user) {
            throw ApiException.warning(`Пользователь с ID ${id} не найден`);
        }
        //---
        return user;
    }

    async findTreeOne(id: ObjectID): Promise<User> {
        const user = await this.userRepository.findOne(id);
        if(!user) {
            throw ApiException.warning(`Пользователь с ID ${id} не найден`);
        }
        return await this.treeRepository.findDescendantsTree(user);
    }

    async delete(id: ObjectID): Promise<ObjectID> {
        const result = await this.userRepository.delete(id);
        if(result.affected === 0) {
            throw ApiException.warning(`Пользователь с ID: \'${id}\' не найден`);
        }
        //---
        return id;
    }

    async update(id, email, isActivated, groups, parent): Promise<User> {
        if(id === undefined)
            throw ApiException.warning(`Для редактирования не указан ID`);

        const user = await this.userRepository.findOne(id);
        if(!user) {
            throw ApiException.warning(`Пользователь с ID: \'${id}\' не существует`);
        }

        try {
            user.email = email || user.email;
            user.isActivated = isActivated || user.isActivated;

            if(parent)
                user.parent = await this.userRepository.findOne(parent);

            if(groups.length > 0) {
                // очистка user.groups[]
                user.groups.splice(0, user.groups.length);

                //--- добавление из groups в user.groups
                for(let k in groups)
                    user.groups.push(await this.addGroup(groups[k].name));
            }
            await this.userRepository.save(user);
        } catch (e) {
            throw ApiException.forbidden(e);
        }
        //---
        return user;
    }

    private async addGroup(name: string): Promise<Group> {
        let group = await this.groupRepository.findOne({name: name});
        if(!group) {    // если группа не найдена то создадим
            group = new Group();
            group.name = name;
            group = await this.groupRepository.save(group);
        }
        return group;
    }
}