const API_BASE_URL = import.meta.env.VITE_BASE_URL || "https://api4.intgrow.co";

type ApiEnvelope<T> = {
  message?: string;
  error?: string | null;
  result?: T;
} & Record<string, unknown>;

// Auth API Types
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  password: string;
  mobile_with_country_code: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  photo_url?: string;
  role?: string;
}

export interface SignInResponse {
  id: string | number;
  email: string;
  first_name: string;
  last_name: string;
  photo_url?: string;
  role?: string;
  token: string;
}

export interface SignUpResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  photo_url?: string;
  token: string;
  message: string;
}

export interface AuthError {
  message?: string;
  error?: string;
}

// Sign In
export async function signIn(request: SignInRequest): Promise<SignInResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v2/auth/signIn`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data: ApiEnvelope<SignInResponse> | SignInResponse = await response.json();

  if (!response.ok) {
    const err = (data as ApiEnvelope<SignInResponse>)?.error;
    const msg = (data as ApiEnvelope<SignInResponse>)?.message;
    throw new Error((typeof err === 'string' && err) || (typeof msg === 'string' && msg) || "Sign in failed");
  }

  // API can return either { result: { ... } } or the payload directly.
  const normalized = (data as ApiEnvelope<SignInResponse>)?.result ?? (data as SignInResponse);
  return normalized;
}

// Sign Up
export async function signUp(request: SignUpRequest): Promise<SignUpResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v2/auth/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data: ApiEnvelope<SignUpResponse> | SignUpResponse = await response.json();

  if (!response.ok) {
    const err = (data as ApiEnvelope<SignUpResponse>)?.error;
    const msg = (data as ApiEnvelope<SignUpResponse>)?.message;
    throw new Error((typeof err === 'string' && err) || (typeof msg === 'string' && msg) || "Sign up failed");
  }

  const normalized = (data as ApiEnvelope<SignUpResponse>)?.result ?? (data as SignUpResponse);
  return normalized;
}

// Change Password (requires auth token)
export async function changePassword(
  request: ChangePasswordRequest,
  token: string
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/v2/auth/changePassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Password change failed");
  }

  return data;
}

// Get current user profile
export async function getCurrentUser(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/api/v2/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data: ApiEnvelope<AuthUser> | AuthUser = await response.json();

  if (!response.ok) {
    const err = (data as ApiEnvelope<AuthUser>)?.error;
    const msg = (data as ApiEnvelope<AuthUser>)?.message;
    throw new Error((typeof err === 'string' && err) || (typeof msg === 'string' && msg) || "Failed to get user profile");
  }

  return (data as ApiEnvelope<AuthUser>)?.result ?? (data as AuthUser);
}
