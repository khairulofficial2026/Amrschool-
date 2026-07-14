// ---- কনফিগ ----
// META_COLUMNS: এগুলো বিষয় (subject) হিসেবে গণ্য হবে না, বাকি সব কলাম বিষয় হিসেবে দেখানো হবে
const META_COLUMNS = ["class", "roll", "name", "father", "father name", "remarks", "gpa", "result"];

let allRows = [];

const classSelect = document.getElementById("classSelect");
const rollInput   = document.getElementById("rollInput");
const searchBtn   = document.getElementById("searchBtn");
const statusMsg   = document.getElementById("statusMsg");
const resultCard  = document.getElementById("resultCard");
const printBtn    = document.getElementById("printBtn");

const BN_DIGITS = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
const BN_MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];

function toBnDigits(str){
  return String(str).replace(/[0-9]/g, d => BN_DIGITS[d]);
}

function norm(key){
  return String(key || "").trim().toLowerCase();
}

// বাংলাদেশ গ্রেডিং সিস্টেম অনুযায়ী গ্রেড হিসাব
function gradeFromPercent(pct){
  if(pct >= 80) return {grade:"A+", point:5.00};
  if(pct >= 70) return {grade:"A",  point:4.00};
  if(pct >= 60) return {grade:"A-", point:3.50};
  if(pct >= 50) return {grade:"B",  point:3.00};
  if(pct >= 40) return {grade:"C",  point:2.00};
  if(pct >= 33) return {grade:"D",  point:1.00};
  return {grade:"F", point:0.00};
}

function loadData(){
  if(!SHEET_CSV_URL || SHEET_CSV_URL.includes("PASTE_YOUR")){
    classSelect.innerHTML = `<option value="">⚠️ config.js এ শীট লিংক বসান</option>`;
    return;
  }

  Papa.parse(SHEET_CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results){
      allRows = results.data.map(row => {
        const clean = {};
        Object.keys(row).forEach(k => clean[norm(k)] = String(row[k] || "").trim());
        return clean;
      });
      populateClasses();
    },
    error: function(){
      classSelect.innerHTML = `<option value="">শীট লোড করা যায়নি, লিংক চেক করুন</option>`;
    }
  });
}

function populateClasses(){
  const classes = [...new Set(allRows.map(r => r["class"]).filter(Boolean))];
  if(classes.length === 0){
    classSelect.innerHTML = `<option value="">কোনো ক্লাস পাওয়া যায়নি</option>`;
    return;
  }
  classSelect.innerHTML = classes.map(c => `<option value="${c}">${c}</option>`).join("");
}

function showStatus(msg){
  statusMsg.textContent = msg;
}

function searchResult(){
  const cls = classSelect.value;
  const roll = rollInput.value.trim();

  showStatus("");

  if(!cls){ showStatus("অনুগ্রহ করে শ্রেণী নির্বাচন করুন"); return; }
  if(!roll){ showStatus("অনুগ্রহ করে রোল নম্বর দিন"); return; }

  const match = allRows.find(r =>
    norm(r["class"]) === norm(cls) && r["roll"] === roll
  );

  if(!match){
    showStatus("এই রোল নম্বরের কোনো ফলাফল পাওয়া যায়নি");
    return;
  }

  renderResult(match);
  goToResultPage();
}

function goToResultPage(){
  document.getElementById("searchPage").classList.remove("active");
  document.getElementById("resultPage").classList.add("active");
  window.scrollTo(0, 0);
}

function goToSearchPage(){
  document.getElementById("resultPage").classList.remove("active");
  document.getElementById("searchPage").classList.add("active");
  window.scrollTo(0, 0);
}

function renderResult(row){
  // স্কুলের তথ্য
  document.getElementById("schoolNameR").textContent = SCHOOL_INFO.name;
  document.getElementById("schoolAddress").textContent = SCHOOL_INFO.address;
  document.getElementById("schoolEmail").textContent = SCHOOL_INFO.email;
  document.getElementById("schoolEstd").textContent = toBnDigits(SCHOOL_INFO.established);

  // স্টুডেন্ট তথ্য
  document.getElementById("studentName").textContent = row["name"] || "-";
  document.getElementById("infoClass").textContent = row["class"] || "-";
  document.getElementById("infoRoll").textContent = toBnDigits(row["roll"] || "-");

  // মার্কস টেবিল
  const marksBody = document.getElementById("marksBody");
  marksBody.innerHTML = "";

  let totalObtained = 0, totalMax = 0, totalPoints = 0, subjectCount = 0, anyFail = false;

  Object.keys(row).forEach(key => {
    if(META_COLUMNS.includes(key) || !key) return;
    const obtained = parseFloat(row[key]);
    if(isNaN(obtained)) return;

    const max = MAX_MARKS_PER_SUBJECT;
    const pct = (obtained / max) * 100;
    const { grade, point } = gradeFromPercent(pct);
    const subjResult = pct >= 33 ? "PASS" : "FAIL";
    if(subjResult === "FAIL") anyFail = true;

    totalObtained += obtained;
    totalMax += max;
    totalPoints += point;
    subjectCount++;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${SUBJECT_LABELS[key] || key}</td>
      <td>${max}</td>
      <td><b>${obtained}</b></td>
      <td>${pct.toFixed(0)}%</td>
      <td>${grade}</td>
      <td class="${subjResult === 'PASS' ? 'cell-pass' : 'cell-fail'}">${subjResult}</td>
    `;
    marksBody.appendChild(tr);
  });

  // GRAND TOTAL
  const overallPct = subjectCount ? (totalObtained / totalMax) * 100 : 0;
  const overallGradeObj = gradeFromPercent(overallPct);
  const overallResult = anyFail ? "FAILED" : "PASSED";

  document.getElementById("grandTotalRow").innerHTML = `
    <td>GRAND TOTAL:</td>
    <td>${totalMax}</td>
    <td>${totalObtained} (${toBnDigits(totalObtained)})</td>
    <td>${overallPct.toFixed(0)}%</td>
    <td>${overallGradeObj.grade}</td>
    <td class="${overallResult === 'PASSED' ? 'cell-pass' : 'cell-fail'}">${overallResult}</td>
  `;

  // স্ট্যাম্প
  const stamp = document.getElementById("stampBadge");
  stamp.className = "stamp " + (overallResult === "PASSED" ? "pass" : "fail");
  document.getElementById("stampText").textContent = overallResult;

  // মন্তব্য
  document.getElementById("remarksText").textContent = row["remarks"] || (overallResult === "PASSED" ? "চমৎকার ফলাফল! নিয়মিত ক্লাসে উপস্থিত থাকবে।" : "আরও ভালো করার চেষ্টা করবে।");

  // ইস্যুর তারিখ ও সময়
  const now = new Date();
  const dateStr = `${toBnDigits(now.getDate())} ${BN_MONTHS[now.getMonth()]}, ${toBnDigits(now.getFullYear())}`;
  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const timeStr = `${toBnDigits(String(hours).padStart(2,"0"))}:${toBnDigits(String(now.getMinutes()).padStart(2,"0"))}:${toBnDigits(String(now.getSeconds()).padStart(2,"0"))} ${ampm}`;
  document.getElementById("issueDate").textContent = `ইস্যুর তারিখ ও সময়ঃ ${dateStr} | ${timeStr}`;
}

searchBtn.addEventListener("click", searchResult);
rollInput.addEventListener("keydown", e => { if(e.key === "Enter") searchResult(); });
printBtn.addEventListener("click", () => window.print());
document.getElementById("backBtn").addEventListener("click", goToSearchPage);

loadData();
