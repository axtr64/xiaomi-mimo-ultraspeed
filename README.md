# xiaomi-mimo-ultraspeed
> best to use when your trial is still active, i got another 30 mins (my quota was only 1 trial = 30 mins per day)

this repository contains a browser optimization and structural manipulation script designed to modify client-side behaviors on the Xiaomi MiMo UltraSpeed platform interface.

## configuration
configure your authentic account identifier within the script parameters prior to execution:
```
name: "userId",
value: "your userId",
```
## core modifications

| attempt | modification description | definition |
|---|---|---|
| 1 | timer unlimited | stops the browser from running the 30-minute session countdown. |
| 2 | reduce console spams (less lag) | blocks excessive system logs to stop the interface from lagging. |
| 3 | fixed, visible prompt chatbox | keeps the text input area unlocked and viewable on screen. |
| 4 | fixed blockage white webpage | prevents the site from showing an empty white screen during state updates. |
| 5 | trial quota exhausted | stops the system from popping up the limit notice layout. |
| 6 | fakes trial validation | injects mock success states into local memory to mimic approval. |
| 7 | hides the blocker (best to use in old conversation | clear overlay elements so you can read old chats. |
| 8 | escalation script | forces the interface to stay active when connection states drop. |


## this script uses 7 attack vectors: 
> (no.8 attempt.js file)
1. blocks setAttribute('disabled') at the browser api level
2. hooks the disabled property so javascript can't set it
3. mutationObserver catches react trying to disable elements
4. continuous enable loop keeps forcing elements enabled
5. api interception fakes trial validation
6. localstorage hooks returns fake unlimited data
7. custom send handler adds manual event listeners as backup


