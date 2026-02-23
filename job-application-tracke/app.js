let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let editIndex = null;

const form = document.getElementById("jobForm");
const table = document.getElementById("jobTable");
const companyInput = document.getElementById("company");
const positionInput = document.getElementById("position");
const dateInput = document.getElementById("date");
const statusInput = document.getElementById("status");
const submitBtn = form.querySelector("button");

const searchInput = document.getElementById("search");
const filterStatus = document.getElementById("filterStatus");

const totalEl = document.getElementById("total");
const appliedEl = document.getElementById("applied");
const interviewEl = document.getElementById("interview");
const offeredEl = document.getElementById("offered");
const rejectedEl = document.getElementById("rejected");

const feedback = document.getElementById("feedback");

// Pie chart
const ctx = document.getElementById("pieChart").getContext("2d");
let pieChart = new Chart(ctx, {
  type:'pie',
  data:{
    labels:['Applied','Interview','Offered','Rejected'],
    datasets:[{
      data:[0,0,0,0],
      backgroundColor:['#2563eb','#d97706','#16a34a','#dc2626']
    }]
  },
  options:{ responsive:true, animation:{duration:800} }
});

function showFeedback(message,color='green'){
  feedback.textContent = message;
  feedback.style.color = color;
  feedback.style.display = 'block';
  feedback.style.opacity = '1';
  setTimeout(()=>{
    feedback.style.opacity = '0';
    setTimeout(()=>{ feedback.style.display = 'none'; },500);
  },2500);
}

function updateStats(){
  const total = jobs.length;
  const appliedCount = jobs.filter(j=>j.status==='Applied').length;
  const interviewCount = jobs.filter(j=>j.status==='Interview').length;
  const offeredCount = jobs.filter(j=>j.status==='Offered').length;
  const rejectedCount = jobs.filter(j=>j.status==='Rejected').length;

  totalEl.textContent = total;
  appliedEl.textContent = appliedCount;
  interviewEl.textContent = interviewCount;
  offeredEl.textContent = offeredCount;
  rejectedEl.textContent = rejectedCount;

  // Update pie chart
  pieChart.data.datasets[0].data = [appliedCount, interviewCount, offeredCount, rejectedCount];
  pieChart.update();
}

function renderJobs(){
  let html = '';
  const searchText = searchInput.value.toLowerCase();
  const filter = filterStatus.value;

  const filteredJobs = jobs.filter(job=>{
    const matchesSearch = job.company.toLowerCase().includes(searchText) || job.position.toLowerCase().includes(searchText);
    const matchesStatus = filter==='All' || job.status===filter;
    return matchesSearch && matchesStatus;
  });

  filteredJobs.forEach((job,index)=>{
    html += `
      <tr>
        <td>${job.company}</td>
        <td>${job.position}</td>
        <td>${job.date}</td>
        <td><span class="status ${job.status.toLowerCase()}">${job.status}</span></td>
        <td>
          <button class="action-btn edit" onclick="editJob(${index})">Edit</button>
          <button class="action-btn delete" onclick="deleteJob(${index})">Delete</button>
        </td>
      </tr>
    `;
  });

  table.innerHTML = html;
  updateStats();
  localStorage.setItem('jobs',JSON.stringify(jobs));
}

form.addEventListener('submit',e=>{
  e.preventDefault();
  if(!companyInput.value || !positionInput.value || !dateInput.value){
    alert("Please fill in all fields.");
    return;
  }

  const job = { company:companyInput.value, position:positionInput.value, date:dateInput.value, status:statusInput.value };
  let isUpdate = editIndex !== null;

  if(isUpdate){
    jobs[editIndex] = job;
    editIndex = null;
    submitBtn.textContent = 'Save Application';
  } else { 
    jobs.push(job); 
  }

  form.reset();
  renderJobs();
  showFeedback(isUpdate?'Application updated successfully!':'Application saved successfully!',isUpdate?'orange':'green');
});

function editJob(index){
  const job = jobs[index];
  companyInput.value = job.company;
  positionInput.value = job.position;
  dateInput.value = job.date;
  statusInput.value = job.status;
  editIndex = index;
  submitBtn.textContent = 'Update Application';
}

function deleteJob(index){
  if(confirm("Delete this application?")){
    jobs.splice(index,1);
    renderJobs();
    showFeedback("Application deleted successfully!","red");
    if(editIndex===index){ form.reset(); editIndex=null; submitBtn.textContent='Save Application'; }
  }
}

function clearAll(){
  if(confirm("Clear all job applications?")){
    jobs=[];
    editIndex=null;
    form.reset();
    renderJobs();
    showFeedback("All applications cleared!","red");
  }
}

searchInput.addEventListener('input',renderJobs);
filterStatus.addEventListener('change',()=>{
  renderJobs();
  const selected = filterStatus.value;
  showFeedback(selected==='All'?'Showing all applications':`Filtered by status: ${selected}`,'blue');
});

renderJobs();


