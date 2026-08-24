# My Agency Knowledge

আপনার ব্যক্তিগত ট্রাভেল এজেন্সি নোটবুক — Airlines, GDS/NDC, ফেয়ার, রুলস, নিজের এক্সপেরিয়েন্স — যা খুশি নিজের মতো করে সাজিয়ে লিখে রাখার অ্যাপ। এটা কোনো real booking/ticketing সিস্টেম না, শুধু notes রাখার জায়গা।

Firebase config কোডের ভিতরেই বসানো আছে (`src/firebase.js`) — আলাদা কিছু বসাতে হবে না।

## GitHub-এ আপলোড করার আগে Firebase Console-এ যা চালু করতে হবে (একবারই)

আপনার প্রজেক্ট **digital-notes-60035** খুলে:

1. **Authentication** → Get started → Sign-in method → **Email/Password** → Enable → Save
2. **Firestore Database** → Create database → Production mode → পছন্দের location → Create
3. **Storage** → Get started → Production mode → Create

তারপর Rules বসান (এই রিপোতে থাকা ফাইল থেকে কপি করে):

- **Firestore → Rules** ট্যাবে গিয়ে `firestore.rules` ফাইলের কনটেন্ট পুরোটা paste করে **Publish**
- **Storage → Rules** ট্যাবে গিয়ে `storage.rules` ফাইলের কনটেন্ট পুরোটা paste করে **Publish**

## GitHub-এ আপলোড

```
git init
git add .
git commit -m "Initial commit"
git remote add origin <আপনার repo URL>
git push -u origin main
```

## লোকালি চালিয়ে দেখতে চাইলে

```
npm install
npm run dev
```

## Deploy (host করতে চাইলে)

```
npm run build
```

এটা `dist/` ফোল্ডার বানাবে, যেকোনো static hosting-এ (Firebase Hosting, Vercel, Netlify) আপলোড করা যাবে।

## নোট

- প্রথমবার অ্যাকাউন্ট বানিয়ে login করলে sample data (Air Arabia, Emirates, Sabre ইত্যাদি) নিজে থেকেই যোগ হবে। Settings থেকে যেকোনো সময় মুছে ফেলা যাবে।
- Settings → Export দিয়ে যেকোনো সময় পুরো ডেটার backup (JSON) ডাউনলোড করা যাবে।
