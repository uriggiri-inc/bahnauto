#!/usr/bin/env python3
"""내부 링크 검사.

모든 HTML 파일에서 href/src를 뽑아, 가리키는 대상이 실제로 존재하는지 확인합니다.
경로 해석은 GitHub Pages와 동일한 규칙을 씁니다.

    /about   ->  about.html  또는 about/index.html
    /        ->  index.html

외부 링크(http, mailto, tel), 앵커(#)는 검사하지 않습니다.
네트워크를 쓰지 않아 빠르고, 외부 사이트 사정에 따라 실패하지 않습니다.

    python3 tools/check-links.py
"""

import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {".git", ".github", "node_modules", "tools"}
SKIP_SCHEMES = ("http://", "https://", "mailto:", "tel:", "data:", "javascript:", "//")


class LinkCollector(HTMLParser):
    """href / src 속성과 등장 위치를 모읍니다."""

    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ("href", "src") and value:
                self.links.append((value, self.getpos()[0]))


def html_files():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if fn.endswith(".html"):
                yield os.path.join(dirpath, fn)


def resolve(link, source):
    """링크가 가리키는 실제 파일 경로를 찾습니다. 없으면 None."""
    path = link.split("#")[0].split("?")[0]
    if not path:
        return source  # 같은 페이지 앵커

    if path.startswith("/"):
        target = os.path.join(ROOT, path.lstrip("/"))
    else:
        target = os.path.normpath(os.path.join(os.path.dirname(source), path))

    if os.path.isfile(target):
        return target

    if os.path.isdir(target):
        index = os.path.join(target, "index.html")
        return index if os.path.isfile(index) else None

    # 확장자가 없으면 .html 을 붙여본다 (GitHub Pages 동작)
    if not os.path.splitext(target)[1]:
        candidate = target.rstrip("/") + ".html"
        if os.path.isfile(candidate):
            return candidate

    return None


def main():
    failures = []
    checked = 0

    for source in sorted(html_files()):
        with open(source, encoding="utf-8") as f:
            content = f.read()

        # 주석 안의 링크는 검사 대상이 아니다 (문의 폼 예시 등)
        content = re.sub(r"<!--.*?-->", "", content, flags=re.DOTALL)

        collector = LinkCollector()
        collector.feed(content)

        for link, line in collector.links:
            if link.startswith(SKIP_SCHEMES) or link.startswith("#"):
                continue
            checked += 1
            if resolve(link, source) is None:
                rel = os.path.relpath(source, ROOT)
                failures.append("%s:%d  →  %s" % (rel, line, link))

    print("내부 링크 %d개 검사" % checked)

    if failures:
        print("\n깨진 링크 %d개:" % len(failures))
        for f in failures:
            print("  " + f)
        return 1

    print("깨진 링크 없음")
    return 0


if __name__ == "__main__":
    sys.exit(main())
