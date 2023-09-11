interface Seeder {
    seed(count: number, ...args: any[]): Promise<void>;
}
