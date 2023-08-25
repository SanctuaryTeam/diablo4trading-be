import {Injectable, Req, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async findById(id: number): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id } });
    }
    async findOne(discordId: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { discordId } });
    }

    async findOrCreateUser(profile: Partial<User>): Promise<User> {
        const {discordName, discordId, email, battleNetTag} = profile;

        // Check if the user already exists based on Discord ID
        let user = await this.userRepository.findOne({where: {discordId}});

        if (!user) {
            // If the user doesn't exist, create a new user with the provided information
            user = this.userRepository.create({
                discordName,
                discordId,
                email,
                battleNetTag, // Add other relevant properties here
            });

            await this.userRepository.save(user);
        }

        console.log(user);

        return user;
    }

    async validateUserFromJWT(jwtUser: User): Promise<boolean> {
        const actualUser = await this.userRepository.findOne({ where: { id: jwtUser.id } }).then(actualUser => { return actualUser });

        return (JSON.stringify(jwtUser) === JSON.stringify(actualUser))
    }
}
