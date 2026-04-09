

export const questionColumns = [
  {
    key: "QuestionId",
    title: "ID"
  },
  {
    key: "QuestionPreview",
    title: "Question",
    render: (row) => row.QuestionPreview || "—"
  },
  {
    key: "TopicName",
    title: "Topic"
  },
  {
    key: "TypeName",
    title: "Type",
    render: (row) => row.TypeName || "—"
  },
  {
    key: "Difficulty",
    title: "Difficulty",
    render: (row) => row.Difficulty || "—"
  },
  {
    key: "Skills",
    title: "Skills",
    render: (row) => row.Skills || "—"
  },
  {
    key: "TotalAttempts",
    title: "Attempts"
  },
  {
    key: "Accuracy",
    title: "Accuracy",
    render: (row) => `${row.Accuracy || 0}%`
  },
  {
    key: "CreatedAt",
    title: "Created At",
    render: (row) =>
      new Date(row.CreatedAt).toLocaleDateString("vi-VN")
  }
]



export const questionColumnsOfAddExam = [
  {
    key: "QuestionId",
    title: "ID"
  },
  {
    key: "QuestionPreview",
    title: "Question",
    render: (row) => row.QuestionPreview || "—"
  },
  {
    key: "TopicName",
    title: "Topic"
  },
  {
    key: "TypeName",
    title: "Type",
    render: (row) => row.TypeName || "—"
  },
  {
    key: "Difficulty",
    title: "Difficulty",
    render: (row) => row.Difficulty || "—"
  },
  {
    key: "Skills",
    title: "Skills",
    render: (row) => row.Skills || "—"
  }]

export const buildQuestionFilters = (topics = [],type=[],difficult=[],skill=[]) => [
  { key: "keyword", placeholder: "Tìm nội dung" },
  {
    key: "TopicId",
    type: "select",
    placeholder: "Chủ đề",
    options: topics },

  {
    key: "TypeId",
    type: "select",
    placeholder: "Thể loại",
    options: type
  },

  {
    key: "DifficultyId",
    type: "select",
    placeholder: "Độ khó",
    options:difficult
  },
  {
    key: "SkillId",
    type: "select",
    placeholder: "Kỹ năng",
    options:skill
  }
]