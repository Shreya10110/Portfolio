/* ==========================================================================
   SHREYA GHODMARE — PORTFOLIO ENGINE & INTERACTION CONTROLLERS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- 1. Dedicated Full-Screen Entrance Landing Page Controller ---
  const landingPage = document.getElementById('landing-entrance-page');
  let landingDismissed = false;

  window.dismissLandingPage = function() {
    if (landingDismissed || !landingPage) return;
    landingDismissed = true;
    landingPage.classList.add('dismissed');
    setTimeout(() => {
      landingPage.style.display = 'none';
    }, 1150);
  };

  if (landingPage) {
    // Auto-transition into main portfolio after 2.65 seconds
    setTimeout(() => {
      window.dismissLandingPage();
    }, 2650);
  }

  // --- 2. Continuous Parallax Side Watermark System ---
  const leftWatermarkCol = document.querySelector('.watermark-side-left');
  const rightWatermarkCol = document.querySelector('.watermark-side-right');
  
  if (leftWatermarkCol || rightWatermarkCol) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (leftWatermarkCol) {
        leftWatermarkCol.style.transform = `translate3d(0, ${scrollY * -0.05}px, 0)`;
      }
      if (rightWatermarkCol) {
        rightWatermarkCol.style.transform = `translate3d(0, ${scrollY * 0.035}px, 0)`;
      }
    }, { passive: true });
  }

  // --- 3. Active Nav Link Scroll Observer ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollY = window.scrollY;
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 130;
      const sectionHeight = sec.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // --- 4. Initialize Cursor-Triggered Project Screenshot Slideshows ---
  initProjectSlideshows();

  // --- 5. Initialize Cursor-Triggered Achievement Multi-Photo Slideshows ---
  initAchievementSlideshows();
});

/* ==========================================================================
   PROJECT SCREENSHOT SLIDESHOW (HOVER CURSOR TRIGGERS PLAYBACK)
   ========================================================================== */
function initProjectSlideshows() {
  const viewports = document.querySelectorAll('.slideshow-viewport');

  viewports.forEach(vp => {
    const stage = vp.querySelector('.slideshow-stage');
    const items = vp.querySelectorAll('.slideshow-item');
    const counter = vp.querySelector('.slideshow-counter');
    const prevBtn = vp.querySelector('.prev-btn');
    const nextBtn = vp.querySelector('.next-btn');

    if (!stage || items.length <= 1) return;

    let currentIndex = 0;
    const total = items.length;
    let autoTimer = null;

    function updateSlide() {
      stage.style.transform = `translateX(-${currentIndex * 100}%)`;
      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${total}`;
      }
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % total;
      updateSlide();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + total) % total;
      updateSlide();
    }

    function startSlideshow() {
      if (!autoTimer) {
        autoTimer = setInterval(nextSlide, 2800);
      }
    }

    function stopSlideshow() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    // Cursor hover triggers playback
    vp.addEventListener('mouseenter', startSlideshow);
    vp.addEventListener('mouseleave', stopSlideshow);

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
      });
    }

    let touchStartX = 0;
    vp.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    vp.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });
  });
}

/* ==========================================================================
   ACHIEVEMENT MULTI-PHOTO SLIDESHOW (HOVER CURSOR TRIGGERS PLAYBACK)
   ========================================================================== */
function initAchievementSlideshows() {
  const achSlideshows = document.querySelectorAll('.achievement-photo-slideshow');

  achSlideshows.forEach(ss => {
    const track = ss.querySelector('.achievement-photo-track');
    const slides = ss.querySelectorAll('.achievement-photo-slide');
    const counter = ss.querySelector('.achievement-photo-counter');

    if (!track || slides.length <= 1) return;

    let currentIndex = 0;
    const total = slides.length;
    let autoTimer = null;

    function updateAchievementSlide() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${total}`;
      }
    }

    function nextAchievementSlide() {
      currentIndex = (currentIndex + 1) % total;
      updateAchievementSlide();
    }

    function startAchSlideshow() {
      if (!autoTimer) {
        autoTimer = setInterval(nextAchievementSlide, 2800);
      }
    }

    function stopAchSlideshow() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    ss.addEventListener('mouseenter', startAchSlideshow);
    ss.addEventListener('mouseleave', stopAchSlideshow);
  });
}

/* ==========================================================================
   CONTACT DETAILS MODAL CONTROLLER
   ========================================================================== */
function openContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

/* ==========================================================================
   DEMO CREDENTIALS MODAL & UTILITY FUNCTIONS
   ========================================================================== */
function openDemoModal(projectName, email, password) {
  const modal = document.getElementById('demo-modal');
  const titleEl = document.getElementById('modal-project-name');
  const emailEl = document.getElementById('modal-email-val');
  const passEl = document.getElementById('modal-pass-val');
  const toggleBtn = document.getElementById('toggle-pass-btn');

  if (modal && titleEl && emailEl && passEl) {
    titleEl.textContent = projectName;
    emailEl.value = email;
    passEl.value = password;
    passEl.type = 'password';
    if (toggleBtn) toggleBtn.textContent = 'Reveal';
    modal.classList.add('active');
  }
}

function closeDemoModal() {
  const modal = document.getElementById('demo-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function togglePasswordMask() {
  const passEl = document.getElementById('modal-pass-val');
  const toggleBtn = document.getElementById('toggle-pass-btn');
  if (passEl && toggleBtn) {
    if (passEl.type === 'password') {
      passEl.type = 'text';
      toggleBtn.textContent = 'Hide';
    } else {
      passEl.type = 'password';
      toggleBtn.textContent = 'Reveal';
    }
  }
}

function copyValue(inputId, btnElement) {
  const input = document.getElementById(inputId);
  if (input) {
    navigator.clipboard.writeText(input.value).then(() => {
      const originalText = btnElement.textContent;
      btnElement.textContent = 'Copied!';
      btnElement.style.backgroundColor = '#242124';
      setTimeout(() => {
        btnElement.textContent = originalText;
        btnElement.style.backgroundColor = '#800020';
      }, 1800);
    });
  }
}

function openLightbox(imageSrc) {
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeContactModal();
    closeDemoModal();
    closeLightbox();
    closeChatbotWindow();
  }
});

/* ==========================================================================
   SHREYA'S AI PORTFOLIO ASSISTANT CHATBOT ENGINE
   ========================================================================== */

const SHREYA_KNOWLEDGE_BASE = [
  // --- GRANULAR TARGETED CONTACT & SPECIFIC DETAILS ---
  {
    keywords: ["fde certificate", "fde bootcamp certificate", "fde bootcamp", "fde cert", "fde"],
    response: "Yes. As Shreya's Executive AI Assistant, I can confirm that Shreya Ghodmare officially holds an <strong>FDE BOOTCAMP Certificate</strong>, validating her capability to build enterprise-ready AI and software engineering solutions."
  },
  {
    keywords: ["python diploma", "python certificate", "python", "python language", "know python", "python programming"],
    response: "Yes! Shreya is highly proficient in <strong>Python</strong> and holds an official Python Diploma Certificate. Python is her primary language for developing deep learning models, Computer Vision pipelines, RAG frameworks, and FastAPI microservices."
  },
  {
    keywords: ["computer vision", "cv", "opencv", "grad cam", "mri", "tumor"],
    response: "Yes, Shreya has proven expertise in <strong>Computer Vision</strong>. As an ML Engineer Intern at Leading India Pvt. Ltd., she built attention-weighted ensemble CNN models for brain tumor MRI classification achieving 97–98% validation accuracy with Grad-CAM visual heatmaps."
  },
  {
    keywords: ["web development", "web dev", "full stack", "frontend", "backend", "fastapi", "react", "web"],
    response: "Yes! Shreya has extensive hands-on experience in <strong>Full-Stack Web Engineering</strong> using React, FastAPI, REST APIs, PostgreSQL, and Supabase. She built the Multi-Warehouse Management platform and CityCare Hospital System."
  },
  {
    keywords: ["rag", "llm", "langchain", "faiss", "generative ai", "genai"],
    response: "Yes, Shreya is highly experienced in <strong>Generative AI & RAG (Retrieval-Augmented Generation)</strong>. She built KisanBandhu ( LangChain + FAISS + FLAN-T5 LLM) and integrated Gemini RAG into CityCare."
  },
  {
    keywords: ["gmail", "email", "mail id", "gmail id", "email id", "email address", "mail address", "contact email"],
    response: "Shreya Ghodmare's email address is <a href='mailto:ghodmareshreya@gmail.com'>ghodmareshreya@gmail.com</a>."
  },
  {
    keywords: ["phone", "phone number", "mobile", "contact number", "call", "whatsapp", "cell", "phone id", "mobile number"],
    response: "Shreya Ghodmare's direct contact phone number is <strong>+91 9545853876</strong>."
  },
  {
    keywords: ["location", "city", "where is she", "where does she live", "based", "nagpur", "address", "state"],
    response: "Shreya Ghodmare is based in <strong>Nagpur, Maharashtra, India</strong>."
  },
  {
    keywords: ["linkedin", "linkedin profile", "linkedin id", "linkedin link", "social"],
    response: "You can view Shreya's LinkedIn profile here: <a href='https://www.linkedin.com/in/shreya-ghodmare-216417308/' target='_blank'>Shreya's LinkedIn Profile</a>."
  },
  {
    keywords: ["github", "github profile", "github id", "github link", "repos", "repositories", "code"],
    response: "You can view Shreya's GitHub repositories here: <a href='https://github.com/Shreya10110' target='_blank'>Shreya's GitHub Profile</a>."
  },
  {
    keywords: ["cgpa", "gpa", "marks", "percentage", "academic score", "grade", "score"],
    response: "Shreya holds a CGPA of <strong>8.07</strong> in her B.Tech in Information Technology at St. Vincent Pallotti College of Engineering and Technology, Nagpur."
  },

  // --- GENERAL PROFILE CATEGORIES ---
  {
    keywords: ["name", "who is shreya", "who are you", "tell me about shreya", "bio", "overview", "introduction", "about shreya", "background", "summary"],
    response: "<strong>Shreya Ghodmare</strong> is an AI/ML Engineer and final-year B.Tech IT student at St. Vincent Pallotti College of Engineering & Technology, Nagpur (graduating June 2027, CGPA: 8.07). She is a published AI researcher with 3 paper publications and winner of 5× national hackathons."
  },
  {
    keywords: ["skill", "skills", "technology", "tech stack", "languages", "python", "sql", "frameworks", "tools", "ml", "ai", "genai", "deep learning", "computer vision", "rag", "fastapi", "react", "tensorflow", "postgres", "mongodb"],
    response: "Shreya's core technical stack:<br/>• <strong>Languages:</strong> Python, SQL<br/>• <strong>AI/ML & GenAI:</strong> Machine Learning, Deep Learning, Computer Vision, RAG, Explainable AI (Grad-CAM), LangChain, FAISS, Gemini, FLAN-T5, MiniLM<br/>• <strong>Backend & Databases:</strong> FastAPI, REST APIs, JWT Auth, PostgreSQL, MongoDB<br/>• <strong>Libraries & Tools:</strong> TensorFlow, NumPy, Pandas, Scikit-learn, OpenCV, Git."
  },
  {
    keywords: ["education", "college", "degree", "b.tech", "study", "university", "pallotti", "school", "graduation"],
    response: "Shreya is pursuing her <strong>B.Tech in Information Technology</strong> at <strong>St. Vincent Pallotti College of Engineering and Technology, Nagpur</strong> (2023 – 2027) with a CGPA of <strong>8.07</strong>."
  },
  {
    keywords: ["experience", "internship", "intern", "leading india", "work", "job", "mri", "tumor", "brain tumor", "grad-cam", "xai", "noida"],
    response: "Shreya served as an <strong>ML Engineer Intern</strong> at <strong>Leading India Pvt. Ltd. (Noida)</strong> from Jan to Apr 2026, building brain tumor MRI classifiers with <strong>97–98% validation accuracy</strong> and Grad-CAM Explainable AI (XAI)."
  },
  {
    keywords: ["project", "projects", "portfolio projects", "built", "systems"],
    response: "Shreya has built 3 flagship end-to-end systems:<br/>1. 🌾 <strong>KisanBandhu:</strong> RAG Agricultural Advisory (<a href='https://kisan-bandhu-4wlq.onrender.com/' target='_blank'>Live Demo</a>)<br/>2. 🏥 <strong>CityCare:</strong> Hospital Management with Gemini RAG (<a href='https://citycare-frontend.onrender.com/login' target='_blank'>Live Demo</a>)<br/>3. 📦 <strong>Multi-Warehouse System:</strong> Fulfillment & Logistics (<a href='https://warehouse-frontend-v2cu.onrender.com/login' target='_blank'>Live Demo</a>)"
  },
  {
    keywords: ["kisanbandhu", "kisan bandhu", "kisan", "agriculture", "farmer", "rag agricultural", "contract farming"],
    response: "🌾 <strong>KisanBandhu</strong> is an end-to-end RAG agricultural advisory platform utilizing PyPDF ingestion, LangChain chunking, FAISS vector database, and FLAN-T5 LLM for semantic advisory.<br/>👉 <a href='https://kisan-bandhu-4wlq.onrender.com/' target='_blank'>Live Demo</a>"
  },
  {
    keywords: ["citycare", "city care", "hospital", "patient", "prescription", "doctor", "health"],
    response: "🏥 <strong>CityCare</strong> is an AI-enabled Hospital Management System with role-based access, appointment scheduling, digital prescription workflows, and Gemini RAG assistance.<br/>👉 <a href='https://citycare-frontend.onrender.com/login' target='_blank'>Live Demo</a>"
  },
  {
    keywords: ["warehouse", "inventory", "logistics", "fulfillment", "shipping"],
    response: "📦 <strong>Multi-Warehouse Management System</strong> is a cloud logistics platform built with React, FastAPI, PostgreSQL, Supabase, and JWT authentication.<br/>👉 <a href='https://warehouse-frontend-v2cu.onrender.com/login' target='_blank'>Live Demo</a>"
  },
  {
    keywords: ["research", "paper", "publication", "publications", "inspiro", "pose", "blockchain", "scopus", "indjcst"],
    response: "Shreya has 3 published research papers:<br/>1. 📄 <em>AI Pose Estimation for Telerehabilitation</em> (ARET, Scopus-indexed)<br/>2. 📄 <em>INSPIRO: AI Institution Auditor</em> (INDJCST)<br/>3. 📄 <em>Blockchain Platform for Contract Farming</em> (INDJCST)"
  },
  {
    keywords: ["achievement", "achievements", "hackathon", "award", "awards", "winner", "contest", "competition"],
    response: "🏆 Shreya is a <strong>5× National-Level Winner/Runner-Up</strong>, including 1st Runner-Up at NIT Rising India Hackathon (out of 220 teams) and 1st Prize Winner at SB Jain Ideathon."
  },
  {
    keywords: ["certificate", "certifications", "list all certificates"],
    response: "📜 Shreya's certifications include:<br/>• Official FDE BOOTCAMP Certificate<br/>• Python Diploma Certificate<br/>• Winner Certificates for 5x National Hackathons and Conference presentations."
  },
  {
    keywords: ["leadership", "csi", "cii", "technex", "joint secretary"],
    response: "👑 Leadership Positions:<br/>• <strong>Joint Secretary</strong> — Computer Society of India (CSI) Student Chapter<br/>• <strong>Registration Head</strong> — CII 2025 Conference<br/>• <strong>Promotion Lead</strong> — TECHNEX 2025"
  },
  {
    keywords: ["contact", "reach", "hire"],
    response: "📫 Reach Shreya via:<br/>• <strong>Email:</strong> <a href='mailto:ghodmareshreya@gmail.com'>ghodmareshreya@gmail.com</a><br/>• <strong>Phone:</strong> +91 9545853876<br/>• <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/shreya-ghodmare-216417308/' target='_blank'>LinkedIn Profile</a>"
  }
];

const OUT_OF_SCOPE_RESPONSE = "I am configured as <strong>Shreya Ghodmare's Executive AI Assistant</strong> and can only provide details regarding Shreya's professional qualifications, engineering projects, technical skills, research publications, and background.";

let cachedApiKey = null;

async function fetchApiKey() {
  if (cachedApiKey) return cachedApiKey;
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      if (data && data.apiKey) {
        cachedApiKey = data.apiKey;
        return cachedApiKey;
      }
    }
  } catch (err) {
    console.log('Could not fetch API config:', err);
  }
  return '';
}

async function callGeminiDirectly(userQuery) {
  const apiKey = await fetchApiKey();
  if (!apiKey) return null;

  const systemPrompt = `You are Shreya Ghodmare's Executive AI Assistant. Speak with high confidence, authority, and professionalism on behalf of Shreya Ghodmare.

CONFIDENT DOMAIN MATCHING & DIRECT ANSWERING RULES:
1. ALWAYS ANSWER CONFIDENTLY AND DIRECTLY FIRST:
   - If the user asks whether Shreya knows a skill, has a certificate, or has experience in a domain that matches her resume (e.g., Python, AI/ML, Machine Learning, Deep Learning, Computer Vision, RAG, Web Development, FastAPI, React, SQL, FDE, Brain Tumor Classification, etc.), CONFIDENTLY state: "Yes, Shreya is highly proficient in [Domain]..." or "Yes, Shreya officially holds [Certificate]..." or "Yes, Shreya has strong hands-on expertise in [Skill]..."
   - Immediately follow up with 1-2 concise, impressive sentences detailing her real-world projects, internship, or research publications in that domain.
2. NO GENERIC LISTINGS:
   - NEVER output a passive bulleted list or a generic dump of unrelated certificates or skills when a specific domain or question is asked.
   - Only list items if the user explicitly asks: "List all certificates" or "List all projects".
3. OUT OF SCOPE DISCLAIMER:
   - If a topic is completely unrelated to Shreya or her resume/qualifications, state with executive politeness: "I am configured as Shreya Ghodmare's Executive AI Assistant and can only provide details regarding Shreya's professional qualifications, technical skills, engineering projects, research, and credentials."

RESUME & QUALIFICATION MATRIX:
- Full Name: Shreya Ghodmare
- Education: B.Tech in Information Technology, St. Vincent Pallotti College of Engineering & Technology, Nagpur (Graduation: June 2027, CGPA: 8.07).
- Core Domains & Skills:
  * Artificial Intelligence (AI), Machine Learning (ML), Deep Learning, Computer Vision (CV), Explainable AI (Grad-CAM), Generative AI (GenAI), RAG (Retrieval-Augmented Generation), LangChain, FAISS vector store, FLAN-T5 LLM, Gemini API, MiniLM embeddings.
  * Backend & Web Engineering: Python, SQL, FastAPI, REST APIs, JWT Authentication, React.js, HTML/CSS, PostgreSQL, MongoDB, Supabase.
  * Libraries & Data Science Tools: TensorFlow, Keras, OpenCV, NumPy, Pandas, Scikit-learn, Git, PyPDF.
- Certifications & Credentials:
  * Official FDE BOOTCAMP Certificate
  * Python Diploma Certificate
  * Winner Certificates for 5x National Hackathons, Idea Pitching, and Conferences.
- Internship Experience: ML Engineer Intern at Leading India Pvt. Ltd. (Noida) — Built attention-weighted ensemble CNN (MobileNetV2, EfficientNetB0, Custom CNN) for brain tumor MRI classification with 97–98% validation accuracy and Grad-CAM heatmaps.
- Flagship Projects:
  1. KisanBandhu: RAG Agricultural Advisory Platform (LangChain, FAISS, FLAN-T5 LLM, PyPDF, Contract Farming).
  2. CityCare: AI Hospital Management System with Gemini RAG, digital prescriptions, Cloudinary storage, role-based access.
  3. Multi-Warehouse Management System: Cloud logistics & fulfillment with shift control, manager queues, automated shipping labels (React, FastAPI, PostgreSQL).
- Published Research Papers (3 Publications):
  1. AI Pose Estimation for Exercise Error Detection (ARET Conference, Scopus-indexed).
  2. INSPIRO: AI Institution Auditor (INDJCST).
  3. Blockchain Platform for Transparent Contract Farming (INDJCST).
- Achievements & Leadership: 5x National Hackathon Winner/Runner-Up (1st Runner-Up at NIT Rising India Hackathon among 220 teams, 1st Prize at SB Jain Ideathon), Joint Secretary of CSI Student Chapter.`;

  const models = ['gemini-3.6-flash', 'gemini-3.5-flash'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userQuery }] }]
      };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.warn(`Direct fetch to ${model} failed:`, e);
    }
  }
  return null;
}

function toggleChatbot() {
  const win = document.getElementById('shreya-chatbot-window');
  if (win) {
    win.classList.toggle('active');
    if (win.classList.contains('active')) {
      const input = document.getElementById('chatbot-input-field');
      if (input) input.focus();
    }
  }
}

function closeChatbotWindow() {
  const win = document.getElementById('shreya-chatbot-window');
  if (win) {
    win.classList.remove('active');
  }
}

function resetChatbotLog() {
  const messagesList = document.getElementById('chatbot-messages-list');
  if (messagesList) {
    messagesList.innerHTML = `
      <div class="chat-msg bot-msg">
        <div class="chat-msg-bubble">
          Welcome. I am <strong>Shreya Ghodmare's Executive AI Assistant</strong>.
          <br/><br/>
          I am configured to provide precise information regarding Shreya's engineering background, AI/ML research, technical projects, and credentials.
          <br/><br/>
          How may I assist you today?
        </div>
      </div>
    `;
  }
}

function handleChatbotKeyDown(e) {
  if (e.key === 'Enter') {
    handleChatbotSend();
  }
}

function sendQuickPrompt(promptText) {
  const inputField = document.getElementById('chatbot-input-field');
  if (inputField) {
    inputField.value = promptText;
    handleChatbotSend();
  }
}

async function handleChatbotSend() {
  const inputField = document.getElementById('chatbot-input-field');
  const messagesList = document.getElementById('chatbot-messages-list');
  if (!inputField || !messagesList) return;

  const userQuery = inputField.value.trim();
  if (!userQuery) return;

  // Render User Message
  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'chat-msg user-msg';
  userMsgDiv.innerHTML = `<div class="chat-msg-bubble">${escapeHtml(userQuery)}</div>`;
  messagesList.appendChild(userMsgDiv);

  inputField.value = '';
  scrollChatToBottom();

  // Show Typing Indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg bot-msg typing-msg';
  typingDiv.innerHTML = `<div class="chat-msg-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  messagesList.appendChild(typingDiv);
  scrollChatToBottom();

  let botResponse = '';

  // 1. Primary: Direct Client-Side Gemini API call using user's GOOGLE_API_KEY
  try {
    const directReply = await callGeminiDirectly(userQuery);
    if (directReply) {
      botResponse = formatGeminiResponse(directReply);
    }
  } catch (err) {
    console.log('Gemini API call error, using refined knowledge base:', err);
  }

  // 2. Fallback: Refined local Knowledge Base if Gemini API is unreachable or key invalid
  if (!botResponse) {
    botResponse = matchQueryToKnowledgeBase(userQuery);
  }

  // Remove Typing Indicator
  if (typingDiv.parentNode) {
    typingDiv.parentNode.removeChild(typingDiv);
  }

  const botMsgDiv = document.createElement('div');
  botMsgDiv.className = 'chat-msg bot-msg';
  botMsgDiv.innerHTML = `<div class="chat-msg-bubble">${botResponse}</div>`;
  messagesList.appendChild(botMsgDiv);
  scrollChatToBottom();

  if (window.lucide) {
    lucide.createIcons();
  }
}

function formatGeminiResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n/g, '<br/>');
}

function matchQueryToKnowledgeBase(query) {
  const normalized = query.toLowerCase().replace(/[^\w\s]/gi, '');
  let bestMatch = null;
  let maxScore = 0;

  SHREYA_KNOWLEDGE_BASE.forEach(entry => {
    let score = 0;
    entry.keywords.forEach(kw => {
      if (normalized.includes(kw)) {
        score += kw.length * 2;
      }
    });
    if (score > maxScore) {
      maxScore = score;
      bestMatch = entry;
    }
  });

  if (bestMatch && maxScore > 0) {
    return bestMatch.response;
  } else {
    return OUT_OF_SCOPE_RESPONSE;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

function scrollChatToBottom() {
  const messagesList = document.getElementById('chatbot-messages-list');
  if (messagesList) {
    messagesList.scrollTop = messagesList.scrollHeight;
  }
}



