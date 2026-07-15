(function() {
    'use strict';
    
    const originalFetch = window.fetch;
    window.fetch = function(url, ...args) {
        if (typeof url === 'string' && url.includes('tracking.miui.com')) {
            return Promise.resolve(new Response('{}', { status: 200 }));
        }
        return originalFetch.call(this, url, ...args);
    };
    
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (typeof url === 'string' && url.includes('tracking.miui.com')) {
            return;
        }
        return originalXHROpen.call(this, method, url, ...args);
    };
    
    const frozenTime = new Date('2099-12-31T23:59:59').getTime();
    const OriginalDate = Date;
    
    window.Date = new Proxy(OriginalDate, {
        construct(target, args) {
            return args.length === 0 ? new target(frozenTime) : new target(...args);
        }
    });
    
    window.Date.now = () => frozenTime;
    window.Date.prototype = OriginalDate.prototype;
    
    let fakeTime = 0;
    Object.defineProperty(window.performance, 'now', {
        value: () => {
            fakeTime += 16.67; // ~60fps
            return fakeTime;
        },
        writable: false,
        configurable: false
    });
    
    const storage = new Map();
    const originalGetItem = Storage.prototype.getItem;
    const originalSetItem = Storage.prototype.setItem;
    
    Storage.prototype.getItem = function(key) {
        if (/trial|time|expire|session|countdown/i.test(key)) {
            return '999999999';
        }
        return storage.get(key) || originalGetItem.call(this, key);
    };
    
    Storage.prototype.setItem = function(key, value) {
        if (/trial|time|expire|session|countdown/i.test(key)) {
            return; // Silently ignore
        }
        storage.set(key, value);
        return originalSetItem.call(this, key, value);
    };
   
    function updateTimerDisplay() {
        // Find by text content
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent && /Trial time left/i.test(node.textContent)) {
                const parent = node.parentElement;
                if (parent) {
                    parent.textContent = 'Trial time left: Unlimited';
                    parent.style.cssText = 'color: #10b981 !important; font-weight: 600 !important;';
                }
            }
        }
     
        document.querySelectorAll('span, div, p').forEach(el => {
            if (el.childNodes.length === 1 && 
                el.childNodes[0].nodeType === Node.TEXT_NODE &&
                /Trial time left/i.test(el.textContent)) {
                el.textContent = 'Trial time left: Unlimited';
                el.style.cssText = 'color: #10b981 !important; font-weight: 600 !important;';
            }
        });
    }
    
    const originalSetInterval = window.setInterval;
    const activeIntervals = new Set();
    
    window.setInterval = function(callback, delay, ...args) {
        const id = originalSetInterval.call(this, callback, delay, ...args);
        
        if (delay === 1000) {
            clearInterval(id);
            const newId = originalSetInterval(() => {
                updateTimerDisplay();
                // Prevent any countdown logic from executing
            }, 500);
            activeIntervals.add(newId);
            return newId;
        }
        
        return id;
    };

    for (let i = 1; i < 500; i++) {
        clearInterval(i);
    }
 
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                const text = mutation.target.textContent || '';
                if (/Trial time left|minutes|minutes remaining/i.test(text)) {
                    shouldUpdate = true;
                }
            }
        });
        
        if (shouldUpdate) {
            updateTimerDisplay();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
    
    updateTimerDisplay();
    
    setInterval(updateTimerDisplay, 2000);
    
    console.log('%c Timer Unlimited - Active', 'color: #10b981; font-size: 12px;');
})();
