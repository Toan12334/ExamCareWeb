export const studentExamColumns = [
    {
        key: "StudentExamId",
        title: "ID"
    },
    {
        key: "FullName",
        title: "Họ&tên"
    },
    {
        key: "ExamName",
        title: "Tên bài thi"
    },
    {
        key: "TimeTotal",
        title: "Thời gian"
    },

    {
        key: "Score",
        title: "Điểm"
    },
    {
        key: "Status",
        title: "Trạng thái"
    }

]


const statusOptions = [
    { value: "InProgress", label: "Đang làm" },
    { value: "Submitted", label: "Đã hoàn thành" },
    { value: "not_started", label: "Chưa bắt đầu" }
  ];
  
  const rangeScoreOptions = [
    { value: "0-5", label: "0 - 5" },
    { value: "5-7", label: "5 - 7" },
    { value: "7-10", label: "7 - 10" }
  ];
  
  export const buildStudentExamFilters = (
    statusArray = statusOptions,
    rangeScoreArray = rangeScoreOptions
  ) => [
    {
      key: "search",
      type: "input",
      placeholder: "Tìm theo tên học sinh hoặc tên bài thi"
    },
    {
      key: "status",
      type: "select",
      placeholder: "Trạng thái",
      options: statusArray
    },
    {
      key: "rangeScore",
      type: "select",
      placeholder: "Khoảng điểm",
      options: rangeScoreArray
    }
  ];