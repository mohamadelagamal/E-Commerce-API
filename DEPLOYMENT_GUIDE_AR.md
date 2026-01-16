# 🚀 دليل النشر - Hostinger مع GitHub Actions

هذا الدليل سيساعدك على نشر مشروع الـ E-Commerce Backend على Hostinger تلقائياً باستخدام GitHub Actions.

## 📋 المتطلبات الأساسية

- ✅ خطة Hostinger Business (تدعم Node.js)
- ✅ حساب MongoDB Atlas (تم إعداده بالفعل)
- ✅ حساب GitHub
- ✅ Git مثبت على جهازك

---

## 🗄️ الخطوة 1: إعداد MongoDB Atlas (تم بالفعل ✓)

تم إعداد MongoDB Atlas الخاص بك مع:
- **اسم المستخدم:** `mohamadelgamaltech_db_user`
- **كلمة المرور:** `JFWC7vo2dok12QEu`
- **الكلاستر:** `Cluster0`
- **IP المسموح:** `41.235.233.21` (عنوان IP الحالي)

### ⚠️ مهم: إضافة IP الخاص بـ Hostinger إلى MongoDB Atlas

1. اذهب إلى [MongoDB Atlas](https://cloud.mongodb.com/)
2. اضغط على **Network Access** في القائمة الجانبية
3. اضغط على **Add IP Address**
4. اختر **Allow Access from Anywhere** (0.0.0.0/0) للإنتاج
   - أو أضف عنوان IP الخاص بـ Hostinger إذا كان متاحاً
5. اضغط **Confirm**

---

## 📦 الخطوة 2: رفع المشروع على GitHub

### 2.1 تهيئة مستودع Git (إذا لم يتم بعد)

افتح PowerShell في مجلد المشروع ونفذ:

```powershell
cd "c:\Users\HP\.gemini\antigravity\scratch\ecommerce-backend"
git init
git add .
git commit -m "Initial commit - E-Commerce Backend"
```

### 2.2 إنشاء مستودع GitHub

1. اذهب إلى [GitHub](https://github.com/new)
2. أنشئ مستودع جديد باسم `ecommerce-backend`
3. **لا تقم** بتهيئة README (لدينا كود بالفعل)
4. اضغط **Create repository**

### 2.3 رفع الكود إلى GitHub

```powershell
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-backend.git
git branch -M main
git push -u origin main
```

استبدل `YOUR_USERNAME` باسم المستخدم الخاص بك على GitHub.

---

## 🔐 الخطوة 3: إعداد GitHub Secrets

GitHub Actions يحتاج بيانات آمنة للنشر على Hostinger. أضف هذه الأسرار:

1. اذهب إلى مستودع GitHub الخاص بك
2. اضغط **Settings** → **Secrets and variables** → **Actions**
3. اضغط **New repository secret** وأضف كل من هذه:

### الأسرار المطلوبة:

| اسم السر | القيمة | من أين تجده |
|---------|--------|-------------|
| `FTP_SERVER` | عنوان FTP الخاص بـ Hostinger | Hostinger hPanel → Files → FTP Accounts |
| `FTP_USERNAME` | اسم مستخدم FTP | Hostinger hPanel → Files → FTP Accounts |
| `FTP_PASSWORD` | كلمة مرور FTP | Hostinger hPanel → Files → FTP Accounts |
| `FTP_SERVER_DIR` | `/public_html/` أو `/public_html/api/` | المجلد الذي تريد رفع الملفات إليه |
| `SSH_HOST` | عنوان SSH الخاص بـ Hostinger | Hostinger hPanel → Advanced → SSH Access |
| `SSH_USERNAME` | اسم مستخدم SSH | عادة نفس FTP |
| `SSH_PASSWORD` | كلمة مرور SSH | عادة نفس FTP |
| `SSH_PORT` | `21` أو `22` | عادة 21 لـ Hostinger |
| `APP_PATH` | `/home/username/public_html/` | المسار الكامل للتطبيق |

### متغيرات البيئة (اختياري لكن موصى به):

أضف هذه كأسرار أيضاً:

| اسم السر | القيمة |
|---------|--------|
| `MONGODB_URI` | `mongodb+srv://mohamadelgamaltech_db_user:JFWC7vo2dok12QEu@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority` |
| `JWT_SECRET` | `ecommerce_jwt_secret_key_2026_production` |
| `NODE_ENV` | `production` |

---

## 🎯 الخطوة 4: إعداد تطبيق Node.js على Hostinger

### 4.1 الدخول إلى Hostinger hPanel

1. سجل الدخول إلى [Hostinger](https://hpanel.hostinger.com/)
2. اختر خطة الاستضافة الخاصة بك

### 4.2 إعداد تطبيق Node.js

1. في hPanel، ابحث عن **"Setup Node.js App"**
2. اضغط **Create Application**
3. قم بالإعداد:
   - **Node.js Version:** `18.x` أو `20.x`
   - **Application Mode:** `Production`
   - **Application Root:** `/public_html` (أو المجلد الذي اخترته)
   - **Application URL:** النطاق أو النطاق الفرعي الخاص بك
   - **Application Startup File:** `server.js`
   - **Port:** اترك الافتراضي (عادة يتم تعيينه تلقائياً)

4. اضغط **Create**

### 4.3 تعيين متغيرات البيئة في Hostinger

في إعدادات تطبيق Node.js، ابحث عن قسم **Environment Variables** وأضف:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://mohamadelgamaltech_db_user:JFWC7vo2dok12QEu@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=ecommerce_jwt_secret_key_2026_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=ecommerce_refresh_secret_key_2026_production
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=https://yourdomain.com
```

**⚠️ مهم:** لا تضف متغيرات Redis إذا كان Hostinger لا يدعم Redis. سنتعامل مع هذا في الكود.

---

## 🚀 الخطوة 5: النشر باستخدام GitHub Actions

### النشر التلقائي

في كل مرة تقوم فيها بعمل push إلى فرع `main`، سيقوم GitHub Actions تلقائياً بـ:
1. ✅ سحب الكود الخاص بك
2. ✅ تثبيت المكتبات
3. ✅ رفع الملفات إلى Hostinger عبر FTP
4. ✅ إعادة تشغيل تطبيق Node.js

### النشر اليدوي

1. اذهب إلى مستودع GitHub الخاص بك
2. اضغط على تبويب **Actions**
3. اختر **Deploy to Hostinger** workflow
4. اضغط **Run workflow** → **Run workflow**

---

## 🔧 الخطوة 6: التعامل مع Redis (اختياري)

بما أن خطة Hostinger Business لا تتضمن Redis، لديك خياران:

### الخيار أ: تعطيل Redis (موصى به الآن)

تحديث الكود لجعل Redis اختيارياً. يمكنني مساعدتك في هذا.

### الخيار ب: استخدام خدمة Redis خارجية

استخدم خدمة Redis مجانية مثل:
- [Redis Labs](https://redis.com/try-free/) (خطة مجانية: 30MB)
- [Upstash](https://upstash.com/) (خطة مجانية: 10,000 أمر/يوم)

ثم أضف إلى متغيرات البيئة:
```
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

---

## ✅ الخطوة 7: التحقق من النشر

### 7.1 التحقق من تشغيل التطبيق

قم بزيارة: `https://yourdomain.com/api/v1/health`

يجب أن ترى:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2026-01-16T12:40:00.000Z"
}
```

### 7.2 فحص السجلات

في Hostinger hPanel:
1. اذهب إلى **Setup Node.js App**
2. اضغط على تطبيقك
3. تحقق من **Application Logs** لأي أخطاء

---

## 🐛 حل المشاكل

### المشكلة: فشل الاتصال بـ MongoDB

**الحل:**
1. تحقق من Network Access في MongoDB Atlas
2. أضف `0.0.0.0/0` إلى قائمة IP المسموح
3. تحقق من سلسلة الاتصال في متغيرات البيئة

### المشكلة: التطبيق لا يبدأ

**الحل:**
1. تحقق من سجلات Hostinger
2. تحقق من أن `server.js` هو ملف البدء الصحيح
3. تأكد من تعيين جميع متغيرات البيئة
4. تحقق من توافق إصدار Node.js

### المشكلة: فشل GitHub Action

**الحل:**
1. تحقق من تعيين جميع أسرار GitHub بشكل صحيح
2. تحقق من بيانات FTP في Hostinger
3. تأكد من تفعيل وصول SSH
4. راجع سجلات GitHub Actions للأخطاء المحددة

---

## 📝 مرجع الأوامر السريعة

### رفع التغييرات والنشر

```powershell
git add .
git commit -m "رسالة الـ commit الخاصة بك"
git push origin main
```

هذا سيؤدي تلقائياً إلى النشر على Hostinger!

### فحص حالة Git

```powershell
git status
```

### عرض سجل الـ Commits

```powershell
git log --oneline
```

---

## 🎉 قائمة التحقق من النجاح

- [ ] تم إعداد MongoDB Atlas مع قائمة IP المسموح
- [ ] تم رفع المشروع إلى GitHub
- [ ] تم إعداد أسرار GitHub
- [ ] تم إنشاء تطبيق Node.js على Hostinger
- [ ] تم تعيين متغيرات البيئة في Hostinger
- [ ] نجح النشر الأول
- [ ] فحص صحة API يعيد نجاحاً
- [ ] يمكن الوصول إلى النقاط النهائية عبر Postman

---

## 📞 تحتاج مساعدة؟

إذا واجهت أي مشاكل:
1. تحقق من سجلات Hostinger أولاً
2. راجع سجلات GitHub Actions
3. تحقق من اتصال MongoDB Atlas
4. تحقق من جميع متغيرات البيئة

---

## 🔄 ملخص سير العمل

```
التغييرات المحلية → Git Commit → Git Push → GitHub Actions → رفع FTP → Hostinger → إعادة تشغيل التطبيق → مباشر! 🎉
```

**وقت النشر:** ~2-3 دقائق لكل push

---

*آخر تحديث: 16 يناير 2026*
