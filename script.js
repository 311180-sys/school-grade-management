const STORAGE_KEY = 'student-grade-list';

const nameInput = document.getElementById('nameInput');
const scoreInput = document.getElementById('scoreInput');
const searchInput = document.getElementById('searchInput');
const addBtn = document.getElementById('addBtn');
const searchBtn = document.getElementById('searchBtn');
const showAllBtn = document.getElementById('showAllBtn');
const averageBtn = document.getElementById('averageBtn');
const averageScore = document.getElementById('averageScore');
const studentTableBody = document.getElementById('studentTableBody');

// 用 array 存放學生資料
let students = loadStudents();

// 從 localStorage 讀取資料
function loadStudents() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error('讀取資料失敗：', error);
    return [];
  }
}

// 儲存資料到 localStorage
function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// 計算平均成績
function calculateAverage(list) {
  if (list.length === 0) return 0;
  const total = list.reduce((sum, student) => sum + Number(student.score), 0);
  return total / list.length;
}

// 把資料重新渲染到畫面上
function renderTable(filterText = '') {
  const keyword = filterText.trim().toLowerCase();

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(keyword)
  );

  studentTableBody.innerHTML = '';

  if (filteredStudents.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td colspan="3">沒有符合搜尋條件的學生</td>
    `;
    studentTableBody.appendChild(row);
    return;
  }

  filteredStudents.forEach((student) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.score}</td>
      <td><button class="delete-btn" data-id="${student.id}">刪除</button></td>
    `;
    studentTableBody.appendChild(row);
  });
}

// 更新平均成績顯示
function updateAverage() {
  const avg = calculateAverage(students);
  averageScore.textContent = avg ? avg.toFixed(1) : '--';
}

// 重新整理畫面
function render() {
  renderTable(searchInput.value);
  updateAverage();
}

// 新增學生
function addStudent() {
  const name = nameInput.value.trim();
  const scoreText = scoreInput.value.trim();
  const score = Number(scoreText);

  if (!name) {
    alert('請輸入學生姓名');
    return;
  }

  if (scoreText === '' || Number.isNaN(score)) {
    alert('請輸入有效的成績');
    return;
  }

  if (score < 0 || score > 100) {
    alert('成績請輸入 0 到 100 之間');
    return;
  }

  students.push({
    id: Date.now(),
    name,
    score,
  });

  saveStudents();
  nameInput.value = '';
  scoreInput.value = '';
  render();
}

// 刪除學生
function deleteStudent(id) {
  students = students.filter((student) => student.id !== id);
  saveStudents();
  render();
}

// 事件綁定
addBtn.addEventListener('click', addStudent);
searchInput.addEventListener('input', () => {
  renderTable(searchInput.value);
});
searchBtn.addEventListener('click', () => {
  renderTable(searchInput.value);
});
showAllBtn.addEventListener('click', () => {
  searchInput.value = '';
  render();
});
averageBtn.addEventListener('click', updateAverage);

studentTableBody.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-id]');
  if (!deleteButton) return;
  deleteStudent(Number(deleteButton.dataset.id));
});

// 初次載入時渲染
render();
