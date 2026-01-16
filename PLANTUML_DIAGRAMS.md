# 📊 مخططات PlantUML للمشروع

## 🎯 نظرة عامة

هذا الملف يحتوي على مخططات **PlantUML** لفهم تدفق البيانات والعلاقات في المشروع.

---

## 📖 فهرس المخططات

1. [هيكل المشروع العام](#1-هيكل-المشروع-العام)
2. [تدفق تسجيل مستخدم جديد](#2-تدفق-تسجيل-مستخدم-جديد)
3. [تدفق تسجيل الدخول](#3-تدفق-تسجيل-الدخول)
4. [تدفق إضافة منتج للسلة](#4-تدفق-إضافة-منتج-للسلة)
5. [تدفق إنشاء طلب](#5-تدفق-إنشاء-طلب)
6. [علاقات قاعدة البيانات](#6-علاقات-قاعدة-البيانات)
7. [بنية الـ Middleware](#7-بنية-الـ-middleware)
8. [نظام الصلاحيات](#8-نظام-الصلاحيات)

---

## 1. هيكل المشروع العام

### مخطط الهيكل الكلي

```plantuml
@startuml
!theme plain

package "E-Commerce Backend" {
  
  package "Entry Point" {
    [server.js] as server
  }
  
  package "Application Core" {
    [app.js] as app
  }
  
  package "Configuration" {
    [database.js] as db
    [redis.js] as redis
    [stripe.js] as stripe
  }
  
  package "Routes" {
    [authRoutes] as authR
    [userRoutes] as userR
    [productRoutes] as prodR
    [cartRoutes] as cartR
    [orderRoutes] as orderR
  }
  
  package "Controllers" {
    [authController] as authC
    [userController] as userC
    [productController] as prodC
    [cartController] as cartC
    [orderController] as orderC
  }
  
  package "Models" {
    database User
    database Product
    database Cart
    database Order
  }
  
  package "Middleware" {
    [auth] as authM
    [validator] as validM
    [errorHandler] as errorM
    [upload] as uploadM
  }
  
  package "Services" {
    [emailService] as emailS
    [paymentService] as payS
    [cacheService] as cacheS
  }
  
  package "External" {
    cloud MongoDB
    cloud Redis
    cloud Stripe
    cloud SMTP
  }
}

' Connections
server --> app
app --> db
app --> redis
app --> stripe

app --> authR
app --> userR
app --> prodR
app --> cartR
app --> orderR

authR --> authM
authR --> validM
authR --> authC

userR --> authM
userR --> validM
userR --> userC

prodR --> authM
prodR --> validM
prodR --> prodC

cartR --> authM
cartR --> validM
cartR --> cartC

orderR --> authM
orderR --> validM
orderR --> orderC

authC --> User
userC --> User
prodC --> Product
cartC --> Cart
cartC --> Product
orderC --> Order
orderC --> Cart
orderC --> Product

authC --> emailS
orderC --> emailS
orderC --> payS

db --> MongoDB
redis --> Redis
stripe --> Stripe
emailS --> SMTP
payS --> Stripe
cacheS --> Redis

app --> errorM

@enduml
```

**الشرح بالعربية:**
- `server.js` يبدأ التطبيق
- `app.js` يُعد Express والـ Routes
- الـ Routes توجه الطلبات للـ Controllers
- الـ Middleware يعمل قبل Controllers
- الـ Controllers تستخدم Models و Services
- الـ Models تتصل بـ MongoDB
- الـ Services تتصل بخدمات خارجية

---

## 2. تدفق تسجيل مستخدم جديد

### مخطط التسلسل (Sequence Diagram)

```plantuml
@startuml
!theme plain
title تدفق تسجيل مستخدم جديد (Register Flow)

actor "المستخدم\nUser" as user
participant "Express\nServer" as express
participant "Validator\nMiddleware" as validator
participant "Auth\nController" as controller
participant "User\nModel" as model
participant "MongoDB" as db
participant "Email\nService" as email
participant "JWT" as jwt

user -> express: POST /api/auth/register\n{name, email, password}
activate express

express -> validator: التحقق من البيانات
activate validator
validator -> validator: التحقق من:\n- الاسم (مطلوب)\n- البريد (صحيح)\n- كلمة المرور (6+ أحرف)
alt البيانات صحيحة
  validator --> express: ✅ البيانات صحيحة
  deactivate validator
  
  express -> controller: register(req, res)
  activate controller
  
  controller -> model: البحث عن البريد
  activate model
  model -> db: findOne({email})
  activate db
  db --> model: النتيجة
  deactivate db
  
  alt البريد موجود مسبقاً
    model --> controller: ❌ البريد مستخدم
    controller --> express: 409 Conflict
    express --> user: ❌ البريد موجود مسبقاً
  else البريد جديد
    model --> controller: ✅ البريد متاح
    deactivate model
    
    controller -> controller: تشفير كلمة المرور\nbcrypt.hash(password)
    
    controller -> model: إنشاء مستخدم جديد
    activate model
    model -> db: save()
    activate db
    db --> model: ✅ تم الحفظ
    deactivate db
    model --> controller: بيانات المستخدم
    deactivate model
    
    controller -> jwt: إنشاء Token
    activate jwt
    jwt --> controller: Token
    deactivate jwt
    
    controller -> email: إرسال إيميل ترحيب
    activate email
    email --> controller: ✅ تم الإرسال
    deactivate email
    
    controller --> express: 201 Created\n{user, token}
    deactivate controller
    express --> user: ✅ تم التسجيل بنجاح\n{user, token}
  end
  
else البيانات خاطئة
  validator --> express: ❌ خطأ في البيانات
  deactivate validator
  express --> user: 400 Bad Request\nرسالة الخطأ
end

deactivate express

@enduml
```

**الشرح بالعربية:**
1. المستخدم يرسل بيانات التسجيل
2. Validator يتحقق من صحة البيانات
3. Controller يتحقق من عدم وجود البريد
4. تشفير كلمة المرور
5. حفظ المستخدم في قاعدة البيانات
6. إنشاء JWT Token
7. إرسال إيميل ترحيب
8. إرجاع Token للمستخدم

---

## 3. تدفق تسجيل الدخول

```plantuml
@startuml
!theme plain
title تدفق تسجيل الدخول (Login Flow)

actor "المستخدم\nUser" as user
participant "Express" as express
participant "Validator" as validator
participant "Auth\nController" as controller
participant "User\nModel" as model
participant "MongoDB" as db
participant "bcrypt" as bcrypt
participant "JWT" as jwt

user -> express: POST /api/auth/login\n{email, password}
activate express

express -> validator: التحقق من البيانات
activate validator
validator -> validator: التحقق من:\n- البريد (مطلوب)\n- كلمة المرور (مطلوبة)
validator --> express: ✅ البيانات صحيحة
deactivate validator

express -> controller: login(req, res)
activate controller

controller -> model: البحث عن المستخدم
activate model
model -> db: findOne({email})\n.select('+password')
activate db
db --> model: بيانات المستخدم
deactivate db

alt المستخدم موجود
  model --> controller: بيانات المستخدم
  deactivate model
  
  controller -> bcrypt: مقارنة كلمة المرور
  activate bcrypt
  bcrypt -> bcrypt: compare(password, hashedPassword)
  
  alt كلمة المرور صحيحة
    bcrypt --> controller: ✅ صحيحة
    deactivate bcrypt
    
    controller -> jwt: إنشاء Token
    activate jwt
    jwt --> controller: Token
    deactivate jwt
    
    controller --> express: 200 OK\n{user, token}
    deactivate controller
    express --> user: ✅ تم تسجيل الدخول\n{user, token}
    
  else كلمة المرور خاطئة
    bcrypt --> controller: ❌ خاطئة
    deactivate bcrypt
    controller --> express: 401 Unauthorized
    deactivate controller
    express --> user: ❌ كلمة المرور خاطئة
  end
  
else المستخدم غير موجود
  model --> controller: null
  deactivate model
  controller --> express: 401 Unauthorized
  deactivate controller
  express --> user: ❌ البريد غير موجود
end

deactivate express

@enduml
```

**الشرح بالعربية:**
1. المستخدم يرسل البريد وكلمة المرور
2. البحث عن المستخدم في قاعدة البيانات
3. مقارنة كلمة المرور المشفرة
4. إنشاء JWT Token
5. إرجاع Token للمستخدم

---

## 4. تدفق إضافة منتج للسلة

```plantuml
@startuml
!theme plain
title تدفق إضافة منتج للسلة (Add to Cart Flow)

actor "المستخدم\nUser" as user
participant "Express" as express
participant "Auth\nMiddleware" as auth
participant "Validator" as validator
participant "Cart\nController" as controller
participant "Product\nModel" as product
participant "Cart\nModel" as cart
participant "MongoDB" as db

user -> express: POST /api/cart\nHeaders: Authorization: Bearer <token>\nBody: {productId, quantity}
activate express

express -> auth: التحقق من Token
activate auth
auth -> auth: jwt.verify(token)

alt Token صحيح
  auth -> auth: استخراج بيانات المستخدم
  auth --> express: ✅ req.user = userData
  deactivate auth
  
  express -> validator: التحقق من البيانات
  activate validator
  validator -> validator: التحقق من:\n- productId (ObjectId)\n- quantity (رقم > 0)
  validator --> express: ✅ البيانات صحيحة
  deactivate validator
  
  express -> controller: addToCart(req, res)
  activate controller
  
  controller -> product: البحث عن المنتج
  activate product
  product -> db: findById(productId)
  activate db
  db --> product: بيانات المنتج
  deactivate db
  
  alt المنتج موجود
    product --> controller: بيانات المنتج
    deactivate product
    
    controller -> controller: التحقق من المخزون\nif (product.stock >= quantity)
    
    alt المخزون كافي
      controller -> cart: البحث عن سلة المستخدم
      activate cart
      cart -> db: findOne({user: userId})
      activate db
      db --> cart: السلة
      deactivate db
      
      alt السلة موجودة
        cart --> controller: السلة الحالية
        
        controller -> controller: التحقق من وجود المنتج في السلة
        
        alt المنتج موجود في السلة
          controller -> controller: زيادة الكمية\nitem.quantity += quantity
        else المنتج جديد
          controller -> controller: إضافة المنتج\nitems.push({product, quantity})
        end
        
      else السلة غير موجودة
        cart --> controller: null
        controller -> controller: إنشاء سلة جديدة\n{user, items: [{product, quantity}]}
      end
      
      controller -> controller: حساب السعر الإجمالي\ntotalPrice = sum(item.price * item.quantity)
      
      controller -> cart: حفظ السلة
      cart -> db: save()
      activate db
      db --> cart: ✅ تم الحفظ
      deactivate db
      cart --> controller: السلة المحدثة
      deactivate cart
      
      controller --> express: 200 OK\n{cart}
      deactivate controller
      express --> user: ✅ تمت الإضافة للسلة\n{cart}
      
    else المخزون غير كافي
      controller --> express: 400 Bad Request
      deactivate controller
      express --> user: ❌ المخزون غير كافي
    end
    
  else المنتج غير موجود
    product --> controller: null
    deactivate product
    controller --> express: 404 Not Found
    deactivate controller
    express --> user: ❌ المنتج غير موجود
  end
  
else Token غير صحيح
  auth --> express: ❌ Token غير صحيح
  deactivate auth
  express --> user: 401 Unauthorized\nيجب تسجيل الدخول
end

deactivate express

@enduml
```

**الشرح بالعربية:**
1. التحقق من Token (المستخدم مسجل دخول)
2. التحقق من صحة البيانات
3. البحث عن المنتج والتحقق من المخزون
4. البحث عن سلة المستخدم أو إنشاء واحدة جديدة
5. إضافة المنتج أو زيادة الكمية
6. حساب السعر الإجمالي
7. حفظ السلة

---

## 5. تدفق إنشاء طلب

```plantuml
@startuml
!theme plain
title تدفق إنشاء طلب (Create Order Flow)

actor "المستخدم\nUser" as user
participant "Express" as express
participant "Auth\nMiddleware" as auth
participant "Order\nController" as controller
participant "Cart\nModel" as cart
participant "Product\nModel" as product
participant "Order\nModel" as order
participant "Payment\nService" as payment
participant "Email\nService" as email
participant "MongoDB" as db

user -> express: POST /api/orders\nHeaders: Authorization: Bearer <token>\nBody: {shippingAddress, paymentMethod}
activate express

express -> auth: التحقق من Token
activate auth
auth --> express: ✅ req.user = userData
deactivate auth

express -> controller: createOrder(req, res)
activate controller

controller -> cart: البحث عن سلة المستخدم
activate cart
cart -> db: findOne({user: userId})\n.populate('items.product')
activate db
db --> cart: السلة مع تفاصيل المنتجات
deactivate db

alt السلة موجودة وليست فارغة
  cart --> controller: السلة
  deactivate cart
  
  controller -> controller: التحقق من السلة\nif (cart.items.length > 0)
  
  alt السلة تحتوي على منتجات
    
    loop لكل منتج في السلة
      controller -> product: التحقق من المخزون
      activate product
      product -> db: findById(productId)
      activate db
      db --> product: بيانات المنتج
      deactivate db
      
      alt المخزون كافي
        product --> controller: ✅ متوفر
      else المخزون غير كافي
        product --> controller: ❌ غير متوفر
        controller --> express: 400 Bad Request
        express --> user: ❌ بعض المنتجات غير متوفرة
        [<-- user
      end
      deactivate product
    end
    
    controller -> controller: إنشاء رقم طلب فريد\norderNumber = "ORD-" + timestamp
    
    controller -> controller: إعداد بيانات الطلب:\n- user\n- items من السلة\n- totalPrice\n- shippingAddress\n- paymentMethod\n- status: "pending"
    
    controller -> order: إنشاء الطلب
    activate order
    order -> db: save()
    activate db
    db --> order: ✅ تم الحفظ
    deactivate db
    order --> controller: بيانات الطلب
    deactivate order
    
    controller -> product: تحديث المخزون
    activate product
    loop لكل منتج
      product -> db: updateOne({_id},\n{$inc: {stock: -quantity}})
      activate db
      db --> product: ✅ تم التحديث
      deactivate db
    end
    product --> controller: ✅ تم تحديث المخزون
    deactivate product
    
    controller -> cart: مسح السلة
    activate cart
    cart -> db: updateOne({user},\n{$set: {items: [], totalPrice: 0}})
    activate db
    db --> cart: ✅ تم المسح
    deactivate db
    cart --> controller: ✅ تم مسح السلة
    deactivate cart
    
    alt paymentMethod == "stripe"
      controller -> payment: معالجة الدفع
      activate payment
      payment -> payment: createPaymentIntent(totalPrice)
      payment --> controller: ✅ نجح الدفع
      deactivate payment
    end
    
    controller -> email: إرسال تأكيد الطلب
    activate email
    email --> controller: ✅ تم الإرسال
    deactivate email
    
    controller --> express: 201 Created\n{order}
    deactivate controller
    express --> user: ✅ تم إنشاء الطلب بنجاح\n{order}
    
  else السلة فارغة
    controller --> express: 400 Bad Request
    deactivate controller
    express --> user: ❌ السلة فارغة
  end
  
else السلة غير موجودة
  cart --> controller: null
  deactivate cart
  controller --> express: 400 Bad Request
  deactivate controller
  express --> user: ❌ السلة فارغة
end

deactivate express

@enduml
```

**الشرح بالعربية:**
1. التحقق من تسجيل الدخول
2. البحث عن سلة المستخدم
3. التحقق من أن السلة ليست فارغة
4. التحقق من توفر جميع المنتجات
5. إنشاء رقم طلب فريد
6. حفظ الطلب في قاعدة البيانات
7. تحديث مخزون المنتجات
8. مسح السلة
9. معالجة الدفع (إذا كان Stripe)
10. إرسال إيميل تأكيد

---

## 6. علاقات قاعدة البيانات

```plantuml
@startuml
!theme plain
title علاقات قاعدة البيانات (Database Relationships)

entity "User\nالمستخدم" as user {
  * _id : ObjectId
  --
  * name : String
  * email : String (unique)
  * password : String (hashed)
  * role : String (user/admin)
  phone : String
  avatar : String
  addresses : Array
  createdAt : Date
}

entity "Product\nالمنتج" as product {
  * _id : ObjectId
  --
  * name : String
  * description : String
  * price : Number
  * category : String
  * stock : Number
  * sku : String (unique)
  brand : String
  images : Array
  isFeatured : Boolean
  tags : Array
  createdAt : Date
}

entity "Cart\nالسلة" as cart {
  * _id : ObjectId
  --
  * user : ObjectId
  * items : Array
  * totalPrice : Number
  updatedAt : Date
}

entity "CartItem\nعنصر السلة" as cartItem {
  * product : ObjectId
  * quantity : Number
  * price : Number
}

entity "Order\nالطلب" as order {
  * _id : ObjectId
  --
  * user : ObjectId
  * orderNumber : String (unique)
  * items : Array
  * totalPrice : Number
  * status : String
  * shippingAddress : Object
  * paymentMethod : String
  paymentStatus : String
  createdAt : Date
}

entity "OrderItem\nعنصر الطلب" as orderItem {
  * product : ObjectId
  * name : String
  * price : Number
  * quantity : Number
  image : String
}

entity "Review\nالتقييم" as review {
  * user : ObjectId
  * rating : Number (1-5)
  comment : String
  createdAt : Date
}

' Relationships
user ||--o{ cart : "يملك\nhas"
user ||--o{ order : "يطلب\nplaces"
user ||--o{ review : "يكتب\nwrites"

cart ||--|{ cartItem : "يحتوي\ncontains"
cartItem }o--|| product : "يشير إلى\nrefers to"

order ||--|{ orderItem : "يحتوي\ncontains"
orderItem }o--|| product : "يشير إلى\nrefers to"

product ||--o{ review : "يحصل على\nreceives"

note right of user
  **المستخدم**
  - يمكنه إنشاء سلة واحدة
  - يمكنه إنشاء طلبات متعددة
  - يمكنه كتابة تقييمات متعددة
end note

note right of product
  **المنتج**
  - يمكن أن يكون في سلال متعددة
  - يمكن أن يكون في طلبات متعددة
  - يمكن أن يحصل على تقييمات متعددة
end note

note right of cart
  **السلة**
  - تنتمي لمستخدم واحد
  - تحتوي على منتجات متعددة
  - تُمسح بعد إنشاء الطلب
end note

note right of order
  **الطلب**
  - ينتمي لمستخدم واحد
  - يحتوي على منتجات متعددة
  - له حالات: pending, processing,
    shipped, delivered, cancelled
end note

@enduml
```

**الشرح بالعربية:**
- **User (المستخدم)**: يملك سلة واحدة، طلبات متعددة، تقييمات متعددة
- **Product (المنتج)**: يمكن أن يكون في سلال وطلبات متعددة
- **Cart (السلة)**: تنتمي لمستخدم واحد، تحتوي على منتجات
- **Order (الطلب)**: ينتمي لمستخدم، يحتوي على منتجات، له حالات مختلفة

---

## 7. بنية الـ Middleware

```plantuml
@startuml
!theme plain
title بنية الـ Middleware (Middleware Architecture)

start

:طلب HTTP يصل للسيرفر\nHTTP Request;

partition "Global Middleware" {
  :helmet()\nحماية Headers;
  :cors()\nالسماح بالطلبات من مواقع أخرى;
  :compression()\nضغط الاستجابات;
  :express.json()\nقراءة JSON;
  :morgan()\nتسجيل الطلبات;
  :rateLimit()\nمنع الهجمات;
}

partition "Route Middleware" {
  :تحديد المسار\nRoute Matching;
  
  if (يحتاج تسجيل دخول؟) then (نعم)
    :auth.protect()\nالتحقق من Token;
    
    if (Token صحيح؟) then (نعم)
      :إضافة المستخدم إلى req.user;
    else (لا)
      :401 Unauthorized;
      stop
    endif
    
    if (يحتاج صلاحيات Admin؟) then (نعم)
      :auth.restrictTo('admin')\nالتحقق من الصلاحيات;
      
      if (Admin؟) then (نعم)
        :السماح بالمتابعة;
      else (لا)
        :403 Forbidden;
        stop
      endif
    endif
  endif
  
  :validator\nالتحقق من صحة البيانات;
  
  if (البيانات صحيحة؟) then (نعم)
    :السماح بالمتابعة;
  else (لا)
    :400 Bad Request;
    stop
  endif
  
  if (رفع ملفات؟) then (نعم)
    :upload.single('file')\nأو upload.array('files');
    
    if (الملف صحيح؟) then (نعم)
      :حفظ الملف في /uploads;
    else (لا)
      :400 Bad Request;
      stop
    endif
  endif
}

partition "Controller" {
  :تنفيذ المنطق الرئيسي\nBusiness Logic;
  
  if (نجح؟) then (نعم)
    :إرسال استجابة ناجحة\n200/201 Success;
  else (لا)
    :رمي خطأ\nthrow Error;
  endif
}

partition "Error Handling" {
  if (حدث خطأ؟) then (نعم)
    :errorHandler\nمعالجة الأخطاء;
    :تسجيل الخطأ في logger;
    :إرسال استجابة خطأ\n400/401/403/404/500;
  endif
}

:إرسال الاستجابة للمستخدم\nSend Response;

stop

@enduml
```

**الشرح بالعربية:**
1. **Global Middleware**: يعمل على جميع الطلبات (أمان، ضغط، تسجيل)
2. **Route Middleware**: يعمل على مسارات محددة (تحقق، صلاحيات، validation)
3. **Controller**: ينفذ المنطق الرئيسي
4. **Error Handler**: يعالج الأخطاء ويرسل استجابات مناسبة

---

## 8. نظام الصلاحيات

```plantuml
@startuml
!theme plain
title نظام الصلاحيات (Authorization System)

actor "مستخدم عادي\nUser" as user
actor "مدير\nAdmin" as admin

package "Public APIs\nمتاحة للجميع" {
  usecase "عرض المنتجات\nView Products" as UC1
  usecase "عرض منتج واحد\nView Product Details" as UC2
  usecase "التسجيل\nRegister" as UC3
  usecase "تسجيل الدخول\nLogin" as UC4
}

package "User APIs\nللمستخدمين المسجلين" {
  usecase "عرض الملف الشخصي\nView Profile" as UC5
  usecase "تعديل الملف الشخصي\nUpdate Profile" as UC6
  usecase "إضافة عنوان\nAdd Address" as UC7
  usecase "عرض السلة\nView Cart" as UC8
  usecase "إضافة للسلة\nAdd to Cart" as UC9
  usecase "إنشاء طلب\nCreate Order" as UC10
  usecase "عرض طلباتي\nView My Orders" as UC11
  usecase "إلغاء طلب\nCancel Order" as UC12
  usecase "إضافة تقييم\nAdd Review" as UC13
}

package "Admin APIs\nللمديرين فقط" {
  usecase "إضافة منتج\nCreate Product" as UC14
  usecase "تعديل منتج\nUpdate Product" as UC15
  usecase "حذف منتج\nDelete Product" as UC16
  usecase "عرض جميع المستخدمين\nView All Users" as UC17
  usecase "عرض جميع الطلبات\nView All Orders" as UC18
  usecase "تحديث حالة الطلب\nUpdate Order Status" as UC19
}

' Public APIs - متاحة للجميع
user --> UC1
user --> UC2
user --> UC3
user --> UC4

admin --> UC1
admin --> UC2
admin --> UC3
admin --> UC4

' User APIs - للمستخدمين المسجلين
user --> UC5
user --> UC6
user --> UC7
user --> UC8
user --> UC9
user --> UC10
user --> UC11
user --> UC12
user --> UC13

admin --> UC5
admin --> UC6
admin --> UC7
admin --> UC8
admin --> UC9
admin --> UC10
admin --> UC11
admin --> UC12
admin --> UC13

' Admin APIs - للمديرين فقط
admin --> UC14
admin --> UC15
admin --> UC16
admin --> UC17
admin --> UC18
admin --> UC19

note right of user
  **المستخدم العادي**
  - يمكنه الوصول للـ APIs العامة
  - يمكنه الوصول لـ APIs المستخدمين
  - لا يمكنه الوصول لـ APIs المديرين
end note

note right of admin
  **المدير**
  - يمكنه الوصول لجميع APIs
  - له صلاحيات إضافية
  - يمكنه إدارة المنتجات والطلبات
end note

@enduml
```

**الشرح بالعربية:**
- **Public APIs**: متاحة للجميع (عرض المنتجات، التسجيل، الدخول)
- **User APIs**: للمستخدمين المسجلين (السلة، الطلبات، الملف الشخصي)
- **Admin APIs**: للمديرين فقط (إدارة المنتجات، المستخدمين، الطلبات)

---

## 🎯 كيفية استخدام هذه المخططات

### 1. **عرض المخططات**

يمكنك عرض هذه المخططات بطرق متعددة:

#### أ) **PlantUML Online**
1. افتح: https://www.plantuml.com/plantuml/uml/
2. انسخ كود PlantUML
3. الصقه في المحرر
4. شاهد المخطط

#### ب) **VS Code Extension**
1. ثبت إضافة "PlantUML" في VS Code
2. افتح ملف `.puml`
3. اضغط `Alt+D` لعرض المخطط

#### ج) **IntelliJ IDEA**
1. ثبت إضافة "PlantUML integration"
2. افتح ملف `.puml`
3. شاهد المخطط مباشرة

---

## 📝 ملاحظات

### ✅ **فوائد المخططات**
- فهم تدفق البيانات بصرياً
- رؤية العلاقات بين المكونات
- تسهيل التعلم للمبتدئين
- توثيق المشروع

### ✅ **نصائح**
- ابدأ بمخطط الهيكل العام
- ثم انتقل لمخططات التدفق
- ادرس مخطط قاعدة البيانات لفهم العلاقات
- استخدم مخطط الـ Middleware لفهم الأمان

---

## 🎓 للمبتدئين

### كيف تقرأ المخططات؟

#### **Sequence Diagram (مخطط التسلسل)**
- الأسهم تمثل الرسائل/الطلبات
- الخطوط العمودية تمثل الوقت (من الأعلى للأسفل)
- المستطيلات تمثل المكونات (Controllers, Models, etc.)

#### **Entity Relationship (علاقات الكيانات)**
- المستطيلات تمثل الجداول/Models
- الخطوط تمثل العلاقات
- `||--o{` تعني "واحد إلى متعدد" (One-to-Many)
- `||--||` تعني "واحد إلى واحد" (One-to-One)

#### **Use Case (حالات الاستخدام)**
- الدوائر تمثل الوظائف
- الأشخاص تمثل المستخدمين
- الأسهم تمثل من يمكنه الوصول

---

## ✨ الخلاصة

هذه المخططات تساعدك على:
- ✅ فهم بنية المشروع
- ✅ رؤية تدفق البيانات
- ✅ فهم العلاقات بين المكونات
- ✅ معرفة الصلاحيات والأمان

**الخطوة التالية:** ارجع لـ `ARABIC_GUIDE.md` لقراءة الشرح التفصيلي! 📚

---

*تم إنشاء هذه المخططات خصيصاً للمطورين المبتدئين 💙*
