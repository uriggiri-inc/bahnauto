/**
 * 데스크톱 탭 ↔ 모바일 아코디언. button role="tab" / aria-selected 로 구현되어 키보드 접근 가능.
 * 패널은 min-height 고정으로 탭 전환 시 CLS가 발생하지 않는다.
 */
export interface TabsProps {
  items?: Array<{ id: string; label: string; content: React.ReactNode }>;
  /** 제어형으로 쓸 때 */
  value?: string;
  onChange?: (id: string) => void;
  /** 768px 미만에서는 'accordion' 으로 전환한다 */
  mode?: "tabs" | "accordion";
}
export declare function Tabs(props: TabsProps): JSX.Element;
