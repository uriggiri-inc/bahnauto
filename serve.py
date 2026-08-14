#!/usr/bin/env python3
"""로컬 미리보기 서버.

GitHub Pages와 동일하게 확장자 없는 경로를 처리합니다.
    /about  ->  about.html
    /about/ ->  about/index.html
없는 경로는 404.html을 404 상태로 돌려줍니다.

파이썬 기본 `http.server`는 이 규칙을 모르기 때문에 /about 이 404가 납니다.
반드시 이 스크립트로 띄워서 확인하세요.

    python3 serve.py            # http://localhost:8000
    python3 serve.py 3000       # 포트 지정
"""

import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))


class PagesHandler(SimpleHTTPRequestHandler):
    """GitHub Pages의 경로 해석 규칙을 흉내낸 핸들러."""

    def translate_path(self, path):
        resolved = super().translate_path(path)

        # 이미 존재하는 파일이면 그대로
        if os.path.isfile(resolved):
            return resolved

        # 디렉터리면 index.html
        if os.path.isdir(resolved):
            index = os.path.join(resolved, "index.html")
            if os.path.isfile(index):
                return index

        # 확장자 없는 경로면 .html 을 붙여본다
        if not os.path.splitext(resolved)[1]:
            candidate = resolved.rstrip("/") + ".html"
            if os.path.isfile(candidate):
                return candidate

        return resolved

    def send_error(self, code, message=None, explain=None):
        """404는 사이트의 404.html 로 응답."""
        if code == 404:
            page = os.path.join(ROOT, "404.html")
            if os.path.isfile(page):
                with open(page, "rb") as f:
                    body = f.read()
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                if self.command != "HEAD":
                    self.wfile.write(body)
                return
        super().send_error(code, message, explain)

    def end_headers(self):
        # 로컬에서는 캐시가 방해되므로 끔
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s\n" % (fmt % args))


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = partial(PagesHandler, directory=ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print("로컬 서버 실행 중  →  http://localhost:%d" % port)
    print("종료하려면 Ctrl+C\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 종료했습니다.")
        server.server_close()


if __name__ == "__main__":
    main()
