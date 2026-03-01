// Rate Limiting للـ API Routes
const rateLimit = new Map();

/**
 * التحقق من Rate Limit
 * @param {string} identifier - معرف المستخدم (IP أو Email)
 * @param {number} maxRequests - الحد الأقصى للطلبات
 * @param {number} windowMs - نافذة الوقت بالمللي ثانية
 * @returns {Object} - نتيجة التحقق
 */
export function checkRateLimit(identifier, maxRequests = 5, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  // الحصول على الطلبات السابقة للمستخدم
  if (!rateLimit.has(identifier)) {
    rateLimit.set(identifier, []);
  }

  const requests = rateLimit.get(identifier);
  
  // تنظيف الطلبات القديمة
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  rateLimit.set(identifier, validRequests);

  // التحقق من الحد الأقصى
  if (validRequests.length >= maxRequests) {
    const oldestRequest = Math.min(...validRequests);
    const resetTime = oldestRequest + windowMs;
    const remainingTime = Math.ceil((resetTime - now) / 1000);

    return {
      allowed: false,
      remainingRequests: 0,
      resetTime,
      remainingTime,
      message: `Too many requests. Try again in ${remainingTime} seconds.`
    };
  }

  // إضافة الطلب الحالي
  validRequests.push(now);
  rateLimit.set(identifier, validRequests);

  return {
    allowed: true,
    remainingRequests: maxRequests - validRequests.length,
    resetTime: now + windowMs,
    remainingTime: windowMs / 1000,
    message: 'Request allowed'
  };
}

/**
 * الحصول على IP العميل
 * @param {Request} request - طلب Next.js
 * @returns {string} - IP العميل
 */
export function getClientIP(request) {
  // محاولة الحصول على IP من رؤوس مختلفة
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (clientIP) {
    return clientIP;
  }

  // في حالة التطوير المحلي
  return '127.0.0.1';
}

/**
 * Middleware للـ Rate Limiting
 * @param {Request} request - طلب Next.js
 * @param {number} maxRequests - الحد الأقصى للطلبات
 * @param {number} windowMs - نافذة الوقت
 * @returns {Object} - نتيجة التحقق أو استجابة خطأ
 */
export function rateLimitMiddleware(request, maxRequests = 5, windowMs = 60000) {
  const ip = getClientIP(request);
  const result = checkRateLimit(ip, maxRequests, windowMs);

  if (!result.allowed) {
    return {
      error: true,
      status: 429,
      message: result.message,
      remainingTime: result.remainingTime,
      headers: {
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': result.remainingRequests.toString(),
        'X-RateLimit-Reset': result.resetTime.toString(),
        'Retry-After': result.remainingTime.toString()
      }
    };
  }

  return {
    error: false,
    headers: {
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': result.remainingRequests.toString(),
      'X-RateLimit-Reset': result.resetTime.toString()
    }
  };
}

// تنظيف تلقائي كل 5 دقائق
setInterval(() => {
  const now = Date.now();
  const fiveMinutesAgo = now - 300000;

  for (const [key, requests] of rateLimit.entries()) {
    const validRequests = requests.filter(timestamp => timestamp > fiveMinutesAgo);
    if (validRequests.length === 0) {
      rateLimit.delete(key);
    } else {
      rateLimit.set(key, validRequests);
    }
  }
}, 300000); // 5 دقائق
