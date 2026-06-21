/**
 * Script: Market Countdown Timer
 * 
 * Purpose:
 * - Reads a duration from 'market-next-open-hidden' (format HH:MM or HH:MM:SS)
 * - Displays a live countdown timer in 'market-reopen-timer'
 * - Displays "PUBLIC HOLIDAY" if the value is not a time duration (e.g. "PUB HOLIDAY")
 */

(function() {
    function initCountdown() {
        const hiddenEl = document.getElementById('market-next-open-hidden');
        const targetEl = document.getElementById('market-reopen-timer');
        
        if (!hiddenEl || !targetEl) {
            return;
        }
        
        const rawValue = (hiddenEl.value || hiddenEl.textContent || '').trim();
        if (!rawValue) {
            return;
        }
        
        // Match HH:MM or HH:MM:SS format
        const timeMatch = rawValue.match(/^(\d+):(\d{2})(?::(\d{2}))?$/);
        
        if (timeMatch) {
            const hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2], 10);
            const seconds = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
            
            // Calculate exact target time from now
            const targetTime = Date.now() + (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
            
            let intervalId;
            
            function updateTimer() {
                const now = Date.now();
                const remaining = targetTime - now;
                
                if (remaining <= 0) {
                    targetEl.textContent = '00:00:00';
                    if (intervalId) clearInterval(intervalId);
                    return;
                }
                
                const diffTotalSecs = Math.floor(remaining / 1000);
                const h = Math.floor(diffTotalSecs / 3600);
                const m = Math.floor((diffTotalSecs % 3600) / 60);
                const s = diffTotalSecs % 60;
                
                targetEl.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }
            
            updateTimer();
            intervalId = setInterval(updateTimer, 1000);
            
        } else {
            // Not in HH:MM or HH:MM:SS format (e.g., PUB HOLIDAY)
            targetEl.textContent = 'PUBLIC HOLIDAY';
        }
    }

    // Initialize once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCountdown);
    } else {
        initCountdown();
    }
})();
