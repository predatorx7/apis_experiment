import * as child_process from 'child_process';

export const getRevision = () => {
    try {
        const revision = child_process.execSync('git rev-parse HEAD').toString().trim()
        return revision;
    } catch (error) {
        return '';
    }
};