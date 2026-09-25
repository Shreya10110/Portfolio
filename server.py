import http.server
import socketserver
import json
import urllib.request
import os
import sys

PORT = 3000
if len(sys.argv) > 1:
    PORT = int(sys.argv[1])

def load_env():
    # Attempt to load .env from current directory or parent/sibling project directories
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

SYSTEM_PROMPT = """You are Shreya Ghodmare's Executive AI Assistant on her personal portfolio website.

YOUR ROLE & TONAL GUIDELINES:
- Executive, warm, articulate, highly professional, direct, and concise.
- ALWAYS answer specifically and directly what the user asks. For example:
  * If asked "what is her email?" or "tell me her gmail id" -> State: "Shreya Ghodmare's email address is ghodmareshreya@gmail.com."
  * If asked "what is her phone number?" -> State: "Shreya Ghodmare's phone number is +91 9545853876."
  * If asked "where is she located?" -> State: "Shreya Ghodmare is based in Nagpur, Maharashtra, India."
  * If asked "what is her CGPA?" -> State: "Shreya holds a CGPA of 8.07 in B.Tech Information Technology at St. Vincent Pallotti College of Engineering and Technology, Nagpur."
- Never dump unrelated contact info unless specifically asked for full contact details.

STRICT SCOPE GUARDRAIL:
- You are ONLY authorized to answer questions about Shreya Ghodmare's professional background, resume, skills, education, projects, research publications, hackathon achievements, and contact information.
- If the user asks about ANYTHING OUTSIDE THIS SCOPE (e.g. general trivia, coding homework, recipes, news, external advice), you MUST politely decline with:
"I am specifically trained as Shreya Ghodmare's Executive AI Assistant. I am configured to provide information strictly regarding Shreya's professional background, resume, technical skills, engineering projects, research publications, and credentials. I am unable to assist with out-of-scope topics, but I am at your service to answer any specific questions about Shreya's work or qualifications."

SHREYA GHODMARE'S COMPLETE RESUME KNOWLEDGE BASE:
- Full Name: Shreya Ghodmare
- Email: ghodmareshreya@gmail.com
- Phone: +91 9545853876
- Location: Nagpur, Maharashtra, India
- LinkedIn: https://www.linkedin.com/in/shreya-ghodmare-216417308/
- GitHub: https://github.com/Shreya10110
- Summary: AI/ML-focused final-year B.Tech IT student at St. Vincent Pallotti College of Engineering and Technology, Nagpur (Aug 2023 – June 2027, CGPA: 8.07). Published AI researcher with 3 research publications and 5x national-level competition achievements.
- Education: St Vincent Pallotti College of Engineering and Technology, Nagpur — B.Tech in Information Technology (CGPA: 8.07, Aug 2023 – June 2027).
- Technical Skills:
  * Programming Languages: Python, SQL
  * AI/ML: Machine Learning, Deep Learning, Computer Vision, NLP, RAG, Explainable AI (Grad-CAM)
  * GenAI: LangChain, FAISS, Gemini, FLAN-T5, MiniLM
  * Backend & APIs: FastAPI, REST APIs, JWT Authentication
  * Python Frameworks/Libraries: TensorFlow, Pandas, NumPy, Scikit-learn, Seaborn, Matplotlib, OpenCV
  * Databases: MongoDB, PostgreSQL
  * Development Tools: Git, GitHub, Visual Studio Code
- Work Experience:
  * ML Engineer Intern at Leading India Pvt. Ltd., Noida (Jan 2026 – Apr 2026):
    - Developed an attention-weighted ensemble CNN using MobileNetV2, EfficientNetB0 & Custom CNN for brain tumor classification, achieving 97–98% validation accuracy.
    - Implemented Grad-CAM with OpenCV for Explainable AI (XAI) to visualize tumor-relevant MRI regions.
    - Built an end-to-end Computer Vision pipeline using TensorFlow/Keras, OpenCV, Flask & React.
- Flagship Projects:
  1. KisanBandhu (Jan-Feb 2026): RAG-Based Agricultural Advisory & Contract Farming Platform (PyPDF ingestion, LangChain, FAISS vector database + MiniLM-L6-v2 embeddings + FLAN-T5 LLM). Live Demo: https://kisan-bandhu-4wlq.onrender.com/
  2. CityCare (Aug 2026): Role-based Hospital Management System with digital prescription workflows, Gemini-powered RAG assistant, Cloudinary PDF storage. Live Demo: https://citycare-frontend.onrender.com/login
  3. Multi-Warehouse Management & Inventory Fulfillment System: Cloud logistics system with React, FastAPI, PostgreSQL, Supabase, JWT auth, shift control centres, shipping label generator. Live Demo: https://warehouse-frontend-v2cu.onrender.com/login
- Research Publications:
  1. "AI-Based Pose Estimation System for Exercise Error Detection and Telerehabilitation Support in Resource-Constrained Settings" (ARET Conference, Scopus-indexed).
  2. "INSPIRO: An AI-Driven Institution Auditor" (INDJCST, DOI: 10.59256/indjcst.20250401004).
  3. "Blockchain Enabled Platform for Transparent Contract Farming in India" (INDJCST, DOI: 10.59256/indjcst.20260501043).
- Achievements:
  * Secured top positions in 5x National-Level Competitions (2 Hackathons, Idea Pitching, Project Competition, Research Paper Presentation).
  * 1st Runner-Up — Rising India Hackathon at NIT (competing among 220 teams).
  * 1st Prize Winner — SB Jain Ideathon.
  * 2nd Prize Winner — KDK Hackathon & Nagpur Govt Project Competition.
- Certifications: Python Diploma, FDE BOOTCAMP, Winner Certificates.
- Positions of Responsibility: Joint Secretary (Computer Society of India CSI Student Chapter SVPECT), Registration Head (CII 2025), Promotion Lead (TECHNEX 2025).
"""

class PortfolioHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                body = json.loads(post_data.decode('utf-8'))
                user_msg = body.get('message', '').strip()
                
                api_key = os.environ.get('GOOGLE_API_KEY') or os.environ.get('GEMINI_API_KEY') or os.environ.get('VITE_GEMINI_API_KEY')
                
                if not api_key:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'GOOGLE_API_KEY not found in environment or .env file'}).encode('utf-8'))
                    return
                
                # Call Gemini REST API
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
                
                payload = {
                    "system_instruction": {
                        "parts": [{"text": SYSTEM_PROMPT}]
                    },
                    "contents": [
                        {
                            "role": "user",
                            "parts": [{"text": user_msg}]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.2,
                        "maxOutputTokens": 400
                    }
                }
                
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )
                
                with urllib.request.urlopen(req, timeout=12) as resp:
                    resp_data = json.loads(resp.read().decode('utf-8'))
                    reply = resp_data['candidates'][0]['content']['parts'][0]['text']
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'reply': reply}).encode('utf-8'))
                    
            except Exception as e:
                print(f"Error calling Gemini API: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_error(404, "Endpoint not found")

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), PortfolioHTTPRequestHandler) as httpd:
    print(f"Serving Portfolio HTTP server with Gemini AI API endpoint on port {PORT}...")
    httpd.serve_forever()
