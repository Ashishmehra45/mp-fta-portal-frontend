import { useMutation } from '@tanstack/react-query';
import {
  userSignIn,
  UserSignInRequest,
  UserSignInResponse,
  userSignInWithApiKey
} from '@/services/intgrowApi';

export function useUserSignIn() {
  return useMutation<UserSignInResponse, Error, {
    email: string;
    password: string;
  }>({
    mutationFn: (params) => userSignIn(params),
  });
}

export function useUserSignInWithApiKey() {
  return useMutation<UserSignInResponse, Error, {
    apiKey: string;
  }>({
    mutationFn: (params) => userSignInWithApiKey(params),
  });
}
