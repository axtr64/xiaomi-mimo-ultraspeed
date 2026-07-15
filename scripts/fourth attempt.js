(function() {
    'use strict';
    
    function unlockInterface() {
        const textarea = document.querySelector('textarea[placeholder*="Tell me what you want"]');
        if (textarea) {
            textarea.removeAttribute('disabled');
            textarea.disabled = false;
            textarea.style.opacity = '1';
            textarea.style.pointerEvents = 'auto';
        }
        
        const sendBtn = document.querySelector('button[data-track-id="home_send_btn"]');
        if (sendBtn) {
            sendBtn.removeAttribute('disabled');
            sendBtn.disabled = false;
            sendBtn.style.opacity = '1';
            sendBtn.style.pointerEvents = 'auto';
        }
        
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                const text = el.textContent;
                if (text === "You've exited the trial") {
                    el.textContent = "Trial time left: Unlimited";
                    el.style.color = "#10b981";
                }
                if (text === "Apply again") {
                    const btn = el.closest('button');
                    if (btn) btn.style.display = 'none';
                }
            }
        });
        
        document.querySelectorAll('button[disabled]').forEach(btn => {
            if (btn.querySelector('svg') && btn.querySelector('span')) {
                btn.removeAttribute('disabled');
                btn.disabled = false;
                btn.style.opacity = '1';
            }
        });
    }
   
    for (let i = 0; i < 20; i++) {
        setTimeout(unlockInterface, i * 100);
    }
    
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (name === 'disabled') return;
        return originalSetAttribute.call(this, name, value);
    };
    
    const originalFetch = window.fetch;
    window.fetch = function(url, ...args) {
        const urlStr = String(url);
        if (urlStr.includes('tracking.miui.com')) {
            return Promise.resolve(new Response('{}', { status: 200 }));
        }
        return originalFetch.call(this, url, ...args);
    };
    
    console.log('%c Unlocked', 'color: #10b981;');
})();
