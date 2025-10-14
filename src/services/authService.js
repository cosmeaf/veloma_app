// src/services/authService.js
import {
  api,
  ACCESS_KEY, REFRESH_KEY,
  LOGIN_PATH, REFRESH_PATH, REGISTER_PATH,
  EMAIL_SEND_VERIF_PATH, EMAIL_VERIFY_PATH,
  OTP_GENERATE_PATH, OTP_VERIFY_PATH,
  RECOVERY_PATH, RESET_PASSWORD_PATH
} from "../api/api";

const AuthService = {
  async login({ username, password }) {
    const { data } = await api.post(LOGIN_PATH, { username, password });
    // Esperado: { access, refresh, user }
    if (data?.access) localStorage.setItem(ACCESS_KEY, data.access);
    if (data?.refresh) localStorage.setItem(REFRESH_KEY, data.refresh);
    return data;
  },

  async refresh() {
    const refresh = localStorage.getItem(REFRESH_KEY);
    const { data } = await api.post(REFRESH_PATH, { refresh });
    if (data?.access) localStorage.setItem(ACCESS_KEY, data.access);
    if (data?.refresh) localStorage.setItem(REFRESH_KEY, data.refresh);
    return data;
  },

  async register(payload) {
    // Alinhe os campos com UserRegisterRequest
    const { data } = await api.post(REGISTER_PATH, payload);
    return data;
  },

  async sendEmailVerification(payload) {
    // { email }
    const { data } = await api.post(EMAIL_SEND_VERIF_PATH, payload);
    return data;
  },

  async verifyEmail(payload) {
    // { code } ou { token }, conforme schema EmailVerifyRequest
    const { data } = await api.post(EMAIL_VERIFY_PATH, payload);
    return data;
  },

  async otpGenerate(payload) {
    // ex: { username } ou { delivery:"email|sms" }, conforme schema
    const { data } = await api.post(OTP_GENERATE_PATH, payload);
    return data;
  },

  async otpVerify(payload) {
    // ex: { username, code }
    const { data } = await api.post(OTP_VERIFY_PATH, payload);
    return data;
  },

  async recovery(payload) {
    // ex: { email } ou { username }, conforme schema
    const { data } = await api.post(RECOVERY_PATH, payload);
    return data;
  },

  async resetPassword(payload) {
    // ex: { token, password } conforme ResetPasswordRequest
    const { data } = await api.post(RESET_PASSWORD_PATH, payload);
    return data;
  },

  async logout() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export default AuthService;
