
(function initMouseEffects() {

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;
  
    let mouseX = 0, mouseY = 0;
    let lastX = 0, lastY = 0;
    let lastTimestamp = 0;
    
    const aura = document.createElement('div');
    aura.className = 'cursor-aura';
    document.body.appendChild(aura);
    
    const slowGlow = document.createElement('div');
    slowGlow.className = 'slow-glow';
    document.body.appendChild(slowGlow);
    
    let currentAuraX = 0, currentAuraY = 0;
    let currentSlowX = 0, currentSlowY = 0;
    
    function createTrail(x, y, speed) {
      const trail = document.createElement('div');
      trail.className = 'mouse-trail';
      trail.style.left = (x - 2) + 'px';
      trail.style.top = (y - 2) + 'px';
      
      const intensity = Math.min(speed / 8, 0.7);
      const size = 3 + intensity * 4;
      trail.style.width = size + 'px';
      trail.style.height = size + 'px';
      trail.style.opacity = 0.4 + intensity * 0.3;
      trail.style.filter = `blur(${1 + intensity * 1.5}px)`;
      
      document.body.appendChild(trail);
      
      setTimeout(() => {
        if (trail && trail.remove) trail.remove();
      }, 600);
    }
    
    function createSparkle(x, y) {
      const sparkle = document.createElement('div');
      sparkle.className = 'cursor-sparkle';
      sparkle.style.left = (x - 1) + 'px';
      sparkle.style.top = (y - 1) + 'px';
      document.body.appendChild(sparkle);
      
      setTimeout(() => {
        if (sparkle && sparkle.remove) sparkle.remove();
      }, 400);
    }
    
    function updateAuraPosition() {
      currentAuraX = currentAuraX + (mouseX - currentAuraX) * 0.35;
      currentAuraY = currentAuraY + (mouseY - currentAuraY) * 0.35;
      aura.style.left = currentAuraX + 'px';
      aura.style.top = currentAuraY + 'px';
      
      currentSlowX = currentSlowX + (mouseX - currentSlowX) * 0.1;
      currentSlowY = currentSlowY + (mouseY - currentSlowY) * 0.1;
      slowGlow.style.left = currentSlowX + 'px';
      slowGlow.style.top = currentSlowY + 'px';
      
      requestAnimationFrame(updateAuraPosition);
    }
    
    document.addEventListener('mousemove', function(e) {
      const now = Date.now();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (speed > 3 && now - lastTimestamp > 20) {
        createTrail(e.clientX, e.clientY, speed);
        
        if (speed > 15) {
          createSparkle(e.clientX, e.clientY);
        }
      }
      
      lastX = e.clientX;
      lastY = e.clientY;
      lastTimestamp = now;
    });
    
    const cards = document.querySelectorAll('.res-card, .card, .zodiac-btn, .btn-main');
    
    function addCardGlow(e) {
      const card = e.currentTarget;
      if (!card.classList.contains('card-glow')) {
        card.classList.add('card-glow');
      }
      card.classList.add('card-glow-active');
    }
    
    function removeCardGlow(e) {
      const card = e.currentTarget;
      card.classList.remove('card-glow-active');
    }
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', addCardGlow);
      card.addEventListener('mouseleave', removeCardGlow);
    });
    
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          const newCards = document.querySelectorAll('.res-card:not(.card-glow), .card:not(.card-glow), .zodiac-btn:not(.card-glow)');
          newCards.forEach(card => {
            card.classList.add('card-glow');
            card.addEventListener('mouseenter', addCardGlow);
            card.addEventListener('mouseleave', removeCardGlow);
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    updateAuraPosition();
    
    function createBackgroundSparkles() {
      setInterval(() => {
        if (Math.random() > 0.85) {
          const randomX = Math.random() * window.innerWidth;
          const randomY = Math.random() * window.innerHeight;
          const bgSparkle = document.createElement('div');
          bgSparkle.className = 'mouse-trail';
          bgSparkle.style.left = randomX + 'px';
          bgSparkle.style.top = randomY + 'px';
          bgSparkle.style.width = '2px';
          bgSparkle.style.height = '2px';
          bgSparkle.style.opacity = '0.2';
          document.body.appendChild(bgSparkle);
          setTimeout(() => {
            if (bgSparkle && bgSparkle.remove) bgSparkle.remove();
          }, 800);
        }
      }, 3000);
    }
    
    createBackgroundSparkles();
    
    console.log('✨ Golden mouse aura activated (compact mode 70%)!');
  })();

//  Global Variables
let selectedZodiacId = null;
let selectedMonth = null;

//  DOM Elements 
const homePage = document.getElementById('page-home');
const resultPage = document.getElementById('page-result');
const zodiacGrid = document.getElementById('zodiac-grid');
const selMonth = document.getElementById('sel-month');
const selYear = document.getElementById('sel-year');
const btnReveal = document.getElementById('btn-reveal');
const errMsg = document.getElementById('err-msg');
const envelopeWrap = document.getElementById('envelope-wrap');
const resultContent = document.getElementById('result-content');
const birthdateInput = document.getElementById('birthdate-input');

//  Helper Functions 
function showPage(pageName) {
    if (pageName === 'home') {
        homePage.classList.add('active');
        resultPage.classList.remove('active');
    } else if (pageName === 'result') {
        homePage.classList.remove('active');
        resultPage.classList.add('active');
    }
}

function showError(msg) {
    errMsg.textContent = msg;
    errMsg.classList.remove('hidden');
    setTimeout(() => {
        errMsg.classList.add('hidden');
    }, 3000);
}

//  Calculate Zodiac from Birthdate 
function getZodiacByDate(month, day) {
    //
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { id: "aries", th: "เมษ", emoji: "♈" };
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { id: "taurus", th: "พฤษภ", emoji: "♉" };
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { id: "gemini", th: "เมถุน", emoji: "♊" };
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { id: "cancer", th: "กรกฎ", emoji: "♋" };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { id: "leo", th: "สิงห์", emoji: "♌" };
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { id: "virgo", th: "กันย์", emoji: "♍" };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { id: "libra", th: "ตุลย์", emoji: "♎" };
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { id: "scorpio", th: "พิจิก", emoji: "♏" };
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { id: "sagittarius", th: "ธนู", emoji: "♐" };
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { id: "capricorn", th: "มังกร", emoji: "♑" };
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { id: "aquarius", th: "กุมภ์", emoji: "♒" };
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return { id: "pisces", th: "มีน", emoji: "♓" };
    return null;
}

function calcZodiac() {
    const birthdate = birthdateInput.value;
    if (!birthdate) {
        document.getElementById('calc-result').classList.add('hidden');
        return;
    }
    
    const date = new Date(birthdate);
    const month = date.getMonth() + 1; // JS month is 0-indexed
    const day = date.getDate();
    
    const zodiac = getZodiacByDate(month, day);
    if (zodiac) {
        const resultDiv = document.getElementById('calc-result');
        resultDiv.innerHTML = `
             ราศีของคุณคือ <strong style="color: #f0c060;">${zodiac.th} ${zodiac.emoji}</strong><br/>
            <span style="font-size: 0.85rem;">วันเกิด ${day}/${month} ตรงกับราศี${zodiac.th}</span>
            <button onclick="selectRecommendedZodiac('${zodiac.id}')" style="margin-top: 8px; background: rgba(155,109,255,0.2); border: 1px solid #9b6dff; border-radius: 20px; padding: 5px 12px; cursor: pointer; color: #c4a0ff;">✨ เลือกราศีนี้เลย</button>
        `;
        resultDiv.classList.remove('hidden');
    } else {
        document.getElementById('calc-result').classList.add('hidden');
    }
}

function selectRecommendedZodiac(zodiacId) {
    // Clear previous selection
    document.querySelectorAll('.zodiac-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Select the button with matching zodiac id
    const targetBtn = document.querySelector(`.zodiac-btn[data-zodiac-id="${zodiacId}"]`);
    if (targetBtn) {
        targetBtn.classList.add('selected');
        selectedZodiacId = zodiacId;
    }
}

// Render Zodiac Grid 
function renderZodiacGrid() {
    zodiacGrid.innerHTML = '';
    ZODIACS.forEach(zodiac => {
        const btn = document.createElement('div');
        btn.className = 'zodiac-btn';
        btn.setAttribute('data-zodiac-id', zodiac.id);
        btn.setAttribute('data-zodiac-th', zodiac.th);
        btn.innerHTML = `
            <span class="zodiac-emoji">${zodiac.emoji} ${zodiac.icon}</span>
            <span class="zodiac-th">${zodiac.th}</span>
            <span class="zodiac-date">${zodiac.dateRange}</span>
        `;
        btn.onclick = () => {
            document.querySelectorAll('.zodiac-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedZodiacId = zodiac.id;
        };
        zodiacGrid.appendChild(btn);
    });
}

//  Get Horoscope Data 
function getHoroscopeData(zodiacId, month) {
    // Map Thai month names to English (since our data uses numbers 1-12)
    // Actually our HOROSCOPE uses month numbers (1-12) as keys
    
    const zodiacData = HOROSCOPE[zodiacId];
    if (!zodiacData) return null;
    
    const monthData = zodiacData[month];
    if (!monthData) return null;
    
    return monthData;
}

//  Stars Helper 
function stars(n) {
    return "⭐".repeat(n) + "☆".repeat(5 - n);
}

//  Display Result Page 
function displayResult(zodiacId, monthNum) {
    const zodiac = ZODIACS.find(z => z.id === zodiacId);
    if (!zodiac) return;
    
    const monthName = MONTHS_TH[monthNum];
    const year = selYear.value;
    
    const horo = getHoroscopeData(zodiacId, monthNum);
    if (!horo) {
        showError("ไม่พบข้อมูลดวงสำหรับราศีนี้ในเดือนนี้ค่ะ(แจ้งบัคได้เลยค่ะ)");
        goBack();
        return;
    }
    
    // Set header
    document.getElementById('res-icon').innerHTML = `${zodiac.emoji} ${zodiac.icon}`;
    document.getElementById('res-name').innerHTML = zodiac.th;
    document.getElementById('res-period').innerHTML = `${monthName} ${year}`;
    document.getElementById('overall-stars').innerHTML = stars(horo.overviewStars || 3);
    
    // Define categories
    const categories = [
        { key: 'overview', title: ' ภาพรวม', icon: '', starsKey: 'overviewStars' },
        { key: 'work', title: ' การงาน', icon: '', starsKey: 'workStars' },
        { key: 'money', title: ' การเงิน', icon: '', starsKey: 'moneyStars' },
        { key: 'love', title: 'ความรัก', icon: '', starsKey: 'loveStars' },
        { key: 'health', title: 'สุขภาพ', icon: '', starsKey: 'healthStars' }
    ];
    
    // Build cards HTML
    let cardsHtml = '';
    categories.forEach(cat => {
        const content = horo[cat.key];
        const starRating = horo[cat.starsKey] || 3;
        
        cardsHtml += `
            <div class="res-card cat-${cat.key}" data-cat="${cat.key}">
                <div class="res-card-header">
                    <div class="res-card-icon">${cat.icon}</div>
                    <div class="res-card-title">${cat.title}</div>
                    <div class="res-card-stars">${stars(starRating)}</div>
                </div>
                <div class="res-card-body">
                    ${content || 'คำทำนาย'}
                </div>
            </div>
        `;
    });
    
    // Add Tips card
    const tips = horo.tips;
    let tipsHtml = `
        <div class="res-card cat-tips" data-cat="tips">
            <div class="res-card-header">
                <div class="res-card-icon"></div>
                <div class="res-card-title">สิ่งที่ควรทำ / ไม่ควรทำ</div>
                <div class="res-card-stars"></div>
            </div>
            <div class="res-card-body tips-section">
    `;
    
    if (tips && (tips.do || tips.dont)) {
        if (tips.do && tips.do.length) {
            tipsHtml += `<ul class="tips-list">`;
            tips.do.forEach(item => {
                tipsHtml += `<li class="do"> ${item.replace(' ', '')}</li>`;
            });
            tipsHtml += `</ul>`;
        }
        if (tips.dont && tips.dont.length) {
            tipsHtml += `<ul class="tips-list">`;
            tips.dont.forEach(item => {
                tipsHtml += `<li class="dont"> ${item.replace(' ', '')}</li>`;
            });
            tipsHtml += `</ul>`;
        }
    } else {
        tipsHtml += `<p style="color: #9b94c0;">ไม่มีคำแนะนำพิเศษในเดือนนี้ ✨</p>`;
    }
    
    tipsHtml += `</div></div>`;
    cardsHtml += tipsHtml;
    
    document.getElementById('result-cards').innerHTML = cardsHtml;
    
    // Animate cards with delay
    setTimeout(() => {
        const cards = document.querySelectorAll('#result-cards .res-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 80);
        });
    }, 100);
}

//  Envelope Animation 
function showEnvelopeAndResult() {
    if (!selectedZodiacId || !selectedMonth) {
        showError("กรุณาเลือกราศีและเดือนก่อนนะคะ");
        return false;
    }
    
    // Check if data exists
    const horo = getHoroscopeData(selectedZodiacId, selectedMonth);
    if (!horo) {
        showError("เลือกราศีและเดือนก่อนนะคะ");
        return false;
    }
    
    // Show envelope animation
    envelopeWrap.classList.remove('hidden');
    resultContent.classList.add('hidden');
    
    // Create sparkles
    const sparklesContainer = document.getElementById('sparkles');
    sparklesContainer.innerHTML = '';
    for (let i = 0; i < 40; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-dot';
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 120;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 50;
        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);
        sparkle.style.left = `${50 + (Math.random() - 0.5) * 40}%`;
        sparkle.style.top = `${50 + (Math.random() - 0.5) * 40}%`;
        sparkle.style.background = `hsl(${40 + Math.random() * 60}, 100%, 70%)`;
        sparkle.style.boxShadow = `0 0 8px ${['#f0c060', '#ff7eb3', '#9b6dff'][Math.floor(Math.random() * 3)]}`;
        sparklesContainer.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1200);
    }
    
    // After 1.8 seconds, hide envelope and show result
    setTimeout(() => {
        envelopeWrap.classList.add('hidden');
        resultContent.classList.remove('hidden');
        displayResult(selectedZodiacId, selectedMonth);
    }, 1800);
    
    return true;
}

// Main Action 
function goToResult() {
    // Validate selections
    const selectedBtn = document.querySelector('.zodiac-btn.selected');
    if (!selectedBtn) {
        showError("เลือกราศีของคุณก่อนนะคะ");
        return;
    }
    
    selectedZodiacId = selectedBtn.getAttribute('data-zodiac-id');
    selectedMonth = parseInt(selMonth.value);
    
    if (!selectedMonth || selectedMonth < 1 || selectedMonth > 12) {
        showError("อย่าลืมเลือกเดือนที่ต้องการทำนายด้วยนะคะ");
        return;
    }
    
    const success = showEnvelopeAndResult();
    if (success) {
        showPage('result');
    }
}

//  Go Back to Home 
function goBack() {
    showPage('home');
    // Reset envelope state for next time
    envelopeWrap.classList.add('hidden');
    resultContent.classList.add('hidden');
}

//  Initialize and Set Year 
function init() {
    renderZodiacGrid();
    
    // Set default month (current month or March if not set)
    const now = new Date();
    let defaultMonth = now.getMonth() + 1; // 1-12
    // If month is beyond December or before January, set to March
    if (defaultMonth < 1 || defaultMonth > 12) defaultMonth = 3;
    selMonth.value = defaultMonth;
    
    // Set year to 2569 (2026)
    selYear.innerHTML = '<option value="2569">พ.ศ. 2569</option>';
    
    // Add event listener for Enter key on birthdate
    birthdateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calcZodiac();
    });
}

// Make functions globally available
window.calcZodiac = calcZodiac;
window.selectRecommendedZodiac = selectRecommendedZodiac;
window.goToResult = goToResult;
window.goBack = goBack;

// Start the app
init();