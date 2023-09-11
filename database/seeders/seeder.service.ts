import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { UserSeeder } from './user.seeder';

@Injectable()
export class SeederService {
    constructor(private readonly moduleRef: ModuleRef) {}

    async runSeeder(seederName: string, count = 10) {
        try {
            const instance = this.moduleRef.get(seederName);
            if (instance && typeof instance.seed === 'function') {
                await instance.seed(count);
            } else {
                console.error(`No seeder found with name: ${seederName} or it doesn't have a seed method.`);
            }
        } catch (error) {
            console.error(`Error running seeder ${seederName}:`, error);
        }
    }
}
