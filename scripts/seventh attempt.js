(function() {
    'use strict';
    function hideExhaustedScreen() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent === "Trial quota exhausted" || 
                node.textContent?.includes("You've used up today's trial quota")) {
                let el = node.parentElement;
                while (el && !el.classList?.contains('flex-1')) {
                    el = el.parentElement;
                }
                
                if (el && el.classList.contains('flex-1')) {
 
                    const parent = el.parentElement;
                    if (parent) {
                        const centeredDiv = el.querySelector('.flex-col.items-center');
                        if (centeredDiv) {
                            centeredDiv.style.display = 'none';
                            
                            const dialogue = el.querySelector('.dialogue-container');
                            if (dialogue) {
                                dialogue.style.display = 'block';
                            }
                        }
                    }
                }
            }
        }
    }
    

    function enableElements() {
        document.querySelectorAll('textarea').forEach(el => {
            el.removeAttribute('disabled');
            el.disabled = false;
            el.style.opacity = '1';
            el.style.cursor = 'text';
        });

        document.querySelectorAll('button').forEach(btn => {
            if (btn.getAttribute('data-track-id')?.includes('send') || 
                btn.innerHTML?.includes('M.244') ||
                btn.closest('.dialogue-container')) {
                btn.removeAttribute('disabled');
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
        });

        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent?.includes('New conversation')) {
                btn.removeAttribute('disabled');
                btn.disabled = false;
                btn.style.opacity = '1';
            }
        });
    }
    

    function restoreSidebar() {
        const sidebar = document.querySelector('.w-\\[16rem\\]') || 
                       document.querySelector('[class*="w-64"]');
        if (sidebar) {
            sidebar.style.display = 'flex';
            sidebar.style.transform = 'translateX(0)';
        }
        
        document.querySelectorAll('div').forEach(div => {
            if (div.textContent === 'History') {
                const parent = div.closest('.flex-col');
                if (parent) {
                    parent.style.display = 'flex';
                }
            }
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
        
        if (urlStr.includes('trial') || urlStr.includes('quota') || urlStr.includes('session')) {
            return new Response(JSON.stringify(fakeTrialData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return originalFetch.call(this, url, options);
    };
    
    hideExhaustedScreen();
    enableElements();
    restoreSidebar();
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            hideExhaustedScreen();
            enableElements();
            restoreSidebar();
        }, i * 150);
    }
    
    console.log('%c Restored - Check if sidebar and chat work now', 'color: #10b981;');
})();
