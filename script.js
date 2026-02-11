// ⚙️ CONFIGURATION: Replace this with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7EJImUF_zl4F7i5u2TDJP1nI5UAJzyfhljn-MxOpd6FSUI7fRQGMXuOL4OpJRx0_iTw/exec';

// Cute warning messages for the "No" button
const noMessages = [
    "No 😢",
    "Are you sure? 🥺",
    "Really sure? 😿",
    "Please please! 🙏",
    "Pwetty pwease? 🥹",
    "With sugar on top? 🍬",
    "Think about it again! 💭",
    "Are you positive? 😰",
    "Just one more chance? 🌸",
    "I'll be very sad... 😭",
    "I'll be very depressed 💔",
    "You're breaking my heart 😞",
    "My teddy will cry too 🧸😢",
    "Pretty pretty please? ✨",
    "I'll give you chocolates! 🍫",
    "Forever alone... 😿",
    "Don't do this to me! 💕",
    "Last chance... 🥺",
    "PLEASE! 😭💔"
];

// Emotional emoji reactions (sad, crying, pampering)
const emotionalEmojis = [
    "🥺",
    "😢",
    "😭",
    "😿",
    "💔",
    "😞",
    "😥",
    "🥹",
    "😰",
    "😓",
    "🫣",
    "🙏",
    "😩",
    "😫",
    "🥺💦",
    "😭💔",
    "🫠",
    "😿💧",
    "🥺🙏"
];

let noClickCount = 0;
let yesButtonScale = 1;

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionScreen = document.getElementById('questionScreen');
const successScreen = document.getElementById('successScreen');
const heartsBg = document.getElementById('heartsBg');
const emotionalEmoji = document.getElementById('emotionalEmoji');

// Create floating hearts in background
function createFloatingHearts() {
    const hearts = ['💕', '💖', '💗', '💓', '💘', '💝', '♥️', '❤️', '🩷'];

    setInterval(() => {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.style.animationDuration = (Math.random() * 5 + 8) + 's';
        heartsBg.appendChild(heart);

        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 13000);
    }, 400);
}

// Function to generate or retrieve unique browser ID
function getBrowserId() {
    let browserId = localStorage.getItem('valentine_browser_id');

    if (!browserId) {
        // Generate a unique ID based on browser fingerprint
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width,
            screen.height,
            screen.colorDepth,
            new Date().getTimezoneOffset(),
            navigator.hardwareConcurrency || 'unknown',
            navigator.platform
        ].join('|');

        // Create a simple hash
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        // Create a more readable ID
        browserId = 'DEVICE_' + Math.abs(hash).toString(16).toUpperCase() + '_' + Date.now().toString(36).toUpperCase();
        localStorage.setItem('valentine_browser_id', browserId);
    }

    return browserId;
}

// Function to get a user-friendly device name
function getDeviceName() {
    const ua = navigator.userAgent;
    const platform = navigator.platform;

    // Detect device type
    let deviceType = 'Desktop';
    if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
        deviceType = 'Mobile';
        if (/iPad/i.test(ua)) {
            deviceType = 'Tablet';
        }
    }

    // Detect OS
    let os = 'Unknown OS';
    if (/Windows/i.test(platform) || /Win/i.test(ua)) {
        os = 'Windows';
    } else if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) {
        os = 'macOS';
    } else if (/Linux/i.test(platform)) {
        os = 'Linux';
    } else if (/Android/i.test(ua)) {
        os = 'Android';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
        os = 'iOS';
    }

    // Detect browser
    let browser = 'Unknown Browser';
    if (/Edg/i.test(ua)) {
        browser = 'Edge';
    } else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) {
        browser = 'Chrome';
    } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
        browser = 'Safari';
    } else if (/Firefox/i.test(ua)) {
        browser = 'Firefox';
    } else if (/MSIE|Trident/i.test(ua)) {
        browser = 'Internet Explorer';
    }

    return `${os} ${deviceType} (${browser})`;
}

// Function to save record to Google Sheets
async function saveYesRecord() {
    const browserId = getBrowserId();
    const deviceName = getDeviceName();
    const timestamp = new Date().toLocaleString();
    const deviceInfo = {
        browserId: browserId,
        deviceName: deviceName,
        timestamp: timestamp,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`
    };

    try {
        // Send data to Google Sheets via Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deviceInfo)
        });

        console.log('✅ Record saved to Google Sheets:', deviceInfo);

    } catch (error) {
        console.error('❌ Error saving to Google Sheets:', error);
        // Fallback: save to localStorage if Google Sheets fails
        let records = JSON.parse(localStorage.getItem('valentine_yes_records') || '[]');
        records.push(deviceInfo);
        localStorage.setItem('valentine_yes_records', JSON.stringify(records));
        console.log('💾 Saved to localStorage as fallback');
    }
}

// Handle Yes button click
yesBtn.addEventListener('click', () => {
    // Save the record
    saveYesRecord();

    // Create confetti explosion
    createConfetti();

    // Show success screen
    setTimeout(() => {
        questionScreen.classList.add('hidden');
        successScreen.classList.remove('hidden');
        noBtn.style.display = 'none'; // Hide the No button since it's in body
    }, 300);
});

// Handle No button click
noBtn.addEventListener('click', () => {
    noClickCount++;

    // Add shake animation
    noBtn.classList.add('shake');
    setTimeout(() => noBtn.classList.remove('shake'), 400);

    // Show emotional emoji reaction
    const randomEmoji = emotionalEmojis[Math.floor(Math.random() * emotionalEmojis.length)];
    emotionalEmoji.textContent = randomEmoji;
    emotionalEmoji.classList.remove('animate');
    void emotionalEmoji.offsetWidth; // Trigger reflow for animation restart
    emotionalEmoji.classList.add('animate');
});

// Create confetti effect
function createConfetti() {
    const colors = ['#ff85a2', '#ff5c8d', '#ffb6c1', '#e84a7f', '#ff69b4', '#ff1493'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// Initialize floating hearts
createFloatingHearts();

// function to move the button
function moveButton() {
    const container = document.getElementById('questionScreen');
    const containerRect = container.getBoundingClientRect();

    // Move button to body if not already there to escape transform/overflow clipping
    if (noBtn.parentElement !== document.body) {
        document.body.appendChild(noBtn);
    }

    const btnRect = noBtn.getBoundingClientRect();

    // Random position constrained within the container's screen bounds
    const padding = 20; // Increased padding to be safe
    const minX = containerRect.left + padding;
    const maxX = containerRect.right - btnRect.width - padding;
    const minY = containerRect.top + padding;
    const maxY = containerRect.bottom - btnRect.height - padding;

    // Ensure valid ranges (in case container is too small)
    const validMaxX = Math.max(minX, maxX);
    const validMaxY = Math.max(minY, maxY);

    const randomX = minX + Math.random() * (validMaxX - minX);
    const randomY = minY + Math.random() * (validMaxY - minY);

    // Use fixed position so it works regardless of DOM nesting
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.zIndex = '9999';
    noBtn.style.transition = 'all 0.1s ease'; // Smooth but fast transition
}

// Make no button run away within the container div only on hover
noBtn.addEventListener('mouseenter', moveButton);

// Make no button run away on touch (mobile)
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveButton();
});
