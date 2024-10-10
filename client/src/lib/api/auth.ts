import { Safe, safe, safeData, safeError } from "../safe";
import { commonHeaders } from "./constants";
import {
  LoginResponse,
  loginResponseSchema,
  User,
  userSchema,
} from "./schemas";
import { Credentials } from "./types";

async function login({
  email,
  password,
}: Credentials): Promise<Safe<LoginResponse>> {
  const resultHeaders = await safe(
    fetch("/api/users/login", {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({ email, password }),
    })
  );

  if (!resultHeaders.success) return safeError("Failed to fetch");

  const resultData = await safe(resultHeaders.data.json());

  if (!resultData.success) return safeError("Failed to parse data");

  if (!resultHeaders.data.ok) return safeError(resultData.data.message);

  return safe(() => loginResponseSchema.parse(resultData.data));
}

async function register(values: any): Promise<Safe<LoginResponse>> {
  const resultHeaders = await safe(
    fetch("/api/users/register", {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify(values),
    })
  );

  if (!resultHeaders.success) return safeError("Failed to fetch");

  const resultData = await safe(resultHeaders.data.json());

  if (!resultData.success) return safeError("Failed to parse data");

  if (!resultHeaders.data.ok) return safeError(resultData.data.message);

  return safe(() => resultData.data);
}

async function getIdentity(): Promise<Safe<User>> {
  const resultHeaders = await safe(
    fetch("/api/users/current", {
      method: "GET",
      headers: commonHeaders,
    })
  );

  if (!resultHeaders.success) return safeError("Failed to fetch");

  const resultData = await safe(resultHeaders.data.json());

  if (!resultData.success) return safeError("Failed to parse data");

  if (!resultHeaders.data.ok) return safeError(resultData.data.message);

  return safe(() => userSchema.parse(resultData.data));
}

async function logout(): Promise<Safe<void>> {
  const resultHeaders = await safe(
    fetch("/api/users/logout", { method: "POST" })
  );

  if (!resultHeaders.success) return safeError("Failed to fetch");
  if (!resultHeaders.data.ok) return safeError("Failed to logout");
  return safeData(undefined);
}

export default { login, register, getIdentity, logout };
