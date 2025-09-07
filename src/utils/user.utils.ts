import bcrypt from 'bcrypt';
import { prisma } from '../../config/prisma.config';

const SALT_ROUNDS = 10;

async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

async function findRoleId(roleConstant) {
    const role = await prisma.role.findUnique({
        where: { role: roleConstant }
    });
    return role?.roleId;
}

export {
    findRoleId, hashPassword
};

