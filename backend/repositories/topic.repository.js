import prisma from "../config/db.js"

class TopicRepository {

  async getAll() {
    return await prisma.topics.findMany({
      orderBy: {
        TopicId: "asc"
      }
    })
  }

  async getById(id) {
    return await prisma.topics.findUnique({
      where: {
        TopicId: Number(id)
      }
    })
  }

  async create(data) {
    return await prisma.topics.create({
      data: {
        TopicName: data.TopicName
      }
    })
  }

  async update(id, data) {
    return await prisma.topics.update({
      where: {
        TopicId: Number(id)
      },
      data: {
        TopicName: data.TopicName
      }
    })
  }

  async delete(id) {
    return await prisma.topics.delete({
      where: {
        TopicId: Number(id)
      }
    })
  }

  async getTopicsWithQuestionCount() {
    return await prisma.topics.findMany({
      select: {
        TopicId: true,
        TopicName: true,
        _count: {
          select: {
            Questions: true
          }
        }
      },
      orderBy: {
        TopicId: "asc"
      }
    })
  }

  async getByName(name) {
    return await prisma.topics.findFirst({
      where: {
        TopicName: name
      }
    })
  }

  async searchByName(keyword) {
    return await prisma.topics.findMany({
      where: {
        TopicName: {
          contains: keyword,
        }
      },
      select: {
        TopicId: true,
        TopicName: true,
        _count: {
          select: {
            Questions: true
          }
        }
      },
      orderBy: {
        TopicName: "asc"
      }
    })
  }

}

export default new TopicRepository()