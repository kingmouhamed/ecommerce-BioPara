import { useState, useCallback } from 'react';

/**
 * Hook لإرسال البريد الإلكتروني
 * @returns {Object} - دوال وحالة إرسال البريد
 */
export function useEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * إرسال بريد ترحيب
   * @param {Object} data - بيانات المستخدم
   */
  const sendWelcomeEmail = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/email/welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('تم إرسال بريد الترحيب بنجاح!');
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'فشل إرسال البريد');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'حدث خطأ أثناء إرسال البريد';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * إرسال بريد التحقق
   * @param {Object} data - بيانات التحقق
   */
  const sendVerificationEmail = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/email/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('تم إرسال بريد التحقق بنجاح!');
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'فشل إرسال بريد التحقق');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'حدث خطأ أثناء إرسال بريد التحقق';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * إرسال بريد استعادة كلمة المرور
   * @param {Object} data - بيانات الاستعادة
   */
  const sendPasswordResetEmail = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/email/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('تم إرسال بريد استعادة كلمة المرور بنجاح!');
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'فشل إرسال بريد استعادة كلمة المرور');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'حدث خطأ أثناء إرسال بريد استعادة كلمة المرور';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * مسح الحالة
   */
  const clearState = useCallback(() => {
    setError(null);
    setSuccess(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    success,
    sendWelcomeEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
    clearState,
  };
}
