import { encryptText, decryptText } from './utils/crypto';
import { EncryptionMethod } from './types';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentMethod = EncryptionMethod.AES;

  // DOM Elements
  const els = {
    btnModeAes: document.getElementById('btn-mode-aes') as HTMLButtonElement,
    btnModeBase64: document.getElementById('btn-mode-base64') as HTMLButtonElement,
    modeLabelEnc: document.getElementById('mode-label-enc') as HTMLSpanElement,
    modeLabelDec: document.getElementById('mode-label-dec') as HTMLSpanElement,
    
    encInput: document.getElementById('enc-input') as HTMLTextAreaElement,
    encPwd: document.getElementById('enc-pwd') as HTMLInputElement,
    encPwdContainer: document.getElementById('enc-pwd-container') as HTMLDivElement,
    encOutput: document.getElementById('enc-output') as HTMLTextAreaElement,
    btnCopy: document.getElementById('btn-copy') as HTMLButtonElement,
    copyIcon: document.getElementById('copy-icon') as HTMLElement,
    checkIcon: document.getElementById('check-icon') as HTMLElement,

    decInput: document.getElementById('dec-input') as HTMLTextAreaElement,
    decPwd: document.getElementById('dec-pwd') as HTMLInputElement,
    decPwdContainer: document.getElementById('dec-pwd-container') as HTMLDivElement,
    btnDecrypt: document.getElementById('btn-decrypt') as HTMLButtonElement,
    
    decOutputContainer: document.getElementById('dec-output-container') as HTMLDivElement,
    decEmpty: document.getElementById('dec-empty') as HTMLDivElement,
    decResult: document.getElementById('dec-result') as HTMLDivElement,
    decOutputText: document.getElementById('dec-output-text') as HTMLParagraphElement,
    decError: document.getElementById('dec-error') as HTMLDivElement,
    decErrorText: document.getElementById('dec-error-text') as HTMLParagraphElement,
  };

  // Helper: Update UI based on encryption method
  const updateMethodUI = () => {
    // Button Styles
    if (currentMethod === EncryptionMethod.AES) {
      els.btnModeAes.className = "px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 bg-indigo-600 text-white shadow-lg shadow-indigo-500/25";
      els.btnModeBase64.className = "px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-slate-200 hover:bg-slate-800";
      els.modeLabelEnc.textContent = "AES Mode";
      els.modeLabelDec.textContent = "AES Mode";
      els.encPwdContainer.style.display = 'block';
      els.decPwdContainer.style.display = 'block';
    } else {
      els.btnModeAes.className = "px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-slate-200 hover:bg-slate-800";
      els.btnModeBase64.className = "px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 bg-indigo-600 text-white shadow-lg shadow-indigo-500/25";
      els.modeLabelEnc.textContent = "Base64 Mode";
      els.modeLabelDec.textContent = "Base64 Mode";
      els.encPwdContainer.style.display = 'none';
      els.decPwdContainer.style.display = 'none';
    }
    
    // Trigger re-encrypt on mode change
    handleEncrypt();
  };

  // Logic: Encrypt
  const handleEncrypt = () => {
    const text = els.encInput.value;
    const pwd = els.encPwd.value;
    const encrypted = encryptText(text, pwd, currentMethod);
    els.encOutput.value = encrypted;
    
    if (encrypted) {
      els.btnCopy.classList.remove('hidden');
    } else {
      els.btnCopy.classList.add('hidden');
    }
  };

  // Logic: Decrypt
  const handleDecrypt = () => {
    // Reset States
    els.decEmpty.classList.add('hidden');
    els.decResult.classList.add('hidden');
    els.decError.classList.add('hidden');
    els.decOutputContainer.className = "relative h-full min-h-[120px] w-full rounded-xl border p-4 transition-all overflow-hidden bg-slate-950 border-slate-800";

    const cipher = els.decInput.value;
    const pwd = els.decPwd.value;

    if (!cipher) {
        els.decEmpty.classList.remove('hidden');
        return;
    }

    if (currentMethod === EncryptionMethod.AES && !pwd) {
        els.decError.classList.remove('hidden');
        els.decErrorText.textContent = "Password is required for AES decryption.";
        els.decOutputContainer.classList.remove('border-slate-800');
        els.decOutputContainer.classList.add('border-red-500/50');
        return;
    }

    const result = decryptText(cipher, pwd, currentMethod);

    if (result) {
        els.decResult.classList.remove('hidden');
        els.decOutputText.textContent = result;
        els.decOutputContainer.classList.remove('border-slate-800');
        els.decOutputContainer.classList.add('border-emerald-500/50', 'ring-1', 'ring-emerald-500/20', 'bg-slate-900');
    } else {
        els.decError.classList.remove('hidden');
        els.decErrorText.textContent = "Decryption failed. Check your password or the encrypted text.";
        els.decOutputContainer.classList.remove('border-slate-800');
        els.decOutputContainer.classList.add('border-red-500/50');
    }
  };

  // Logic: Copy
  const handleCopy = async () => {
    const text = els.encOutput.value;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      els.copyIcon.classList.add('hidden');
      els.checkIcon.classList.remove('hidden');
      setTimeout(() => {
        els.copyIcon.classList.remove('hidden');
        els.checkIcon.classList.add('hidden');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Event Listeners
  els.btnModeAes.addEventListener('click', () => {
    currentMethod = EncryptionMethod.AES;
    updateMethodUI();
  });

  els.btnModeBase64.addEventListener('click', () => {
    currentMethod = EncryptionMethod.BASE64;
    updateMethodUI();
  });

  els.encInput.addEventListener('input', handleEncrypt);
  els.encPwd.addEventListener('input', handleEncrypt);
  els.btnCopy.addEventListener('click', handleCopy);
  els.btnDecrypt.addEventListener('click', handleDecrypt);

  // Initialize
  updateMethodUI();
});
