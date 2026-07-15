(function() {
    'use strict';
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (name === 'disabled') {
            console.log('[Bypass] Blocked disabled attribute on', this.tagName);
            return;
        }
        return originalSetAttribute.call(this, name, value);
    };
    
    Object.defineProperty(HTMLTextAreaElement.prototype, 'disabled', {
        get: function() { return false; },
        set: function(val) { 
            console.log('[Bypass] Blocked disabled setter');
            return false; 
        },
        configurable: true
    });
    
    Object.defineProperty(HTMLButtonElement.prototype, 'disabled', {
        get: function() { return false; },
        set: function(val) { 
            console.log('[Bypass] Blocked button disabled setter');
            return false; 
        },
        configurable: true
    });
    
    const observer = new MutationObserver((mutations) => {
        let needsEnable = false;
        
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                const el = mutation.target;
                if (el.hasAttribute('disabled')) {
                    el.removeAttribute('disabled');
                    el.disabled = false;
                    needsEnable = true;
                }
            }
            // Also catch when elements are added
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element
                        if (node.matches?.('textarea, button') || node.querySelector?.('textarea, button')) {
                            needsEnable = true;
                        }
                    }
                });
            }
        });
        
        if (needsEnable) {
            enableAll();
        }
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['disabled'],
        childList: true,
        subtree: true
    });
    
    function enableAll() {
        // Textareas
        document.querySelectorAll('textarea').forEach(el => {
            el.removeAttribute('disabled');
            el.disabled = false;
            el.readOnly = false;
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
            el.style.cursor = 'text';
        });
    
        document.querySelectorAll('button').forEach(el => {
            el.removeAttribute('disabled');
            el.disabled = false;
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
            el.style.cursor = 'pointer';
        });

        document.querySelectorAll('input').forEach(el => {
            el.removeAttribute('disabled');
            el.disabled = false;
        });
    }
    
    const fakeTrialData = {
        valid: true,
        trialActive: true,
        timeRemaining: 99999999,
        quotaRemaining: 9999,
        expired: false,
        unlimited: true
    };
    
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        const urlStr = String(url);
        
        if (urlStr.includes('tracking.miui.com')) {
            return new Response('{}', { status: 200 });
        }
        
        if (urlStr.includes('trial') || urlStr.includes('quota') || urlStr.includes('session') || urlStr.includes('check')) {
            console.log('[Bypass] Faked API:', urlStr);
            return new Response(JSON.stringify(fakeTrialData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (urlStr.includes('chat') || urlStr.includes('message') || urlStr.includes('completion')) {
            console.log('[Bypass] Intercepted chat API');
            if (options?.headers) {
                const headers = new Headers(options.headers);
                headers.set('X-Trial-Valid', 'true');
                headers.set('X-Quota-Remaining', '9999');
                options.headers = headers;
            }
        }
        
        try {
            return await originalFetch.call(this, url, options);
        } catch (e) {
            console.log('[Bypass] Request failed:', e);
            throw e;
        }
    };
    
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = function(key) {
        if (key?.toLowerCase().includes('trial') || key?.toLowerCase().includes('quota')) {
            return JSON.stringify(fakeTrialData);
        }
        return originalGetItem.call(this, key);
    };
    
    localStorage.setItem = function(key, value) {
        if (key?.toLowerCase().includes('trial') || key?.toLowerCase().includes('quota')) {
            console.log('[Bypass] Blocked trial storage');
            return;
        }
        return Storage.prototype.setItem.call(this, key, value);
    };
    
    function addCustomSendHandler() {
        const textarea = document.querySelector('textarea[placeholder*="Tell me"]');
        const sendBtn = document.querySelector('button[data-track-id="home_send_btn"]');
        
        if (textarea && !textarea._customHandler) {
            textarea._customHandler = true;
            
            textarea.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    triggerSend();
                }
            });
        }
        
        if (sendBtn && !sendBtn._customHandler) {
            sendBtn._customHandler = true;
            sendBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                triggerSend();
            });
        }
    }
    
    function triggerSend() {
        const textarea = document.querySelector('textarea[placeholder*="Tell me"]');
        if (!textarea || !textarea.value.trim()) return;
        
        const text = textarea.value;
        console.log('[Bypass] Sending:', text);
        
        const reactKey = Object.keys(textarea).find(k => k.startsWith('__react'));
        if (reactKey) {
            const fiber = textarea[reactKey];
            if (fiber?.props?.onChange) {
           
                const fakeEvent = {
                    target: { value: text },
                    currentTarget: { value: text }
                };
                fiber.props.onChange(fakeEvent);
            }
        }
        
        const sendBtn = document.querySelector('button[data-track-id="home_send_btn"]');
        if (sendBtn) {
            // Try multiple click methods
            sendBtn.click();
            sendBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
     
        textarea.value = '';
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    enableAll();
    addCustomSendHandler();

    setInterval(() => {
        enableAll();
        addCustomSendHandler();
    }, 500);
    
    setTimeout(() => {
        clearInterval();
        setInterval(enableAll, 2000);
    }, 30000);
    
    console.log('%c FULL BYPASS ACTIVE - All vectors engaged', 'color: #10b981; font-size: 16px; font-weight: bold;');
    console.log('%cTry typing and pressing Enter now', 'color: #10b981;');
})();
