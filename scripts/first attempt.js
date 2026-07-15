(function() {
    'use strict';
    
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;
    const originalClearInterval = window.clearInterval;
    
    const timerIntervals = new Set();
    
    window.setInterval = function(callback, delay, ...args) {
        // Check if this looks like a countdown timer (common patterns)
        const callbackStr = callback.toString();
        const isTimer = /time|countdown|trial|expire|remaining|minutes|seconds/i.test(callbackStr) || delay === 1000;
        
        const id = originalSetInterval.call(this, callback, delay, ...args);
        
        if (isTimer || delay === 1000) {
            timerIntervals.add(id);
            console.log('[Timer Bypass] Intercepted timer interval:', id);
        }
        
        return id;
    };

    const allIntervals = [];
    for (let i = 1; i < 9999; i++) {
        originalClearInterval(i);
    }
  
    function modifyTimerDisplay() {
        // Look for the timer text by common patterns
        const xpath = "//*[contains(text(), 'Trial time left') or contains(text(), 'minutes') or contains(text(), 'time left')]";
        const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        
        for (let i = 0; i < result.snapshotLength; i++) {
            const element = result.snapshotItem(i);
            if (element && element.textContent) {
                // Replace with unlimited message
                Object.defineProperty(element, 'textContent', {
                    get: function() { return 'Trial time left: Unlimited'; },
                    set: function() {},
                    configurable: true
                });
  
                Object.defineProperty(element, 'innerText', {
                    get: function() { return 'Trial time left: Unlimited'; },
                    set: function() {},
                    configurable: true
                });
                
                element.textContent = 'Trial time left: Unlimited';
                element.style.color = '#10b981'; // Green color
                element.style.fontWeight = 'bold';
                
                console.log('[Timer Bypass] Timer display modified to unlimited');
            }
        }
        
        const timerElements = document.querySelectorAll('[class*="timer"], [class*="countdown"], [class*="trial"], [class*="expire"]');
        timerElements.forEach(el => {
            if (el.textContent && el.textContent.includes('minutes')) {
                el.textContent = 'Unlimited';
                el.style.color = '#10b981';
            }
        });
    }
    
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    
    localStorage.setItem = function(key, value) {
        if (/time|trial|expire|countdown|session/i.test(key)) {
            console.log('[Timer Bypass] Blocked localStorage write:', key);
            return;
        }
        return originalSetItem.call(this, key, value);
    };
    
    localStorage.getItem = function(key) {
        if (/time|trial|expire|countdown|session/i.test(key)) {
            console.log('[Timer Bypass] Returning fake unlimited value for:', key);
            return '9999999999999'; 
        }
        return originalGetItem.call(this, key);
    };
    
    const OriginalDate = Date;
    const frozenTime = new OriginalDate('2099-12-31T23:59:59').getTime();
    
    window.Date = function(...args) {
        if (args.length === 0) {
            return new OriginalDate(frozenTime);
        }
        return new OriginalDate(...args);
    };
    
    Date.now = function() { return frozenTime; };
    Date.prototype = OriginalDate.prototype;
    
    if (window.performance) {
        const originalNow = window.performance.now.bind(window.performance);
        let fakeTime = 0;
        window.performance.now = function() {
            fakeTime += 16; // Simulate ~60fps
            return fakeTime;
        };
    }

    setInterval(modifyTimerDisplay, 500);
    
    modifyTimerDisplay();

    window.onbeforeunload = null;
    
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0]?.toString() || '';
        if (/time|trial|expire|session|limit/i.test(url)) {
            console.log('[Timer Bypass] Blocked timer check request:', url);
            return Promise.resolve(new Response(JSON.stringify({
                timeRemaining: 99999999,
                isUnlimited: true,
                expired: false
            }), { status: 200 }));
        }
        return originalFetch.apply(this, args);
    };
    
    console.log('%c[Timer Bypass] Unlimited timer activated!', 'color: #10b981; font-size: 14px; font-weight: bold;');
    console.log('%c[Timer Bypass] Timer will now show "Unlimited" and never expire.', 'color: #10b981;');
})();
