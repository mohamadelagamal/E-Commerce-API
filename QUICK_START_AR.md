# 🚀 دليل البدء السريع - بالعربية

## 👋 مرحباً مطور مبتدئ!

هذا دليل مبسط لمساعدتك على فهم وتشغيل المشروع بسرعة.

---

## 📚 الملفات المتوفرة لك

| الملف | الغرض | متى تقرأه؟ |
|-------|-------|------------|
| **ARABIC_GUIDE.md** | شرح شامل للمشروع | ابدأ من هنا! |
| **PLANTUML_DIAGRAMS.md** | مخططات بصرية | بعد القراءة الأولى |
| **QUICK_START_AR.md** | هذا الملف - دليل سريع | للبدء الفوري |

---

## 🎯 ما هو هذا المشروع؟

**مشروع Backend API** لمتجر إلكتروني يوفر:
- ✅ تسجيل وتسجيل دخول المستخدمين
- ✅ عرض وإدارة المنتجات
- ✅ سلة تسوق
- ✅ نظام طلبات
- ✅ مدفوعات عبر Stripe

---

## 🛠️ التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| **Node.js** | بيئة التشغيل |
| **Express.js** | إطار عمل الـ Backend |
| **MongoDB** | قاعدة البيانات |
| **JWT** | التحقق من الهوية |
| **Stripe** | المدفوعات |
| **Multer** | رفع الصور |

---

## 📁 هيكل المشروع المبسط

```
ecommerce-backend/
│
├── server.js              ← يشغل السيرفر
├── package.json           ← المكتبات المستخدمة
├── .env                   ← الإعدادات السرية
│
└── src/
    ├── app.js            ← إعداد Express
    ├── config/           ← الإعدادات (قاعدة البيانات)
    ├── models/           ← نماذج البيانات (User, Product, Order)
    ├── controllers/      ← المنطق الرئيسي
    ├── routes/           ← المسارات (URLs)
    ├── middleware/       ← الأمان والتحقق
    └── services/         ← خدمات (إيميل، دفع)
```

---

## 🚀 كيف تشغل المشروع؟

### الخطوة 1: تثبيت المكتبات
```bash
npm install
```

### الخطوة 2: إعداد ملف .env
انسخ `.env.example` إلى `.env` وعدّل القيم:

```env
# قاعدة البيانات
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your-secret-key-123
JWT_EXPIRE=7d

# المنفذ
PORT=5000
```

### الخطوة 3: تشغيل MongoDB
```bash
# إذا كان مثبت محلياً
mongod
```

### الخطوة 4: تشغيل السيرفر
```bash
npm run dev
```

### الخطوة 5: اختبار الـ API
افتح المتصفح: `http://localhost:5000/health`

يجب أن ترى:
```json
{
  "status": "success",
  "message": "API is running"
}
```

---

## 🧪 كيف تختبر الـ APIs؟

### استخدم Postman:

#### 1. استورد الـ Collection
- افتح Postman
- File → Import
- اختر: `postman/E-Commerce-API.postman_collection.json`

#### 2. استورد الـ Environment
- File → Import
- اختر: `postman/E-Commerce-API.postman_environment.json`

#### 3. جرب الـ APIs
ابدأ بهذا الترتيب:
1. **Register** - سجل مستخدم جديد
2. **Login** - سجل دخول (ستحصل على Token)
3. **Get Products** - اعرض المنتجات
4. **Add to Cart** - أضف منتج للسلة
5. **Create Order** - أنشئ طلب

---

## 📖 فهم الكود خطوة بخطوة

### 1️⃣ **server.js** - نقطة البداية

```javascript
// هذا الملف يشغل السيرفر

require('dotenv').config();        // 1. تحميل المتغيرات من .env
const app = require('./src/app');  // 2. استيراد التطبيق
const connectDB = require('./src/config/database'); // 3. الاتصال بقاعدة البيانات

connectDB();  // 4. الاتصال بـ MongoDB

app.listen(5000, () => {  // 5. تشغيل السيرفر
  console.log('Server running on port 5000');
});
```

**ببساطة:**
- يقرأ الإعدادات من `.env`
- يتصل بقاعدة البيانات
- يشغل السيرفر على المنفذ 5000

---

### 2️⃣ **src/app.js** - إعداد Express

```javascript
const express = require('express');
const app = express();

// Middleware للأمان
app.use(helmet());    // حماية
app.use(cors());      // السماح بالطلبات من مواقع أخرى

// قراءة JSON من الطلبات
app.use(express.json());

// المسارات
app.use('/api/auth', authRoutes);      // /api/auth/register, /api/auth/login
app.use('/api/products', productRoutes); // /api/products
app.use('/api/cart', cartRoutes);       // /api/cart
app.use('/api/orders', orderRoutes);    // /api/orders

module.exports = app;
```

**ببساطة:**
- يُعد Express
- يضيف طبقات الأمان
- يربط المسارات (URLs) بالـ Controllers

---

### 3️⃣ **src/routes/authRoutes.js** - مسارات التحقق

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// المسارات
router.post('/register', authController.register);  // تسجيل
router.post('/login', authController.login);        // دخول
router.post('/logout', authController.logout);      // خروج

module.exports = router;
```

**ببساطة:**
- يحدد المسارات (URLs)
- يربط كل مسار بوظيفة في Controller

---

### 4️⃣ **src/controllers/authController.js** - المنطق

```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// تسجيل مستخدم جديد
exports.register = async (req, res) => {
  try {
    // 1. استقبال البيانات
    const { name, email, password } = req.body;
    
    // 2. تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 3. إنشاء المستخدم
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });
    
    // 4. إنشاء Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    // 5. إرسال الاستجابة
    res.status(201).json({
      status: 'success',
      data: { user, token }
    });
    
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
```

**ببساطة:**
- يستقبل البيانات من المستخدم
- يشفر كلمة المرور
- يحفظ في قاعدة البيانات
- ينشئ Token
- يرسل الاستجابة

---

### 5️⃣ **src/models/User.js** - نموذج المستخدم

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);
```

**ببساطة:**
- يحدد شكل بيانات المستخدم
- يحدد الحقول المطلوبة
- يحفظ في MongoDB

---

## 🔄 تدفق البيانات المبسط

### مثال: تسجيل مستخدم جديد

```
1. المستخدم يرسل طلب:
   POST /api/auth/register
   Body: { name, email, password }
   
   ↓

2. Express يستقبل الطلب
   
   ↓

3. authRoutes يوجه الطلب
   
   ↓

4. authController.register يعمل:
   - يشفر كلمة المرور
   - يحفظ في MongoDB
   - ينشئ JWT Token
   
   ↓

5. يرسل الاستجابة:
   { status: 'success', data: { user, token } }
```

---

## 🎯 الـ APIs الأساسية

### 🔐 **Authentication**

#### تسجيل مستخدم جديد
```
POST /api/auth/register

Body:
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "123456"
}

Response:
{
  "status": "success",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

#### تسجيل الدخول
```
POST /api/auth/login

Body:
{
  "email": "ahmed@example.com",
  "password": "123456"
}

Response:
{
  "status": "success",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

---

### 📦 **Products**

#### عرض جميع المنتجات
```
GET /api/products

Response:
{
  "status": "success",
  "data": {
    "products": [
      {
        "_id": "...",
        "name": "لابتوب HP",
        "price": 3500,
        "category": "electronics"
      }
    ]
  }
}
```

---

### 🛒 **Cart**

#### إضافة منتج للسلة
```
POST /api/cart
Headers: Authorization: Bearer <token>

Body:
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}

Response:
{
  "status": "success",
  "data": {
    "cart": {
      "items": [ ... ],
      "totalPrice": 7000
    }
  }
}
```

---

### 📋 **Orders**

#### إنشاء طلب
```
POST /api/orders
Headers: Authorization: Bearer <token>

Body:
{
  "shippingAddress": {
    "street": "شارع الملك فهد",
    "city": "الرياض",
    "country": "السعودية",
    "zipCode": "12345"
  },
  "paymentMethod": "stripe"
}

Response:
{
  "status": "success",
  "data": {
    "order": {
      "orderNumber": "ORD-123456",
      "status": "pending"
    }
  }
}
```

---

## 🔑 مفاهيم مهمة

### 1. **JWT Token**
- يُنشأ عند تسجيل الدخول
- يُرسل مع كل طلب يحتاج تحقق
- يُضاف في Header:
  ```
  Authorization: Bearer eyJhbGc...
  ```

### 2. **Middleware**
- يعمل قبل Controller
- مثال: التحقق من Token، التحقق من البيانات

### 3. **MongoDB ObjectId**
- معرّف فريد لكل سجل
- مثال: `507f1f77bcf86cd799439011`

### 4. **Status Codes**
- `200` - نجح
- `201` - تم الإنشاء
- `400` - خطأ في البيانات
- `401` - غير مصرح (يحتاج تسجيل دخول)
- `403` - ممنوع (لا صلاحيات)
- `404` - غير موجود
- `500` - خطأ في السيرفر

---

## 🐛 حل المشاكل الشائعة

### المشكلة: السيرفر لا يعمل
```bash
# تأكد من تثبيت المكتبات
npm install

# تأكد من ملف .env
# تأكد من تشغيل MongoDB
```

### المشكلة: لا يتصل بقاعدة البيانات
```bash
# تأكد من تشغيل MongoDB
mongod

# تأكد من MONGODB_URI في .env
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

### المشكلة: Token غير صحيح
```bash
# تأكد من إضافة Token في Header
Authorization: Bearer <token>

# تأكد من تسجيل الدخول أولاً
```

---

## 📚 الخطوات التالية

### 1. **اقرأ الدليل الشامل**
افتح `ARABIC_GUIDE.md` لفهم تفصيلي

### 2. **شاهد المخططات**
افتح `PLANTUML_DIAGRAMS.md` لرؤية التدفق بصرياً

### 3. **جرب الـ APIs**
استخدم Postman لاختبار جميع الـ APIs

### 4. **اقرأ الكود**
ابدأ بقراءة:
- `server.js`
- `src/app.js`
- `src/routes/authRoutes.js`
- `src/controllers/authController.js`

---

## 💡 نصائح للمبتدئين

### ✅ **افعل:**
- ابدأ بفهم التدفق العام
- جرب الـ APIs في Postman
- استخدم `console.log()` لفهم الكود
- اقرأ ملف واحد في كل مرة

### ❌ **لا تفعل:**
- لا تحاول فهم كل شيء دفعة واحدة
- لا تخف من الأخطاء
- لا تتخطى الأساسيات

---

## 🎓 مصادر التعلم

### عربي:
- [دورة Node.js بالعربي](https://www.youtube.com/results?search_query=nodejs+arabic)
- [دورة Express.js بالعربي](https://www.youtube.com/results?search_query=expressjs+arabic)

### إنجليزي:
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)

---

## ✨ الخلاصة

**هذا المشروع يعلمك:**
- ✅ بناء REST API
- ✅ التعامل مع قاعدة البيانات
- ✅ نظام التحقق (JWT)
- ✅ الأمان والصلاحيات
- ✅ معالجة المدفوعات

**ابدأ الآن!** 🚀

---

## 📞 هل تحتاج مساعدة؟

### اقرأ هذه الملفات:
1. **ARABIC_GUIDE.md** - شرح شامل
2. **PLANTUML_DIAGRAMS.md** - مخططات بصرية
3. **postman/FIELD_REFERENCE.md** - مرجع الـ APIs

---

*تم إنشاء هذا الدليل خصيصاً للمطورين المبتدئين 💙*

**بالتوفيق في رحلتك البرمجية! 🎉**
