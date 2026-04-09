// repositories/difficultyLevel.repository.js
import prisma from "../config/db.js";

class DifficultyLevelRepository {
    async findAll() {
        return await prisma.difficultyLevels.findMany();
    }

    async findById(id) {
        return await prisma.difficultyLevels.findUnique({
            where: { DifficultyId: Number(id) }
        });
    }

    async create(data) {
        return await prisma.difficultyLevels.create({
            data: {
                LevelName: data.LevelName
            }
        });
    }

    async update(id, data) {
        return await prisma.difficultyLevels.update({
            where: { DifficultyId: Number(id) },
            data: {
                LevelName: data.LevelName
            }
        });
    }

    async delete(id) {
        return await prisma.difficultyLevels.delete({
            where: { DifficultyId: Number(id) }
        });
    }
}

export default new DifficultyLevelRepository();