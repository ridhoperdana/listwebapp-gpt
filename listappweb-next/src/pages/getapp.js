import { exec } from 'child_process';

export async function getAppData() {
    return new Promise((resolve, reject) => {
        const child = exec('lsof -i | grep "LISTEN"');
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
