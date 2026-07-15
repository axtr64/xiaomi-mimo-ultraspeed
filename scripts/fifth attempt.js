(function() {
    'use strict';
    
    function removeBlocker() {
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            if (el.textContent === "Trial quota exhausted" || 
                el.textContent === "You've used up today's trial quota — come back tomorrow to continue") {
                const parent = el.parentElement;
                if (parent) {
                    const grandparent = parent.parentElement;
                    if (grandparent && grandparent.classList.contains('flex-1')) {
                        grandparent.innerHTML = `
                            <div class="flex flex-1 flex-col overflow-hidden">
                                <div class="flex h-full w-full flex-col items-center justify-center gap-12 py-6 md:-translate-y-14 flex-1">
                                    <div class="flex select-none flex-col items-center justify-center gap-2 text-[color:var(--ultra-text-h1)]">
                                        <svg fill="none" viewBox="0 0 471 46" aria-label="MiMo-V2.5-Pro UltraSpeed" class="h-8 w-auto shrink-0 md:h-[2.875rem]">
                                            <path fill="currentColor" d="M24.19 10.865h3.255V36H24.19V16.676L15.333 29.28h-.28L6.196 16.676V36h-3.22V10.865h3.22l8.997 13.233zm8.826 6.651h3.151V36h-3.15zm-.035-8.331h3.221v3.22h-3.22zm30.01 1.68h3.256V36h-3.256V16.676L54.135 29.28h-.28l-8.857-12.603V36h-3.22V10.865h3.22l8.997 13.233zm17.614 22.37q2.906 0 4.62-1.716 1.716-1.75 1.716-4.69 0-3.012-1.715-4.762-1.75-1.785-4.621-1.785-2.87 0-4.551 1.75-1.68 1.75-1.68 4.761 0 2.94 1.68 4.691t4.55 1.75m0 3.08q-4.096 0-6.792-2.66-2.695-2.696-2.695-6.862 0-4.201 2.695-6.896Q76.51 17.2 80.605 17.2q4.235 0 6.896 2.73t2.66 6.862q0 4.166-2.695 6.861-2.695 2.661-6.861 2.661m14.503-13.758h15.823v3.151H95.108zm40.47-11.692h3.71L128.681 36h-3.115l-10.642-25.135h3.745l8.437 20.864zm12.424 21.984h11.517V36h-16.698v-2.346l8.191-9.241q1.821-2.03 2.976-3.746 1.12-1.75 1.155-3.5 0-1.47-1.155-2.381-1.19-.91-2.801-.91-3.5.105-4.866 3.325l-3.64-.56q.84-2.975 3.115-4.55 2.276-1.576 5.251-1.576 3.536 0 5.636 1.855 2.101 1.82 2.101 4.551a7.6 7.6 0 0 1-.945 3.676q-.945 1.715-3.886 5.181zm16.635-.245h3.605V36h-3.605zm8.359-.77 2.45-1.89q2.136 3.186 5.531 3.185 2.626 0 4.096-1.4 1.47-1.435 1.471-3.746 0-2.1-1.401-3.395-1.436-1.296-3.92-1.296-1.576 0-2.626.456a5.6 5.6 0 0 0-1.96 1.295l-2.661-1.505 1.82-12.673h12.673v3.15h-9.697l-.98 7.317q1.68-1.155 4.271-1.26 3.57 0 5.706 2.275 2.1 2.241 2.1 5.531 0 3.78-2.345 6.127-2.38 2.345-6.407 2.345-2.555 0-4.795-1.19-2.276-1.19-3.326-3.326m21.971-9.277h15.823v3.151h-15.823zm30.282 1.296q3.115 0 4.866-1.296 1.715-1.294 1.715-3.885 0-2.17-1.715-3.431-1.714-1.296-4.761-1.295h-5.286v9.907zm.945-12.988q4.341 0 6.722 2.136 2.345 2.1 2.345 5.67 0 3.887-2.485 6.092-2.521 2.17-7.282 2.17h-5.426V36h-3.291V10.865zm19.088 6.791q.806-.384 2.205-.42 1.365-.034 1.926.245l-.56 3.186q-1.54-.245-2.906 0-1.89.42-3.431 1.96V36h-3.15V17.516h2.835l.245 2.276q1.015-1.191 2.836-2.136m15.28 15.578q2.905 0 4.621-1.715 1.716-1.75 1.715-4.69 0-3.012-1.715-4.762-1.75-1.785-4.621-1.785t-4.551 1.75-1.68 4.761q0 2.94 1.68 4.691t4.551 1.75m0 3.081q-4.095 0-6.791-2.66-2.696-2.696-2.696-6.862 0-4.201 2.696-6.896t6.791-2.696q4.236 0 6.896 2.73t2.661 6.862q0 4.166-2.696 6.861-2.696 2.661-6.861 2.661m27.294-25.45v14.983q0 7.281 6.546 7.281 2.835 0 4.586-1.925 1.75-1.925 1.75-5.531V10.865h3.326v15.193q-.035 2.836-.84 4.796-.84 1.96-2.206 3.15-3.01 2.381-6.616 2.276-4.586 0-7.211-2.45-2.626-2.486-2.626-7.457V10.865zm24.777-2.1v23.034q0 1.68 1.19 1.68.525 0 1.225-.245l.385 2.521q-1.33.455-2.485.455-3.361 0-3.466-3.99V8.764zm15.71 24.014 1.085 2.31q-1.89 1.226-3.711 1.191-2.03 0-3.291-1.435-1.295-1.47-1.295-3.921V20.387h-3.816v-2.87h3.816v-5.742h3.151v5.741h4.341v2.87h-4.341V30.89q0 2.52 1.89 2.52 1.015 0 2.171-.63m10.746-15.123q.805-.384 2.206-.42 1.365-.034 1.925.245l-.56 3.186q-1.54-.245-2.905 0-1.891.42-3.431 1.96V36h-3.151V17.516h2.836l.245 2.276q1.016-1.191 2.835-2.136m9.737 12.673q0 1.365 1.05 2.275 1.051.876 3.046.876 2.976-.106 4.761-1.996v-3.78q-1.365-.56-3.536-.596-2.135 0-3.71.875-1.611.876-1.611 2.346m4.621-13.128q3.43 0 5.391 1.926t1.961 5.566V36h-2.801l-.245-1.925q-1.89 2.135-5.286 2.205-3.081 0-4.971-1.61t-1.89-4.306q0-2.52 2.275-4.166 2.276-1.645 5.846-1.645 2.24.034 3.956.7v-.84q0-1.89-1.085-3.01-1.086-1.122-3.081-1.121-3.01 0-6.371 1.4l-.91-2.835q3.675-1.646 7.211-1.646m11.567 15.508 2.03-2.625q3.606 3.186 7.527 3.045 2.45 0 3.815-1.085 1.366-1.085 1.366-2.975 0-1.611-1.226-2.73-1.26-1.157-4.551-2.031-4.2-1.12-6.091-2.73-1.89-1.611-1.89-4.517 0-2.695 2.31-4.62t5.881-1.926q5.007-.035 8.402 2.695l-1.855 2.661a9 9 0 0 0-3.081-1.68q-1.785-.56-3.396-.56-2.1 0-3.465.98-1.365.945-1.365 2.415 0 1.575 1.505 2.59 1.504.98 4.866 1.891 7.456 2.066 7.456 7.106 0 3.291-2.275 5.532-2.311 2.205-6.371 2.205-5.672 0-9.592-3.64m30.503.455q2.346 0 3.991-1.785t1.645-4.76q0-2.801-1.61-4.587t-3.851-1.785q-3.15 0-5.286 2.275V31.1q1.96 1.996 5.111 2.065m.84-15.928q3.5 0 5.776 2.73 2.276 2.697 2.276 6.652 0 4.27-2.486 6.932-2.52 2.66-6.126 2.66-3.081 0-5.391-2.03V43h-3.116V17.516h2.801l.28 2.1q2.45-2.38 5.986-2.38m20.765 3.046q-2.205 0-3.641 1.365-1.435 1.33-1.75 3.36h10.572q-.105-2.064-1.47-3.395-1.366-1.33-3.711-1.33m-5.601 7.491q.105 2.626 1.68 4.131 1.575 1.47 4.341 1.47 2.1 0 3.466-.7 1.365-.735 2.415-2.275l2.276 1.75q-1.296 2.066-3.396 3.116t-4.691 1.05q-4.516 0-6.931-2.66-2.451-2.661-2.451-6.897t2.521-6.896q2.485-2.66 6.371-2.66 3.99 0 6.336 2.485t2.346 6.301l-.14 1.785zm27.002-7.491q-2.206 0-3.641 1.365-1.435 1.33-1.75 3.36h10.572q-.105-2.064-1.471-3.395-1.365-1.33-3.71-1.33m-5.601 7.491q.105 2.626 1.68 4.131 1.575 1.47 4.341 1.47 2.1 0 3.465-.7 1.366-.735 2.416-2.275l2.275 1.75q-1.295 2.066-3.395 3.116t-4.691 1.05q-4.516 0-6.932-2.66-2.45-2.661-2.45-6.897t2.52-6.896q2.485-2.66 6.372-2.66 3.99 0 6.336 2.485t2.345 6.301a379 379 0 0 1-.14 1.785zm27.176 5.531q2.976 0 4.761-2.275v-8.752q-2.135-1.96-5.041-1.925-2.206 0-3.85 1.82-1.681 1.785-1.681 4.411 0 2.836 1.681 4.796 1.644 1.925 4.13 1.925m4.761-24.54h3.116V36h-2.801l-.21-1.89q-.804.875-2.17 1.505t-2.906.63q-3.955 0-6.406-2.66-2.45-2.696-2.45-6.967 0-4.026 2.52-6.686 2.485-2.66 6.091-2.66 3.43.14 5.216 1.785z"></path></svg>
                                        <div class="text-base leading-6 text-mimo-icon-n2 md:text-lg">Flagship performance, instant experience</div>
                                    </div>
                                    <div class="flex w-full flex-col items-center gap-6">
                                        <div class="dialogue-container relative mx-auto w-full px-4">
                                            <div class="dark:from-mimo-bg-concent-base/0 pointer-events-none absolute left-0 h-6 w-full -translate-y-full bg-gradient-to-b from-white/0 to-white dark:to-mimo-bg-concent-base top-0 z-20"></div>
                                            <div class="relative mx-auto w-full max-w-[50rem]">
                                                <div class="relative transition-none dark:bg-mimo-bg-card rounded-2xl border border-[color:var(--ultra-line-input-border)] bg-mimo-bg-outlined dark:border-transparent" style="box-shadow: var(--ultra-shadow-input);">
                                                    <div class="p-4 pt-4 pr-3 pb-3 pl-4">
                                                        <div class="flex gap-2 items-end">
                                                            <textarea placeholder="Tell me what you want to build. Hold Shift+Enter to start a new line." maxlength="50000" rows="1" class="relative mb-1 max-h-[160px] min-h-[32px] w-full resize-none overflow-y-auto bg-transparent text-base leading-6 text-gray-900 placeholder-gray-400 placeholder:font-light focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-50 dark:placeholder-gray-500 retina:placeholder:font-normal md:text-sm" style="height: 32px;"></textarea>
                                                        </div>
                                                        <div class="relative flex w-full items-end justify-between">
                                                            <div class="hide-scrollbar flex min-w-0 items-center overflow-x-auto pr-3 md:-ml-1.5" style="mask-image: linear-gradient(270deg, transparent 0%, rgb(0, 0, 0) 16px);">
                                                                <div class="flex items-center gap-2 whitespace-nowrap"></div>
                                                            </div>
                                                            <div class="flex flex-shrink-0 items-center gap-3">
                                                                <button type="button" class="inline-flex relative justify-center items-center outline-none select-none cursor-pointer rounded-full bg-black/90 dark:bg-white/90 text-white dark:text-black border border-transparent disabled:opacity-40 disabled:cursor-not-allowed h-7 w-7" data-track-id="home_send_btn" data-track-name="home_send_message" data-state="closed">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 16" class="size-[0.875rem]">
                                                                        <path fill="currentColor" d="M.244 7.921 18.202.03c.254-.111.528.115.452.373L14.51 14.345a.33.33 0 0 1-.448.201l-4.337-1.852a.333.333 0 0 0-.44.178l-1.14 2.923c-.117.298-.565.262-.63-.049l-.851-4.089a.31.31 0 0 1 .09-.285l6.707-6.448c.061-.059-.025-.15-.092-.098L5.396 10.25a.99.99 0 0 1-.92.099L.244 8.65a.395.395 0 0 1 0-.73"></path>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }
            }
        });
    }
    
    function enableInputs() {
        document.querySelectorAll('textarea, input').forEach(el => {
            el.removeAttribute('disabled');
            el.disabled = false;
            el.style.opacity = '1';
        });
        
        document.querySelectorAll('button').forEach(btn => {
            btn.removeAttribute('disabled');
            btn.disabled = false;
            btn.style.opacity = '1';
        });
    }
    
    const origSetAttr = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (name === 'disabled') return;
        return origSetAttr.call(this, name, value);
    };
    
    removeBlocker();
    enableInputs();
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            removeBlocker();
            enableInputs();
        }, i * 200);
    }
    
    console.log('%c Restored', 'color: #10b981;');
})();
