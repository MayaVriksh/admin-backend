import { withAccelerate } from '@prisma/extension-accelerate';
import { Prisma, PrismaClient } from '../../src/orm/generated/prisma';

const prisma = new PrismaClient().$extends(withAccelerate());

export { prisma, Prisma };

