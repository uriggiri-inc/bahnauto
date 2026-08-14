#!/usr/bin/env python3
"""페이지 검사.

새로 올린 HTML 파일이 사이트에서 제대로 동작할지 미리 확인합니다.
개발 경험이 없어도 실수를 병합 전에 잡을 수 있도록, 문제마다 고치는 방법을 함께 알려줍니다.

검사 항목
    1. 파일 인코딩       UTF-8 이 아니면 한글이 깨집니다
    2. 파일 이름         소문자·영문·숫자·하이픈만. 파일 이름이 곧 주소입니다
    3. 페이지 기본 요건   doctype / lang / charset / title
    4. 내부 링크         가리키는 페이지·이미지가 실제로 있는지
    5. 필수 파일         CNAME, .nojekyll, 404.html

경로 해석은 GitHub Pages와 같은 규칙을 씁니다.
    /about  ->  about.html  또는  about/index.html

외부 링크(http, mailto, tel)와 앵커(#)는 검사하지 않습니다. 네트워크를 쓰지 않아 빠릅니다.

    python3 tools/check-pages.py
"""

import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {".git", ".github", "node_modules", "tools"}
SKIP_SCHEMES = ("http://", "https://", "mailto:", "tel:", "data:", "javascript:", "//")
FILENAME_OK = re.compile(r"^[a-z0-9][a-z0-9._-]*\.html$")
REQUIRED_FILES = ["CNAME", ".nojekyll", "404.html"]

problems = []


def fail(where, what, how):
    problems.append((where, what, how))


class LinkCollector(HTMLParser):
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
        for fn in sorted(filenames):
            if fn.endswith(".html"):
                yield os.path.join(dirpath, fn)


def rel(path):
    return os.path.relpath(path, ROOT)


def check_filename(source):
    name = os.path.basename(source)
    if FILENAME_OK.match(name):
        return

    hints = []
    if name != name.lower():
        hints.append("대문자를 소문자로")
    if " " in name:
        hints.append("공백을 하이픈(-)으로")
    if not all(ord(c) < 128 for c in name):
        hints.append("한글·특수문자를 영문으로")

    fail(
        rel(source),
        "파일 이름을 주소로 쓸 수 없습니다",
        "%s 바꿔주세요. 예: '회사 연혁.html' → 'history.html' (주소는 /history 가 됩니다)"
        % (", ".join(hints) if hints else "영문 소문자·숫자·하이픈만"),
    )


def check_basics(source, content):
    head = content[:2000].lower()

    if "<!doctype" not in head:
        fail(rel(source), "<!DOCTYPE html> 선언이 없습니다",
             "파일 맨 첫 줄에 <!DOCTYPE html> 을 넣어주세요.")

    if not re.search(r"<html[^>]*\slang=", head):
        fail(rel(source), "html 태그에 lang 속성이 없습니다",
             '<html> 을 <html lang="ko"> 로 바꿔주세요. 검색엔진과 번역기가 한국어 페이지로 인식합니다.')

    if not re.search(r'<meta[^>]*charset=["\']?utf-8', head):
        fail(rel(source), "charset 선언이 없습니다",
             '<head> 안 맨 위에 <meta charset="UTF-8"> 을 넣어주세요. 없으면 한글이 깨질 수 있습니다.')

    if "<title>" not in head:
        fail(rel(source), "<title> 이 없습니다",
             "<head> 안에 <title>페이지 이름 | (주)우리끼리</title> 를 넣어주세요. 브라우저 탭과 검색 결과에 표시됩니다.")


def resolve(link, source):
    path = link.split("#")[0].split("?")[0]
    if not path:
        return source

    if path.startswith("/"):
        target = os.path.join(ROOT, path.lstrip("/"))
    else:
        target = os.path.normpath(os.path.join(os.path.dirname(source), path))

    if os.path.isfile(target):
        return target

    if os.path.isdir(target):
        index = os.path.join(target, "index.html")
        return index if os.path.isfile(index) else None

    if not os.path.splitext(target)[1]:
        candidate = target.rstrip("/") + ".html"
        if os.path.isfile(candidate):
            return candidate

    return None


def check_links(source, content):
    # 주석 안의 링크는 검사하지 않는다 (문의 폼 예시 등)
    content = re.sub(r"<!--.*?-->", "", content, flags=re.DOTALL)

    collector = LinkCollector()
    collector.feed(content)

    count = 0
    for link, line in collector.links:
        if link.startswith(SKIP_SCHEMES) or link.startswith("#"):
            continue
        count += 1
        if resolve(link, source) is None:
            if re.search(r"\.(png|jpe?g|gif|svg|webp|ico)$", link, re.I):
                how = "이미지 파일을 assets/ 폴더에 올렸는지, 파일 이름 철자가 같은지 확인해주세요. 대소문자도 구분합니다."
            else:
                how = "링크한 페이지 파일이 아직 없습니다. 페이지를 먼저 만들거나 링크를 빼주세요."
            fail("%s:%d" % (rel(source), line), "링크 대상을 찾을 수 없습니다 → %s" % link, how)
    return count


def check_required_files():
    for name in REQUIRED_FILES:
        if not os.path.exists(os.path.join(ROOT, name)):
            fail(name, "필수 파일이 없습니다",
                 "이 파일을 지우면 사이트가 정상 동작하지 않습니다. 삭제를 되돌려주세요.")

    cname = os.path.join(ROOT, "CNAME")
    if os.path.isfile(cname):
        with open(cname, encoding="utf-8") as f:
            if f.read().strip() != "bahnauto.kr":
                fail("CNAME", "내용이 bahnauto.kr 가 아닙니다",
                     "이 파일에는 bahnauto.kr 한 줄만 있어야 합니다. 바뀌면 도메인 연결이 끊깁니다.")


def main():
    pages = 0
    links = 0

    for source in html_files():
        pages += 1
        check_filename(source)

        try:
            with open(source, encoding="utf-8") as f:
                content = f.read()
        except UnicodeDecodeError:
            fail(rel(source), "파일이 UTF-8 인코딩이 아닙니다",
                 "메모장에서 [다른 이름으로 저장] → 인코딩을 'UTF-8'로 선택해 다시 저장해주세요. "
                 "그대로 두면 사이트에서 한글이 전부 깨집니다.")
            continue

        check_basics(source, content)
        links += check_links(source, content)

    check_required_files()

    print("페이지 %d개, 내부 링크 %d개 검사" % (pages, links))

    if problems:
        print("\n문제 %d건을 찾았습니다.\n" % len(problems))
        for where, what, how in problems:
            print("  [%s]" % where)
            print("    문제: %s" % what)
            print("    해결: %s\n" % how)
        print("위 내용을 고쳐서 다시 올려주세요. 잘 모르겠으면 PR에 댓글로 물어보세요.")
        return 1

    print("문제 없습니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
