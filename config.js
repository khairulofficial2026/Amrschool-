// ================================
// একাধিক Google Sheet ব্যবহার করতে চাইলে (প্রতিটা ক্লাসের জন্য আলাদা শীট)
// এই লিস্টে সবগুলো "Publish to web" CSV লিংক একটার পর একটা বসান, কমা দিয়ে আলাদা করে
// একটা শীট হলেও এভাবেই বসাবেন — শুধু একটা লিংক থাকবে লিস্টে
// কীভাবে CSV লিংক বের করবেন তার নিয়ম README.md ফাইলে দেওয়া আছে
// ================================
const SHEET_CSV_URLS = [
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQRWXfmhb480HkYvS3CWWnPnDgTTKKTCGLBAAPsJgu4zXJ_xdESXLvQYNsrY6cmRg/pub?gid=1161613645&single=true&output=csv",
  "PASTE_CLASS_2_SHEET_CSV_LINK_HERE",
  "PASTE_CLASS_3_SHEET_CSV_LINK_HERE",
  "PASTE_CLASS_4_SHEET_CSV_LINK_HERE",
  "PASTE_CLASS_5_SHEET_CSV_LINK_HERE",
  "PASTE_CLASS_6_SHEET_CSV_LINK_HERE",
  "PASTE_CLASS_7_SHEET_CSV_LINK_HERE"
];

// ================================
// এডমিন প্যানেলের পাসওয়ার্ড (বদলে দিন, শক্তিশালী পাসওয়ার্ড দিন)
// মনে রাখবেন: এটা কোডেই লেখা থাকে, তাই খুব উচ্চ-নিরাপত্তার জন্য উপযুক্ত না
// ================================
const ADMIN_PASSWORD = "sotota2026";

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
