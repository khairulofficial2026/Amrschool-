// ================================
// এখানে আপনার Google Sheet এর "Publish to web" CSV লিংক বসান
// কীভাবে বের করবেন তার নিয়ম README.md ফাইলে দেওয়া আছে
// ================================
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQRWXfmhb480HkYvS3CWWnPnDgTTKKTCGLBAAPsJgu4zXJ_xdESXLvQYNsrY6cmRg/pub?gid=1161613645&single=true&output=csv";

// ================================
// স্কুলের তথ্য (রিপোর্ট কার্ডের হেডারে দেখাবে)
// ================================
const SCHOOL_INFO = {
  name: "সততা প্রি ক্যাডেট স্কুল",
  address: "আমতলী, বরগুনা, বাংলাদেশ",
  email: "sototaprecadet@gmail.com",
  established: 2008
};

// ================================
// প্রতিটা বিষয়ের সর্বোচ্চ নম্বর (সাধারণত ১০০)
// ================================
const MAX_MARKS_PER_SUBJECT = 100;

// ================================
// Google Sheet এর কলাম হেডার -> রিপোর্টে যেভাবে দেখাবে
// বাম পাশে অবশ্যই ছোট হাতের অক্ষরে (lowercase) Sheet এর কলাম নাম লিখতে হবে
// ================================
const SUBJECT_LABELS = {
  "bangla": "বাংলা (Bangla)",
  "english": "ইংরেজি (English)",
  "math": "গণিত (Math)",
  "science": "বিজ্ঞান (Science)",
  "religion": "ধর্ম (Religion)",
  "social science": "সমাজবিজ্ঞান (Social Science)"
};
