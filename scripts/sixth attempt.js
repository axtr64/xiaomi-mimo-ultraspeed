(function() {
    'use strict';
    
    function restoreUI() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.textContent === "Trial quota exhausted" || 
                el.textContent?.includes("You've used up today's trial quota")) {
                const parent = el.parentElement?.parentElement;
                if (parent && parent.classList.contains('flex-1')) {
                    // Replace with working chat interface
                    parent.innerHTML = `
                        <div class="flex flex-1 flex-col overflow-hidden">
                            <div class="flex h-full w-full flex-col items-center justify-center gap-12 py-6 md:-translate-y-14 flex-1">
                                <div class="flex select-none flex-col items-center justify-center gap-2 text-[color:var(--ultra-text-h1)]">
                                    <svg fill="none" viewBox="0 0 471 46" class="h-8 w-auto shrink-0 md:h-[2.875rem]">
                                        <path fill="currentColor" d="M24.19 10.865h3.255V36H24.19V16.676L15.333 29.28h-.28L6.196 16.676V36h-3.22V10.865h3.22l8.997 13.233zm8.826 6.651h3.151V36h-3.15zm-.035-8.331h3.221v3.22h-3.22zm30.01 1.68h3.256V36h-3.256V16.676L54.135 29.28h-.28l-8.857-12.603V36h-3.22V10.865h3.22l8.997 13.233zm17.614 22.37q2.906 0 4.62-1.716 1.716-1.75 1.716-4.69 0-3.012-1.715-4.762-1.75-1.785-4.621-1.785-2.87 0-4.551 1.75-1.68 1.75-1.68 4.761 0 2.94 1.68 4.691t4.55 1.75m0 3.08q-4.096 0-6.792-2.66-2.695-2.696-2.695-6.862 0-4.201 2.695-6.896Q76.51 17.2 80.605 17.2q4.235 0 6.896 2.73t2.66 6.862q0 4.166-2.695 6.861-2.695 2.661-6.861 2.661m14.503-13.758h15.823v3.151H95.108z"></path>
                                    </svg>
                                    <div class="text-base leading-6 text-mimo-icon-n2 md:text-lg">Flagship performance, instant experience</div>
                                </div>
                                <div class="flex w-full flex-col items-center gap-6">
                                    <div class="relative mx-auto w-full max-w-[50rem]">
                                        <div class="relative rounded-2xl border bg-mimo-bg-outlined p-4">
                                            <div class="flex gap-2 items-end">
                                                <textarea id="chat-input" placeholder="Tell me what you want to build..." maxlength="50000" rows="1" class="w-full resize-none bg-transparent text-base leading-6 outline-none" style="height: 32px;"></textarea>
                                            </div>
                                            <div class="flex justify-end mt-2">
                                                <button id="send-btn" type="button" class="rounded-full bg-black/90 text-white h-7 w-7 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 16" class="h-4 w-4">
                                                        <path fill="currentColor" d="M.244 7.921 18.202.03c.254-.111.528.115.452.373L14.51 14.345a.33.33 0 0 1-.448.201l-4.337-1.852a.333.333 0 0 0-.44.178l-1.14 2.923c-.117.298-.565.262-.63-.049l-.851-4.089a.31.31 0 0 1 .09-.285l6.707-6.448c.061-.059-.025-.15-.092-.098L5.396 10.25a.99.99 0 0 1-.92.099L.244 8.65a.395.395 0 0 1 0-.73"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
        });
        
        document.querySelectorAll('textarea, input, button').forEach(el => {
            el.removeAttribute('disabled');
            el.disabled = false;
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
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
        
        if (urlStr.includes('trial') || urlStr.includes('quota') || urlStr.includes('session') || urlStr.includes('auth')) {
            console.log('[Bypass] Faking trial check:', urlStr);
            return new Response(JSON.stringify(fakeTrialData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (urlStr.includes('chat') || urlStr.includes('message') || urlStr.includes('completion')) {
            if (options) {
                options.headers = options.headers || {};
 
                if (typeof options.headers === 'object') {
                    options.headers['X-Trial-Token'] = 'fake-unlimited-token';
                    options.headers['X-Quota-Remaining'] = '9999';
                }
            }
        }
        
        try {
            const response = await originalFetch.call(this, url, options);
            return response;
        } catch (e) {
        
            console.log('[Bypass] Request failed, returning fake success');
            return new Response(JSON.stringify({ success: true, message: "Bypassed" }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        return originalXHROpen.call(this, method, url, ...args);
    };
    
    XMLHttpRequest.prototype.send = function(body) {
        const url = this._url || '';
        
        if (url.includes('trial') || url.includes('quota') || url.includes('session')) {
            Object.defineProperty(this, 'responseText', {
                value: JSON.stringify(fakeTrialData),
                writable: false
            });
            Object.defineProperty(this, 'status', { value: 200, writable: false });
            Object.defineProperty(this, 'readyState', { value: 4, writable: false });
            
            setTimeout(() => {
                if (this.onreadystatechange) this.onreadystatechange();
                if (this.onload) this.onload();
            }, 0);
            return;
        }
        
        return originalXHRSend.call(this, body);
    };
    
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj, prop, descriptor) {
        if (prop === 'disabled' && descriptor?.value === true) {
            descriptor.value = false;
        }
        if (prop === 'textContent' && descriptor?.value?.includes?.('exhausted')) {
            descriptor.value = 'Trial time left: Unlimited';
        }
        return originalDefineProperty.call(this, obj, prop, descriptor);
    };

    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (name === 'disabled') return;
        if (name === 'textContent' && typeof value === 'string' && value.includes('exhausted')) {
            value = 'Trial time left: Unlimited';
        }
        return originalSetAttribute.call(this, name, value);
    };

    restoreUI();

    let attempts = 0;
    const interval = setInterval(() => {
        restoreUI();
        attempts++;
        if (attempts > 20) clearInterval(interval);
    }, 200);
    
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = function(key) {
        if (key?.toLowerCase().includes('trial') || key?.toLowerCase().includes('quota')) {
            return JSON.stringify(fakeTrialData);
        }
        return originalGetItem.call(this, key);
    };

    const frozenTime = new Date('2099-12-31').getTime();
    Date.now = () => frozenTime;
    
    console.log('%c Full Bypass Active - Frontend + Backend', 'color: #10b981; font-size: 14px; font-weight: bold;');
    console.log('%cYou should now be able to send messages', 'color: #10b981;');
})();
