/** FAQ 아코디언. FAQPage JSON-LD와 동일한 데이터를 소스로 쓴다. */
export interface AccordionProps {
  items?: Array<{ q: string; a: React.ReactNode }>;
  /** 초기에 열려 있을 인덱스 */
  defaultOpen?: number | null;
}
export declare function Accordion(props: AccordionProps): JSX.Element;
