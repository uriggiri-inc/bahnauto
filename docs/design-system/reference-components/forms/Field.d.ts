/**
 * 라벨 + 컨트롤 + 힌트/오류를 묶는 폼 필드 래퍼.
 * 오류는 필드 하단 인라인 + aria-invalid / role="alert" 로 연결한다.
 */
export interface FieldProps {
  label: string;
  required?: boolean;
  /** 있으면 hint 대신 표시되고 role="alert" 로 읽힌다 */
  error?: string;
  hint?: string;
  htmlFor?: string;
  children?: React.ReactNode;
}
export declare function Field(props: FieldProps): JSX.Element;

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  /** true면 textarea로 렌더 */
  multiline?: boolean;
  rows?: number;
}
export declare function TextInput(props: TextInputProps): JSX.Element;
