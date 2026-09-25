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
    keywords: ["gmail", "email", "mail id", "gmail id", "email id", "email address", "mail address", "contact email"],
    response: "Shreya Ghodmare's email address is <a href='mailto:ghodmareshreya@gmail.com'>ghodmareshreya@gmail.com</a>."
  },
  {
    keywords: ["phone", "phone number", "mobile", "contact number", "call", "whatsapp", "cell", "phone id", "mobile number"],
    response: "Shreya Ghodmare's contact phone number is <strong>+91 9545853876</strong>."
  },
  {
    keywords: ["location", "city", "where is she", "where does she live", "based", "nagpur", "address", "state"],
    response: "Shreya Ghodmare is based in <strong>Nagpur, Maharashtra, India</strong>."
  },
  {
    keywords: ["linkedin", "linkedin profile", "linkedin id", "linkedin link", "social"],
    response: "You can connect with Shreya on LinkedIn here: <a href='https://www.linkedin.com/in/shreya-ghodmare-216417308/' target='_blank'>Shreya's LinkedIn Profile</a>."
  },
  {
    keywords: ["github", "github profile", "github id", "github link", "repos", "repositories", "code"],
    response: "You can view Shreya's open-source projects and code repositories here: <a href='https://github.com/Shreya10110' target='_blank'>Shreya's GitHub Profile</a>."
  },
  {
    keywords: ["cgpa", "gpa", "marks", "percentage", "academic score", "grade", "score"],
    response: "Shreya holds a CGPA of <strong>8.07</strong> in her B.Tech in Information Technology at St. Vincent Pallotti College of Engineering and Technology, Nagpur."
  },

  // --- GENERAL PROFILE CATEGORIES ---
  {
    keywords: ["name", "who is shreya", "who are you", "tell me about shreya", "bio", "overview", "introduction", "about shreya", "background", "summary"],
    response: "<strong>Shreya Ghodmare</strong> is an AI/ML-focused final-year B.Tech IT student at St. Vincent Pallotti College of Engineering and Technology, Nagpur (graduating June 2027, CGPA: 8.07). She is a published AI researcher with 3 paper publications and winner of 5× national-level hackathons and competitions!"
  },
  {
    keywords: ["skill", "skills", "technology", "tech stack", "languages", "python", "sql", "frameworks", "tools", "ml", "ai", "genai", "deep learning", "computer vision", "rag", "fastapi", "react", "tensorflow", "postgres", "mongodb"],
    response: "Here are Shreya's core technical skills:<br/>• <strong>Languages:</strong> Python, SQL<br/>• <strong>AI/ML & GenAI:</strong> Machine Learning, Deep Learning, Computer Vision, RAG, Explainable AI (Grad-CAM), LangChain, FAISS, Gemini, FLAN-T5, MiniLM<br/>• <strong>Backend & Databases:</strong> FastAPI, REST APIs, JWT Auth, PostgreSQL, MongoDB<br/>• <strong>Libraries & Tools:</strong> TensorFlow, NumPy, Pandas, Scikit-learn, OpenCV, Git, VS Code."
  },
  {
    keywords: ["education", "college", "degree", "b.tech", "study", "university", "pallotti", "school", "graduation"],
    response: "Shreya is pursuing her <strong>B.Tech in Information Technology</strong> at <strong>St. Vincent Pallotti College of Engineering and Technology, Nagpur</strong> (Aug 2023 – June 2027) with a CGPA of <strong>8.07</strong>."
  },
  {
    keywords: ["experience", "internship", "intern", "leading india", "work", "job", "mri", "tumor", "brain tumor", "grad-cam", "xai", "noida"],
    response: "Shreya worked as an <strong>ML Engineer Intern</strong> at <strong>Leading India Pvt. Ltd. (Noida)</strong> from Jan 2026 to Apr 2026.<br/>Key accomplishments:<br/>• Developed an attention-weighted ensemble CNN (MobileNetV2, EfficientNetB0, Custom CNN) for brain tumor classification, achieving <strong>97–98% validation accuracy</strong>.<br/>• Implemented Grad-CAM with OpenCV for Explainable AI (XAI) to visualize tumor-relevant MRI regions.<br/>• Built an end-to-end Computer Vision pipeline with TensorFlow/Keras, OpenCV, Flask & React."
  },
  {
    keywords: ["project", "projects", "portfolio projects", "built", "systems"],
    response: "Shreya has built 3 flagship end-to-end systems:<br/>1. 🌾 <strong>KisanBandhu:</strong> RAG-based Agricultural Advisory Platform (<a href='https://kisan-bandhu-4wlq.onrender.com/' target='_blank'>Live Demo</a>).<br/>2. 🏥 <strong>CityCare:</strong> Role-based Hospital Management System with Gemini RAG (<a href='https://citycare-frontend.onrender.com/login' target='_blank'>Live Demo</a>).<br/>3. 📦 <strong>Multi-Warehouse Management:</strong> Fulfillment & Inventory System (<a href='https://warehouse-frontend-v2cu.onrender.com/login' target='_blank'>Live Demo</a>)."
  },
  {
    keywords: ["kisanbandhu", "kisan bandhu", "kisan", "agriculture", "farmer", "rag agricultural", "contract farming", "farming"],
    response: "🌾 <strong>KisanBandhu</strong> is an end-to-end RAG (Retrieval-Augmented Generation) agricultural advisory platform (Jan–Feb 2026).<br/>• Uses PyPDF ingestion, LangChain chunking, FAISS vector database + MiniLM-L6-v2 embeddings for semantic retrieval.<br/>• Integrated with FLAN-T5 LLM to deliver accurate, farmer-friendly agricultural guidance and transparent contract farming.<br/>👉 <a href='https://kisan-bandhu-4wlq.onrender.com/' target='_blank'>Experience KisanBandhu Live</a>"
  },
  {
    keywords: ["citycare", "city care", "hospital", "patient", "prescription", "doctor", "health", "healthcare"],
    response: "🏥 <strong>CityCare</strong> is an AI-enabled Hospital Management System built in August 2026.<br/>• Features role-based access for patients and doctors with digital prescription workflows and appointment scheduling.<br/>• Integrated a Gemini-powered RAG assistant for patient prescription queries and Cloudinary for PDF prescription storage.<br/>👉 <a href='https://citycare-frontend.onrender.com/login' target='_blank'>Experience CityCare Live</a>"
  },
  {
    keywords: ["warehouse", "inventory", "logistics", "fulfillment", "shipping", "shift control"],
    response: "📦 <strong>Multi-Warehouse Management & Inventory Fulfillment System</strong> is a full-stack cloud logistics system.<br/>• Built with React, FastAPI, PostgreSQL, Supabase, and JWT authentication.<br/>• Features shift control centres, inbound activity logs, manager approval queues, outbound picking/packing, and automated shipping label generation.<br/>👉 <a href='https://warehouse-frontend-v2cu.onrender.com/login' target='_blank'>Experience Warehouse System Live</a>"
  },
  {
    keywords: ["research", "paper", "publication", "publications", "inspiro", "pose", "blockchain", "scopus", "indjcst", "conference", "journal", "published"],
    response: "Shreya is a published AI researcher with 3 papers:<br/>1. 📄 <em>AI-Based Pose Estimation System for Exercise Error Detection and Telerehabilitation Support in Resource-Constrained Settings</em> (ARET Conference, Scopus-indexed).<br/>2. 📄 <em>INSPIRO: An AI-Driven Institution Auditor</em> (INDJCST, DOI: 10.59256/indjcst.20250401004).<br/>3. 📄 <em>Blockchain Enabled Platform for Transparent Contract Farming in India</em> (INDJCST, DOI: 10.59256/indjcst.20260501043)."
  },
  {
    keywords: ["achievement", "achievements", "hackathon", "award", "awards", "winner", "contest", "competition", "runner-up", "sb jain", "nit", "kdk", "rising india", "trophy"],
    response: "🏆 Shreya has secured top positions in <strong>5× National-Level Competitions</strong>:<br/>• 🥇 <strong>1st Runner-Up</strong> — Rising India Hackathon at NIT (competing among 220 teams).<br/>• 🥇 <strong>1st Prize Winner</strong> — SB Jain Ideathon & Project Competition.<br/>• 🥈 <strong>2nd Prize</strong> — KDK Hackathon & Nagpur Govt Project Competition."
  },
  {
    keywords: ["certificate", "certifications", "bootcamp", "python diploma", "fde", "courses"],
    response: "📜 Shreya's certifications include:<br/>• Python Diploma Certificate<br/>• FDE BOOTCAMP Certificate<br/>• Winner Certificates for National Hackathons, Idea Pitching, and Conference presentations."
  },
  {
    keywords: ["leadership", "csi", "cii", "technex", "joint secretary", "position", "responsibility", "head", "lead", "community"],
    response: "👑 Positions of Responsibility & Leadership:<br/>• <strong>Joint Secretary</strong> — Computer Society of India (CSI) Student Chapter at SVPECT.<br/>• <strong>Registration Head</strong> — CII 2025 Conference.<br/>• <strong>Promotion Lead</strong> — TECHNEX 2025."
  },
  {
    keywords: ["contact", "reach", "hire", "how to contact", "contact details"],
    response: "📫 You can reach Shreya Ghodmare via:<br/>• <strong>Email:</strong> <a href='mailto:ghodmareshreya@gmail.com'>ghodmareshreya@gmail.com</a><br/>• <strong>Phone:</strong> +91 9545853876<br/>• <strong>Location:</strong> Nagpur, Maharashtra, India<br/>• <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/shreya-ghodmare-216417308/' target='_blank'>LinkedIn Profile</a><br/>• <strong>GitHub:</strong> <a href='https://github.com/Shreya10110' target='_blank'>GitHub Profile</a>"
  }
];

const OUT_OF_SCOPE_RESPONSE = "I am specifically trained as <strong>Shreya Ghodmare's Executive AI Assistant</strong>. I am configured to provide information strictly regarding Shreya's professional background, resume, technical skills, engineering projects, research publications, and credentials.<br/><br/>I am unable to assist with out-of-scope topics, but I am at your service to answer any specific questions about Shreya's work or qualifications.";

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

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userQuery })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        botResponse = formatGeminiResponse(data.reply);
      }
    }
  } catch (err) {
    console.log('API chat endpoint unavailable, using local knowledge base fallback:', err);
  }

  // Fallback to local Knowledge Base if API response not received
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
        // Boost granular exact keyword matches so targeted answers override broad categories
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


