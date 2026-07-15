(function() {
    'use strict';
    
    
    function unlockInterface() {
        const textareas = document.querySelectorAll('textarea[disabled]');
        textareas.forEach(el => {
            el.removeAttribute('disabled');
            el.disabled = false;
            el.style.opacity = '1';
            el.style.cursor = 'text';
        });
        
        const sendButtons = document.querySelectorAll('button[disabled]');
        sendButtons.forEach(btn => {
            if (btn.getAttribute('data-track-id')?.includes('send') || 
                btn.innerHTML?.includes('M.244') ||
                btn.closest('[class*="dialogue"]')) {
                btn.removeAttribute('disabled');
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
        });
        
        const timerElements = document.querySelectorAll('div, span');
        timerElements.forEach(el => {
            if (el.textContent?.includes("You've exited the trial")) {
                const parent = el.closest('div.inline-flex');
                if (parent) {
                    parent.innerHTML = '<span class="whitespace-nowrap rounded px-1 py-0.5 text-xs font-normal leading-5 text-[color:var(--ultra-text-h1)]" style="color: #10b981 !important; font-weight: 600;">Trial time left: Unlimited</span>';
                }
            }
            
            if (el.textContent?.includes("Apply again")) {
                const container = el.closest('div.inline-flex') || el.parentElement;
                if (container) container.remove();
            }
        });
        
        const templateButtons = document.querySelectorAll('button[disabled]');
        templateButtons.forEach(btn => {
            btn.removeAttribute('disabled');
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        });
    }
    
    unlockInterface();
    
    const enforcer = setInterval(unlockInterface, 100);
    
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj, prop, descriptor) {
        if (prop === 'disabled' && descriptor?.value === true) {
            descriptor.value = false;
        }
        return originalDefineProperty.call(this, obj, prop, descriptor);
    };
    
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (name === 'disabled') {
            return; // Silently ignore
        }
        return originalSetAttribute.call(this, name, value);
    };
    
    const originalFetch = window.fetch;
    window.fetch = function(url, ...args) {
        const urlStr = url?.toString() || '';
        if (urlStr.includes('tracking.miui.com') || 
            urlStr.includes('trial') || 
            urlStr.includes('expire') ||
            urlStr.includes('session')) {
            return Promise.resolve(new Response(JSON.stringify({
                valid: true,
                timeRemaining: 99999999,
                unlimited: true
            }), { status: 200 }));
        }
        return originalFetch.call(this, url, ...args);
    };
    
    const frozenTime = new Date('2099-12-31').getTime();
    Date.now = () => frozenTime;
    
    console.log('%c Interface Unlocked - Unlimited Trial Active', 'color: #10b981; font-size: 14px; font-weight: bold;');
    console.log('%cYou can now type and send messages.', 'color: #10b981;');
    
    // Stop the enforcer after 10 seconds to save resources
    setTimeout(() => clearInterval(enforcer), 10000);
})();
