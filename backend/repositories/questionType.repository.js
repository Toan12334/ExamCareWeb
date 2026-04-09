// repositories/questionType.repository.js
import prisma from "../config/db.js";

class QuestionTypeRepository {
    async findAll() {
        return await prisma.questionTypes.findMany();
    }

    async findById(id) {
        return await prisma.questionTypes.findUnique({
            where: { TypeId: Number(id) }
        });
    }

    async create(data) {
        return await prisma.questionTypes.create({
            data: {
                TypeName: data.TypeName
            }
        });
    }

    async update(id, data) {
        return await prisma.questionTypes.update({
            where: { TypeId: Number(id) },
            data: {
                TypeName: data.TypeName
            }
        });
    }

    async delete(id) {
        return await prisma.questionTypes.delete({
            where: { TypeId: Number(id) }
        });
    }
}

export default new QuestionTypeRepository();