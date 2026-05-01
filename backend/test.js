import prisma from "./config/db.js"

async function main() {
    const users = await prisma.students.findMany()
    console.log(users)
}

async function getAllExam() {
    const exam = await prisma.exams.findMany()
    console.log(exam)
}


const students = [
    { name: "Nguyen Van A", className: "10B" },
    { name: "Nguyen Van B", className: "10B" },
    { name: "Dao Xuan Toan", className: "10B" },
    { name: "Shark Toan", className: "10B" },
    { name: "Nguyen Van Dai", className: "10B" }
];

const keyword = "d".trim().toLowerCase();

const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(keyword)
);

if (filteredStudents.length === 0) {
    console.log("Không tìm thấy");
} else {
    console.log(filteredStudents);
}