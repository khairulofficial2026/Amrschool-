// ---- কনফিগ ----
// META_COLUMNS: এগুলো বিষয় (subject) হিসেবে গণ্য হবে না, বাকি সব কলাম বিষয় হিসেবে দেখানো হবে
const META_COLUMNS = ["class", "roll", "name", "father", "father name", "remarks", "gpa", "result"];

let allRows = [];
let isAdminLoggedIn = false;
let currentRow = null;

const classSelect      = document.getElementById("classSelect");
const rollInput        = document.getElementById("rollInput");
const searchBtn        = document.getElementById("searchBtn");
const statusMsg        = document.getElementById("statusMsg");
const printBtn          = document.getElementById("printBtn");
const downloadBtn       = document.getElementById("downloadBtn");
const downloadStatus    = document.getElementById("downloadStatus");
const reportContainer   = document.getElementById("reportContainer");

const adminBackBtn     = document.getElementById("adminBackBtn");
const adminLogin       = document.getElementById("adminLogin");
const adminControls    = document.getElementById("adminControls");
const adminPassword    = document.getElementById("adminPassword");
const adminLoginBtn    = document.getElementById("adminLoginBtn");
const adminLoginMsg    = document.getElementById("adminLoginMsg");
const adminClassSelect = document.getElementById("adminClassSelect");
const adminPrintBtn    = document.getElementById("adminPrintBtn");
const adminStatusMsg   = document.getElementById("adminStatusMsg");
const adminPrintArea   = document.getElementById("adminPrintArea");

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

function issueTimestamp(){
  const now = new Date();
  const dateStr = `${toBnDigits(now.getDate())} ${BN_MONTHS[now.getMonth()]}, ${toBnDigits(now.getFullYear())}`;
  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const timeStr = `${toBnDigits(String(hours).padStart(2,"0"))}:${toBnDigits(String(now.getMinutes()).padStart(2,"0"))}:${toBnDigits(String(now.getSeconds()).padStart(2,"0"))} ${ampm}`;
  return `${dateStr} | ${timeStr}`;
}

// ---- একজন স্টুডেন্টের জন্য পুরো রিপোর্ট কার্ডের HTML তৈরি করে ----
function buildReportCardHTML(row){
  let totalObtained = 0, totalMax = 0, subjectCount = 0, anyFail = false;
  let subjectRowsHTML = "";

  Object.keys(row).forEach(key => {
    if(META_COLUMNS.includes(key) || !key) return;
    const obtained = parseFloat(row[key]);
    if(isNaN(obtained)) return;

    const max = MAX_MARKS_PER_SUBJECT;
    const pct = (obtained / max) * 100;
    const { grade } = gradeFromPercent(pct);
    const subjResult = pct >= 33 ? "PASS" : "FAIL";
    if(subjResult === "FAIL") anyFail = true;

    totalObtained += obtained;
    totalMax += max;
    subjectCount++;

    subjectRowsHTML += `
      <tr>
        <td>${SUBJECT_LABELS[key] || key}</td>
        <td>${max}</td>
        <td><b>${obtained}</b></td>
        <td>${pct.toFixed(0)}%</td>
        <td>${grade}</td>
        <td class="${subjResult === 'PASS' ? 'cell-pass' : 'cell-fail'}">${subjResult}</td>
      </tr>`;
  });

  const overallPct = subjectCount ? (totalObtained / totalMax) * 100 : 0;
  const overallGradeObj = gradeFromPercent(overallPct);
  const overallResult = anyFail ? "FAILED" : "PASSED";
  const remarks = row["remarks"] || (overallResult === "PASSED" ? "চমৎকার ফলাফল! নিয়মিত ক্লাসে উপস্থিত থাকবে।" : "আরও ভালো করার চেষ্টা করবে।");

  return `
    <div class="report-outer">
      <div class="report-inner">
        <div class="report-header">
          <h2>${SCHOOL_INFO.name}</h2>
          <p class="report-address">📍 ${SCHOOL_INFO.address} &nbsp;|&nbsp; ✉ ${SCHOOL_INFO.email}</p>
          <p class="report-meta">স্থাপিতঃ ${toBnDigits(SCHOOL_INFO.established)} খ্রি. | বার্ষিক পরীক্ষার অগ্রগতি প্রতিবেদন</p>
        </div>

        <div class="stamp ${overallResult === 'PASSED' ? 'pass' : 'fail'}">
          <span>RESULT</span>
          <strong>${overallResult}</strong>
        </div>

        <div class="student-block">
          <div class="student-row"><span>নাম (Name):</span><b>${row["name"] || "-"}</b></div>
          <div class="student-row"><span>শ্রেণী (Class):</span><b>${row["class"] || "-"}</b></div>
          <div class="student-row"><span>রোল (Roll No):</span><b>${toBnDigits(row["roll"] || "-")}</b></div>
        </div>

        <table class="marks-table">
          <thead>
            <tr><th>SUBJECT</th><th>MAX MARKS</th><th>OBTAINED</th><th>PERCENTAGE</th><th>GRADE</th><th>RESULT</th></tr>
          </thead>
          <tbody>${subjectRowsHTML}</tbody>
          <tfoot>
            <tr>
              <td>GRAND TOTAL:</td>
              <td>${totalMax}</td>
              <td>${totalObtained} (${toBnDigits(totalObtained)})</td>
              <td>${overallPct.toFixed(0)}%</td>
              <td>${overallGradeObj.grade}</td>
              <td class="${overallResult === 'PASSED' ? 'cell-pass' : 'cell-fail'}">${overallResult}</td>
            </tr>
          </tfoot>
        </table>

        <div class="remarks-box">
          <span>মন্তব্য (Remarks):</span> <em>${remarks}</em>
        </div>

        <div class="sign-row">
          <div><span class="sign-line"></span>অভিভাবকের স্বাক্ষর</div>
          <div><span class="sign-line"></span>শ্রেণী শিক্ষকের স্বাক্ষর</div>
          <div><span class="sign-line"></span>প্রধান শিক্ষকের স্বাক্ষর</div>
        </div>

        <div class="report-footer">
          <span>এই রিপোর্ট কার্ডটি ডিজিটালভাবে তৈরি করা হয়েছে।</span>
          <span>ইস্যুর তারিখ ও সময়ঃ ${issueTimestamp()}</span>
        </div>
      </div>
    </div>`;
}

// ============ ডেটা লোড (একাধিক শীট থেকে) ============
function parseOneSheet(url){
  return new Promise((resolve) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function(results){
        const rows = results.data.map(row => {
          const clean = {};
          Object.keys(row).forEach(k => clean[norm(k)] = String(row[k] || "").trim());
          return clean;
        });
        resolve(rows);
      },
      error: function(){
        resolve([]); // এই শীটে সমস্যা হলে বাকিগুলো লোড হতে থাকুক
      }
    });
  });
}

async function loadData(){
  const validUrls = (SHEET_CSV_URLS || []).filter(u => u && !u.includes("PASTE_"));

  if(validUrls.length === 0){
    classSelect.innerHTML = `<option value="">⚠️ config.js এ শীট লিংক বসান</option>`;
    return;
  }

  classSelect.innerHTML = `<option value="">লোড হচ্ছে...</option>`;

  const results = await Promise.all(validUrls.map(parseOneSheet));
  allRows = results.flat();

  if(allRows.length === 0){
    classSelect.innerHTML = `<option value="">শীট লোড করা যায়নি, লিংক চেক করুন</option>`;
    return;
  }

  populateClasses(classSelect);
  populateClasses(adminClassSelect, true);
}

function populateClasses(selectEl, includeAllOption){
  const classes = [...new Set(allRows.map(r => r["class"]).filter(Boolean))];
  if(classes.length === 0){
    selectEl.innerHTML = `<option value="">কোনো ক্লাস পাওয়া যায়নি</option>`;
    return;
  }
  let optionsHTML = classes.map(c => `<option value="${c}">${c}</option>`).join("");
  if(includeAllOption){
    optionsHTML = `<option value="__all__">সব ক্লাস</option>` + optionsHTML;
  }
  selectEl.innerHTML = optionsHTML;
}

function showStatus(msg){
  statusMsg.textContent = msg;
}

// ============ একক শিক্ষার্থী সার্চ ============
function searchResult(){
  const cls = classSelect.value;
  const roll = rollInput.value.trim();

  showStatus("");

  if(!cls){ showStatus("অনুগ্রহ করে শ্রেণী নির্বাচন করুন"); return; }
  if(!roll){ showStatus("অনুগ্রহ করে রোল নম্বর দিন"); return; }

  const match = allRows.find(r => norm(r["class"]) === norm(cls) && r["roll"] === roll);

  if(!match){
    showStatus("এই রোল নম্বরের কোনো ফলাফল পাওয়া যায়নি");
    return;
  }

  currentRow = match;
  reportContainer.innerHTML = buildReportCardHTML(match);
  goToPage("resultPage");
}

// ============ পেইজ নেভিগেশন ============
function goToPage(pageId){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);
}

// ============ এডমিন প্যানেল ============
function adminLogin_check(){
  const entered = adminPassword.value.trim();
  if(entered === ADMIN_PASSWORD){
    isAdminLoggedIn = true;
    adminLogin.classList.add("hidden");
    adminControls.classList.remove("hidden");
    adminLoginMsg.textContent = "";
  } else {
    adminLoginMsg.textContent = "ভুল পাসওয়ার্ড";
  }
}

function adminPrintAll(){
  const cls = adminClassSelect.value;
  if(!cls){ adminStatusMsg.textContent = "অনুগ্রহ করে শ্রেণী নির্বাচন করুন"; return; }

  const rows = cls === "__all__"
    ? allRows
    : allRows.filter(r => norm(r["class"]) === norm(cls));

  if(rows.length === 0){
    adminStatusMsg.textContent = "এই ক্লাসে কোনো শিক্ষার্থী পাওয়া যায়নি";
    adminPrintArea.innerHTML = "";
    return;
  }

  adminStatusMsg.textContent = `${toBnDigits(rows.length)} টি রেজাল্ট কার্ড তৈরি হয়েছে — প্রিন্ট ডায়ালগ খুলছে...`;
  adminPrintArea.innerHTML = rows.map(row => `<div class="print-page">${buildReportCardHTML(row)}</div>`).join("");

  setTimeout(() => window.print(), 300);
}

// ============ নিজের রেজাল্ট কার্ড PDF ডাউনলোড ============
async function downloadCurrentReportPDF(){
  if(!currentRow){ return; }

  downloadBtn.disabled = true;
  downloadStatus.style.color = "var(--muted)";
  downloadStatus.textContent = "PDF তৈরি হচ্ছে, একটু অপেক্ষা করুন...";

  try{
    const target = reportContainer.querySelector(".report-outer");
    const canvas = await html2canvas(target, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

    const name = (currentRow["name"] || "student").replace(/[^\w\u0980-\u09FF]+/g, "_");
    const roll = currentRow["roll"] || "";
    pdf.save(`${name}_Roll-${roll}_Result.pdf`);

    downloadStatus.textContent = "✅ ডাউনলোড সম্পন্ন হয়েছে!";
  } catch(err){
    downloadStatus.style.color = "var(--red)";
    downloadStatus.textContent = "দুঃখিত, PDF তৈরি করা যায়নি। আবার চেষ্টা করুন।";
  } finally {
    downloadBtn.disabled = false;
  }
}

// ============ ইভেন্ট লিসেনার ============
searchBtn.addEventListener("click", searchResult);
rollInput.addEventListener("keydown", e => { if(e.key === "Enter") searchResult(); });
printBtn.addEventListener("click", () => window.print());
downloadBtn.addEventListener("click", downloadCurrentReportPDF);
document.getElementById("backBtn").addEventListener("click", () => goToPage("searchPage"));

adminBackBtn.addEventListener("click", () => {
  history.replaceState(null, "", window.location.pathname);
  goToPage("searchPage");
});
adminLoginBtn.addEventListener("click", adminLogin_check);
adminPassword.addEventListener("keydown", e => { if(e.key === "Enter") adminLogin_check(); });
adminPrintBtn.addEventListener("click", adminPrintAll);

// গোপন এডমিন এন্ট্রি: ইউআরএল এর শেষে #admin জুড়ে দিলে এডমিন পেইজ খুলবে
// কোনো দৃশ্যমান বাটন বা লিংক নেই
function checkSecretAdminEntry(){
  if(window.location.hash === "#admin"){
    goToPage("adminPage");
  }
}
window.addEventListener("hashchange", checkSecretAdminEntry);
checkSecretAdminEntry();

loadData();
