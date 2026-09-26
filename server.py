import http.server
import socketserver
import json
import os
import sys

PORT = 3000
if len(sys.argv) > 1:
    PORT = int(sys.argv[1])

def load_env():
    env_candidates = [
        os.path.join(os.getcwd(), '.env'),
        os.path.join(os.path.dirname(os.getcwd()), '.env'),
        os.path.join(os.path.dirname(os.getcwd()), 'doctor_managment', '.env')
    ]
    for env_file in env_candidates:
        if os.path.exists(env_file):
            try:
                with open(env_file, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            k, v = line.split('=', 1)
                            key_name = k.strip()
                            if key_name not in os.environ:
                                os.environ[key_name] = v.strip().strip('\"\'')
            except Exception:
                pass

load_env()

class PortfolioServer(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        path = self.path.split('?')[0]
        if path == '/api/config':
            api_key = os.environ.get('GOOGLE_API_KEY') or os.environ.get('GEMINI_API_KEY') or os.environ.get('VITE_GEMINI_API_KEY') or ''
            res_bytes = json.dumps({'apiKey': api_key}).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(res_bytes)))
            self.end_headers()
            self.wfile.write(res_bytes)
            return

        super().do_GET()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), PortfolioServer) as httpd:
        print(f"Serving Portfolio HTTP server on port {PORT}...", flush=True)
        httpd.serve_forever()
