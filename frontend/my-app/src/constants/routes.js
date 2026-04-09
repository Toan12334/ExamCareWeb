import { ROUTE_PREFIX } from "./routePrefix"

export const ROUTES = {
  HOME: "/",

  QUESTION_BANK: {
    TOPICS: `${ROUTE_PREFIX.QUESTION_BANK}/topics`,
    SKILLS: `${ROUTE_PREFIX.QUESTION_BANK}/skills`,
    DIFFICULTIES: `${ROUTE_PREFIX.QUESTION_BANK}/difficulties`,
    QUESTIONS: `${ROUTE_PREFIX.QUESTION_BANK}/questions`,
    QUESTIONS_WITH_QUERY: ({
      page = 1,
      limit = 10,
      search = "",
      topicId = "",
      skillId = "",
      difficultyId = "",
      typeId = "",
    } = {}) => {
      const params = new URLSearchParams({
        page,
        limit,
        search,
        topic: topicId,
        skill: skillId,
        difficulty: difficultyId,
        type: typeId,
      });

      return `${ROUTE_PREFIX.QUESTION_BANK}/questions?${params.toString()}`;
    },
    CREATEQUESTION: `${ROUTE_PREFIX.QUESTION_BANK}/create`,
    EDITQUESTION: `${ROUTE_PREFIX.QUESTION_BANK}/edit/:id`
  },

  EXAM_MANAGE: {
    EXAM_PAPER: `${ROUTE_PREFIX.EXAM}/exam-papers`,
    CREATE_EXAM: `${ROUTE_PREFIX.EXAM}/create`,
    EDIT_EXAM: `${ROUTE_PREFIX.EXAM}/edit/:id`
  },
  CUSTOMER: {
    LIST: `${ROUTE_PREFIX.CUSTOMER}`
  }
}