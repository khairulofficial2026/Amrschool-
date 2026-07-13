// ---- কনফিগ ----
// META_COLUMNS: এগুলো বিষয় (subject) হিসেবে গণ্য হবে না, বাকি সব কলাম বিষয় হিসেবে দেখানো হবে
const META_COLUMNS = ["class", "roll", "name", "father", "father name", "gpa", "result"];

let allRows = [];

const classSelect  = document.getElementById("classSelect");
const rollInput    = document.getElementById("rollInput");
const searchBtn     = document.getElementById("searchBtn");
const statusMsg     = document.getElementById("statusMsg");
const resultCard    = document.getElementById("resultCard");

function norm(key){
  return String(key || "").trim().toLowerCase();
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

  resultCard.classList.add("hidden");
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
}

function renderResult(row){
  document.getElementById("studentName").textContent = row["name"] || "-";
  document.getElementById("infoClass").textContent = row["class"] || "-";
  document.getElementById("infoRoll").textContent = row["roll"] || "-";
  document.getElementById("infoFather").textContent = row["father name"] || row["father"] || "-";

  const resultText = row["result"] || "-";
  const resultEl = document.getElementById("infoResult");
  resultEl.textContent = resultText;
  resultEl.className = /fail|অনুত্তীর্ণ/i.test(resultText) ? "result-fail" : "result-pass";

  document.getElementById("gpaValue").textContent = row["gpa"] || "-";

  const marksBody = document.getElementById("marksBody");
  marksBody.innerHTML = "";
  Object.keys(row).forEach(key => {
    if(META_COLUMNS.includes(key)) return;
    if(!key) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${key}</td><td>${row[key] || "-"}</td>`;
    marksBody.appendChild(tr);
  });

  resultCard.classList.remove("hidden");
  resultCard.scrollIntoView({behavior:"smooth", block:"start"});
}

searchBtn.addEventListener("click", searchResult);
rollInput.addEventListener("keydown", e => { if(e.key === "Enter") searchResult(); });

loadData();
