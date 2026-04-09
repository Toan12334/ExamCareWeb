// eslint-disable-next-line no-unused-vars
import React, { useMemo, useState } from "react";
import ExamHeaderCard from "../../components/exam-builder/ExamHeaderCard";
import ExamQuestionList from "../../components/exam-builder/ExamQuestionList";
import QuestionWorkspacePanel from "../../components/exam-builder/QuestionWorkspacePanel";
import QuestionPreviewModal from "../../components/exam-builder/QuestionPreviewModal";

import {
  reorderQuestions,
  moveArrayItem,
} from "../../utils/examBuilderHelpers";

export default function ExamBuilderPage() {
  const [examQuestions, setExamQuestions] = useState([]);
  const [previewQuestion, setPreviewQuestion] = useState(null);

  const [examMeta, setExamMeta] = useState({
    title: "",
    timeLimit: 45,
  });

  const handleSaveExam = () => {
    const payload = {
      examMeta,
      questions: reorderQuestions(examQuestions),
    };
    console.log(payload);
  };

  const removeQuestion = (id) => {
    setExamQuestions((prev) =>
      reorderQuestions(prev.filter((q) => q.id !== id))
    );
  };

  const moveQuestion = (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    setExamQuestions((prev) => moveArrayItem(prev, index, newIndex));
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <ExamHeaderCard
          examMeta={examMeta}
          setExamMeta={setExamMeta}
          onSave={handleSaveExam}
          questions={examQuestions}
        />

        <ExamQuestionList
          questions={examQuestions}
          onRemove={removeQuestion}
          onMove={moveQuestion}
          onPreview={setPreviewQuestion}
        />
      </div>

      <QuestionWorkspacePanel
        onAddQuestion={(q) =>
          setExamQuestions((prev) => reorderQuestions([...prev, q]))
        }
      />

      <QuestionPreviewModal
        question={previewQuestion}
        onClose={() => setPreviewQuestion(null)}
      />
    </div>
  );
}