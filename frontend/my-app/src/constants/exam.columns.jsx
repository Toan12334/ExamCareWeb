import { Switch } from "antd";
import { Dices  } from "lucide-react";
import Button from "../components/ui/Button.jsx";

export const examColumn = (handleToggle,handleRandom) => [
  {
    key: "ExamId",
    title: "ID"
  },
  {
    key: "ExamName",
    title: "Tên bài thi"
  },
  {
    key: "Duration",
    title: "Thời gian làm bài"
  },
  {
    key: "IsActive",
    title: "Trạng thái",
    render: (row) => (
      <Switch
        checked={row.IsActive}
        onChange={(checked) => handleToggle(row.ExamId, checked)}
      />
    ),
  },

  {
    key:"ExamCode",
    title:"Mã bài thi",
    render: (row) => (
      <Button className="bg-gray-700"
      onClick={()=>handleRandom(row.ExamId)} >
        <Dices/>
      </Button>
    ),
  }
];


export const buildExamFilters = [
  { key: "search", placeholder: "Tìm bài thi..." }]

export const buidExamFilterAddQuestion = (
  topics = [],
  skills = [],
  difficults = []
) => [
    {
      name: "search",
      type: "text",
      placeholder: "Tìm nội dung câu hỏi",
    },
    {
      name: "topicId",
      type: "select",
      placeholder: "Chủ đề",
      options: topics,
    },
    {
      name: "skillId",
      type: "select",
      placeholder: "Kĩ năng",
      options: skills,
    },
    {
      name: "difficultyLevelId",
      type: "select",
      placeholder: "Độ khó",
      options: difficults,
    },
  ];