/**
 * Script: Market Countdown Timer
 * 
 * Purpose:
 * - Displays "Open" if current time is Mon-Fri 9am-10pm (NZ Time).
 * - Displays "Opens in: HH:MM" if the market is closed.
 * - Synchronizes with server time via the 'Date' header to avoid reliance on the user's local clock.
 */

(function() {
    const TARGET_ID = 'market-timer';
    const OPEN_HOUR = 9;
    const CLOSE_HOUR = 22; // 10pm
    const TIMEZONE = 'Pacific/Auckland';

    let serverOffset = 0; // Local time - Server time
    let isSynced = false;

    /**
     * Sync with server time by fetching the 'Date' header.
     */
    async function syncWithServer() {
        try {
            const start = performance.now();
            const response = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
            const end = performance.now();
            const latency = (end - start) / 2;

            const serverDateStr = response.headers.get('Date');
            if (serverDateStr) {
                const serverTime = new Date(serverDateStr).getTime() + latency;
                serverOffset = Date.now() - serverTime;
                isSynced = true;
                console.log(`[MarketTimer] Synced with server. Offset: ${serverOffset}ms`);
            }
        } catch (error) {
            console.warn('[MarketTimer] Failed to sync with server time. Falling back to local clock.', error);
        }
    }

    /**
     * Get current time adjusted by server offset.
     */
    function getAdjustedTime() {
        return new Date(Date.now() - serverOffset);
    }

    /**
     * Get New Zealand time components.
     */
    function getNZComponents(date) {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: TIMEZONE,
            hour12: false,
            weekday: 'short',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });

        const parts = formatter.formatToParts(date);
        const map = {};
        parts.forEach(p => map[p.type] = p.value);

        return {
            weekday: map.weekday, // 'Mon', 'Tue', etc.
            hour: parseInt(map.hour, 10),
            minute: parseInt(map.minute, 10),
            second: parseInt(map.second, 10),
            day: parseInt(map.day, 10),
            month: parseInt(map.month, 10),
            year: parseInt(map.year, 10)
        };
    }

    /**
     * Calculate next opening time.
     */
    function getNextOpenTime(now) {
        // Create a copy of the date in NZ timezone
        // We'll iterate day by day until we find the next open slot
        let target = new Date(now.getTime());
        
        while (true) {
            const comp = getNZComponents(target);
            const isWeekday = !['Sat', 'Sun'].includes(comp.weekday);
            
            // If it's a weekday and before opening, the open time is today at 9am
            if (isWeekday && comp.hour < OPEN_HOUR) {
                const openTime = new Date(target.getTime());
                // This is tricky because we need to set the time in NZ.
                // We'll use a simpler approach: construct an ISO string in NZ timezone
                // and parse it back, but that's complex.
                // Instead, let's just adjust the current target date.
                
                // Set hours/mins/secs to 9:00:00 in NZ time
                // We'll do this by finding the difference
                const diffMs = ((OPEN_HOUR - comp.hour) * 3600 - comp.minute * 60 - comp.second) * 1000;
                return new Date(target.getTime() + diffMs);
            }
            
            // Otherwise, move to tomorrow at 9am (in current timezone, then we check weekday)
            // Reset to beginning of next day (approx)
            target.setHours(target.getHours() + (24 - comp.hour)); // Jump to roughly tomorrow
            // Reset to 00:00 roughly to start fresh check
            const newComp = getNZComponents(target);
            const adjustToStartOfDay = (newComp.hour * 3600 + newComp.minute * 60 + newComp.second) * 1000;
            target = new Date(target.getTime() - adjustToStartOfDay);
        }
    }

    /**
     * Update the timer display.
     */
    function updateTimer() {
        const timerEl = document.getElementById(TARGET_ID);
        if (!timerEl) return;

        const now = getAdjustedTime();
        const comp = getNZComponents(now);

        const isWeekday = !['Sat', 'Sun'].includes(comp.weekday);
        const isOpen = isWeekday && comp.hour >= OPEN_HOUR && comp.hour < CLOSE_HOUR;

        if (isOpen) {
            timerEl.textContent = 'Open';
        } else {
            const nextOpen = getNextOpenTime(now);
            const diffMs = nextOpen.getTime() - now.getTime();
            
            const diffTotalSecs = Math.floor(diffMs / 1000);
            const hours = Math.floor(diffTotalSecs / 3600);
            const minutes = Math.floor((diffTotalSecs % 3600) / 60);
            const seconds = diffTotalSecs % 60;

            // Format as Opens in: H:MM:SS or HH:MM:SS
            const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerEl.textContent = `Opens in: ${formattedTime}`;
        }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', async () => {
        await syncWithServer();
        updateTimer();
        setInterval(updateTimer, 1000);
    });

    // Re-sync occasionally (e.g., every 10 minutes)
    setInterval(syncWithServer, 600000);
})();
