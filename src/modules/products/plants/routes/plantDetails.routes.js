const { prisma } = require("../../../../config/prisma.config");
const { v4: uuidv4 } = require("uuid");

class PlantFertilizerScheduleRepository {
    // Centralized base select to avoid repetition
    static baseSelect = {
        fertilizerEntryId: true,
        applicationFrequency: true,
        applicationMethod: true,
        applicationSeason: true,
        applicationTime: true,
        benefits: true,
        dosageAmount: true,
        safetyNotes: true,
        fertilizer: {
            select: {
                fertilizerId: true,
                name: true,
                type: true,
                composition: true,
                description: true,
                caution: true,
                isEcoFriendly: true
            }
        },
        PlantSizeProfile: {
            select: {
                plantSizeId: true,
                plantSize: true,
                height: true,
                weight: true
            }
        }
    };

    // Create a new fertilizer schedule entry
    static async create(data) {
        return await prisma.plantFertilizerSchedule.create({
            data: {
                fertilizerEntryId: uuidv4(),
                ...data
            },
            select: this.baseSelect
        });
    }

    // Find a schedule by its UUID
    static async findById(id) {
        return await prisma.plantFertilizerSchedule.findFirst({
            where: { fertilizerEntryId: id, deletedAt: null },
            select: this.baseSelect
        });
    }

    // Fetch all schedules with pagination & sorting
    static async findAll({
        offset = 0,
        limit = 10,
        sortBy = "fertilizerEntryId",
        order = "asc"
    }) {
        return await prisma.plantFertilizerSchedule.findMany({
            where: { deletedAt: null },
            skip: offset,
            take: limit,
            orderBy: { [sortBy]: order },
            select: this.baseSelect
        });
    }

    // Count total fertilizer schedules
    static async countAll() {
        return await prisma.plantFertilizerSchedule.count({
            where: { deletedAt: null }
        });
    }

    // Update schedule by ID
    static async update(id, updates) {
        return await prisma.plantFertilizerSchedule.update({
            where: { fertilizerEntryId: id },
            data: updates,
            select: this.baseSelect
        });
    }

    // Soft delete schedule by ID
    static async softDelete(id) {
        return await prisma.plantFertilizerSchedule.update({
            where: { fertilizerEntryId: id },
            data: { deletedAt: new Date() },
            select: { fertilizerEntryId: true }
        });
    }

    // Find schedule by plant size + fertilizer (uniqueness check)
    static async findByPlantSizeAndFertilizer(plantSizeId, fertilizerId) {
        return await prisma.plantFertilizerSchedule.findFirst({
            where: { plantSizeId, fertilizerId, deletedAt: null },
            select: this.baseSelect
        });
    }

    // Find all schedules for a given plant size
    static async findByPlantSizeId(plantSizeId) {
        return await prisma.plantFertilizerSchedule.findMany({
            where: { plantSizeId, deletedAt: null },
            select: this.baseSelect
        });
    }
}

module.exports = PlantFertilizerScheduleRepository;
