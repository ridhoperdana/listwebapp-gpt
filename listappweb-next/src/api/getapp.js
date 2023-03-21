import { exec } from 'child_process';
import util from 'util';
// import redis from 'redis';
import { Redis } from "ioredis";

// const client = redis.createClient();
// await client.connect();
// client.get = util.promisify(client.get);
const redis = new Redis();

export async function getAppData() {
    const cacheKey = 'appData';

    // Check if the result is already in cache
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
        return JSON.parse(cachedResult);
    }

    const result = await getAppDataFromTerminal();
    // Store the result in cache for 1 hour
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
    return result;
};

export async function getAppDataFromTerminal() {
    return new Promise((resolve, reject) => {
        const child = exec('ss -tulpn | grep LISTEN');
        let buffer = '';

        child.stdout.on('data', (data) => {
            buffer += data.toString();
        });

        child.stdout.on('end', () => {
            const lines = buffer.trim().split('\n');
            const result = lines.map((line) => {
                return {line};
            });
            resolve({ props: { result } });
        });

        child.on('error', (error) => {
            reject(error);
        });
    });
};
