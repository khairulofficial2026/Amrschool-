# সততা প্রি ক্যাডেট স্কুল — ফলাফল পোর্টাল

## ধাপ ১: Google Sheet তৈরি করুন

Google Sheet এ প্রথম সারিতে (row 1) এই কলাম হেডারগুলো বসান — বানান হুবহু এমনই হতে হবে:

```
Class | Roll | Name | Father Name | Bangla | English | Math | Science | Religion | GPA | Result
```

- **Class, Roll, Name, Father Name, GPA, Result** — এই কলামগুলোর নাম বদলাবেন না।
- **Bangla, English, Math...** — এই বিষয়গুলো আপনি ইচ্ছামতো যোগ/বাদ/নাম পরিবর্তন করতে পারবেন, সাইট নিজে থেকেই সব বিষয় কলাম ধরে নেবে।
- প্রতিটা স্টুডেন্টের জন্য একটা করে সারি (row) পূরণ করুন।
- Result কলামে লিখুন: `Pass` / `Fail` অথবা `উত্তীর্ণ` / `অনুত্তীর্ণ`

উদাহরণ:
```
Class      Roll  Name           Father Name   Bangla  English  Math  GPA   Result
Play Group 2     রাফি হাসান     করিম হাসান    85      80       90    5.00  Pass
```

## ধাপ ২: Google Sheet পাবলিশ করুন (CSV হিসেবে)

1. Google Sheet খুলুন → উপরে মেনু থেকে **File → Share → Publish to web**
2. যে ট্যাব খুলবে সেখানে:
   - প্রথম ড্রপডাউনে আপনার শীটের নাম সিলেক্ট করুন
   - দ্বিতীয় ড্রপডাউনে **CSV** সিলেক্ট করুন (Web page না)
3. **Publish** বাটনে চাপুন → একটা লিংক পাবেন, সেটা কপি করুন
   (লিংকটা এরকম দেখতে হবে: `https://docs.google.com/spreadsheets/d/e/xxxx/pub?output=csv`)

## ধাপ ৩: লিংক কোডে বসান

`config.js` ফাইল খুলুন, এই লাইনটা খুঁজুন:

```js
const SHEET_CSV_URL = "PASTE_YOUR_PUBLISHED_CSV_LINK_HERE";
```

`PASTE_YOUR_PUBLISHED_CSV_LINK_HERE` এর জায়গায় আপনার কপি করা CSV লিংকটা বসিয়ে দিন। যেমন:

```js
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/xxxx/pub?output=csv";
```

## ধাপ ৪: GitHub এ আপলোড করুন

1. GitHub এ নতুন রিপোজিটরি বানান, নাম দিন: `আপনার-ইউজারনেম.github.io` (এটা করলে সরাসরি মেইন ডোমেইনে হোস্ট হবে) — অথবা যেকোনো নাম দিলেও চলবে।
2. এই ৪টা ফাইল রিপোতে আপলোড করুন: `index.html`, `style.css`, `script.js`, `config.js`
3. রিপোর **Settings → Pages** এ যান
4. Source এ **Branch: main / (root)** সিলেক্ট করে Save করুন
5. কিছুক্ষণ পর আপনার সাইট লাইভ হবে: `https://আপনার-ইউজারনেম.github.io/রিপোর-নাম/`

## নোটিশ টেক্সট পরিবর্তন

`index.html` ফাইলে এই লাইনটা খুঁজে বদলে দিতে পারবেন:

```html
<span id="tickerText">ফলাফল প্রকাশিত হয়েছে!...</span>
```

## গুরুত্বপূর্ণ

- Google Sheet এ যেকোনো পরিবর্তন করলে সাইটে সাথে সাথে দেখাবে (রিফ্রেশ করলেই) — নতুন করে আপলোড করার দরকার নেই।
- Sheet টা edit করার অ্যাক্সেস শুধু আপনার কাছেই থাকবে, publish করলে শুধু ডেটা read করা যাবে, কেউ এডিট করতে পারবে না।
