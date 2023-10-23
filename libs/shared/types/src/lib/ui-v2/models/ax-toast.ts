import { ToastType } from '../types';

export interface Toast {
  title?: string;
  message: string;
  icon?: string;
  action?: ToastAction;
  type: ToastType;
  close?: boolean;
}

export interface ToastAction {
  text: string;
  link: string;
}
