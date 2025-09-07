import { v4 as uuidv4 } from 'uuid';
import * as ENTITY_PREFIX from '../constants/prefix.constant';

async function generateCustomId(tx, entityKey) {
    const entityCode = ENTITY_PREFIX[entityKey];
    if (!entityCode) throw new Error(`Unknown entityKey: ${entityKey}`);

    const year = new Date().getFullYear() % 100; // e.g., 25 for 2025
    const uuid = uuidv4().replace(/-/g, "").toUpperCase();
    const prefixLength = entityCode.length;

    // Determine how many characters to use from UUID
    const uuidLength = prefixLength === 4 ? 7 : 8;
    const uuidPart = uuid.slice(0, uuidLength);

    const tracker = await tx.serialTracker.upsert({
        where: {
            entityCode_year: {
                entityCode,
                year
            }
        },
        update: {
            lastSerial: { increment: 1 }
        },
        create: {
            entityCode,
            year,
            lastSerial: 1
        }
    });

    const serialStr = String(tracker.lastSerial).padStart(4, "0");

    return `${entityCode}-${year}-${uuidPart}-${serialStr}`;
}

export default generateCustomId;
