/** 폼 제출 결과 등 비차단 알림. */
export interface ToastProps {
  tone?: "success" | "danger" | "brand";
  title: string;
  description?: string;
  onClose?: () => void;
}
export declare function Toast(props: ToastProps): JSX.Element;
