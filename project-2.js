//---- Grabbing HTML elements to use in JS ---
const input = document.getElementById('passInput');
const bar = document.getElementById('strengthBar');
const label = document.querySelector('#strengthLabel b');
const btn = document.getElementById('accessBtn');
const alertPlaceholder = document.getElementById('alertPlaceholder');

// List of common passwords to flag as insecure
const commonKeys = ['password', '12345678', 'welcome', 'admin', 'abc123', 'letmein'];

// Bootstrap Alert to display Function
const showAlert = (message, type) => {
    alertPlaceholder.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
};

// Access Button Function
function handleAccess() {
    showAlert('✨ Access Granted! The vault is now open 🗝️ ✨ ', 'success');
}

// Show/Hide password -- Switches input between dots and visible text ---
function togglePassword() {
    const showBtn = document.getElementById('showBtn');
    if (input.type === 'password') {
        input.type = 'text';
        showBtn.innerText = 'Hide';
    } else {
        input.type = 'password';
        showBtn.innerText = 'Show';
    }
}

// --- Runs every time the user types a character ---
input.addEventListener('input', () => {
    const val = input.value;
    let securityClearance = 0;

    function validate(id, condition) {
        const el = document.getElementById(id);
        if (condition) {
            el.className = 'met';
            el.innerHTML = el.innerHTML.replace('🔒', '🛡️');
            securityClearance++;
        } else {
            el.className = '';
            el.innerHTML = el.innerHTML.replace('🛡️', '🔒');
        }
    }

    // Checking the 8 Rules --- Testing input criteria
    validate('rule-len', val.length >= 8);
    validate('rule-up', /[A-Z]/.test(val));
    validate('rule-low', /[a-z]/.test(val));
    validate('rule-num', /[0-9]/.test(val));
    validate('rule-spec', /[^A-Za-z0-9]/.test(val));
    validate('rule-rep', val.length > 0 && !/(.)\1\1/.test(val));
    validate('rule-com', !commonKeys.includes(val.toLowerCase()));
    
    // To detect keyboard sequences
    let isSeq = false;
    for (let i = 0; i < val.length - 2; i++) {
        if (val.charCodeAt(i) + 1 === val.charCodeAt(i+1) && 
            val.charCodeAt(i+1) + 1 === val.charCodeAt(i+2)) isSeq = true;
    }
    validate('rule-seq', val.length > 0 && !isSeq);

    // Progress Bar (Percentage calculation)
    const percentage = Math.round((securityClearance / 8) * 100);
    bar.style.width = percentage + "%";

    // Color change for strength bar
    if (percentage === 0) {
        label.innerText = "Waiting (0%)";
        bar.style.backgroundColor = "#94a3b8"; // Grey
    } else if (percentage < 50) {
        label.innerText = `Weak (${percentage}%)`;
        bar.style.backgroundColor = "#ef4444"; // Red
    } else if (percentage < 100) {
        label.innerText = `Moderate (${percentage}%)`;
        bar.style.backgroundColor = "#f59e0b"; // Orange
    } else {
        label.innerText = `Strong (${percentage}%)`;
        bar.style.backgroundColor = "#10b981"; // Green
    }

    // Button -- Enable button only when all 8 rules are met
    if (securityClearance === 8) {
        btn.disabled = false;
        btn.className = "unlocked";
        btn.innerText = "Initialize Access";
    } else {
        btn.disabled = true;
        btn.className = "";
        btn.innerText = "Access Restricted";
    }

    // Alert for common password - mentioned in list for common password
    if (val.length > 3 && commonKeys.includes(val.toLowerCase())) {
        showAlert('⚠️ This password is very easy to guess! ⚠️', 'warning');
    }
});