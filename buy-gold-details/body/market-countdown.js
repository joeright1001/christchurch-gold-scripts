/**
 * Script: Market Countdown Timer
 * 
 * Purpose:
 * - Displays "Open" if market is currently active in NZ Time.
 * - Displays countdown "H:MM:SS" if the market is closed.
 * - Displays next opening information in 'market-status-sub-text' when closed.
 * 
 * Operating Hours (NZ Time):
 * - Monday: 11:00 AM - 10:00 PM
 * - Tuesday - Friday: 9:00 AM - 10:00 PM
 * - Saturday - Sunday: Closed
 * 
 * Messaging (when closed):
 * - Weekends & Monday: "Opens Monday 11:00am"
 * - Tuesday - Friday: "Opens [Day-of-Week] 9:00am"
 */

(function() {
    const TIMER_ID = 'market-timer';
    const SUB_TEXT_ID = 'market-status-sub-text';
    const TIMEZONE = 'Pacific/Auckland';

    // Day configuration
    const DAY_CONFIG = {
        'Mon': { open: 11, close: 22, fullName: 'Monday' },
        'Tue': { open: 9,  close: 22, fullName: 'Tuesday' },
        'Wed': { open: 9,  close: 22, fullName: 'Wednesday' },
        'Thu': { open: 9,  close: 22, fullName: 'Thursday' },
        'Fri': { open: 9,  close: 22, fullName: 'Friday' },
        'Sat': { open: null, close: null, fullName: 'Saturday' },
        'Sun': { open: null, close: null, fullName: 'Sunday' }
    };

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
     * Returns an object { date: Date, config: Object }
     */
    function getNextOpenTime(now) {
        let target = new Date(now.getTime());
        
        // Loop up to 7 days to find the next opening
        for (let i = 0; i < 8; i++) {
            const comp = getNZComponents(target);
            const config = DAY_CONFIG[comp.weekday];

            // If this day has an opening hour and we haven't passed it yet today
            if (config && config.open !== null) {
                // If we are looking at 'today' (i=0), check if we are before the open hour
                // If we are looking at a future day, the first one with an open hour is our target
                if (i > 0 || comp.hour < config.open) {
                    // Calculate the exact date for this day's opening
                    // We adjust target to the opening hour
                    const diffMs = ((config.open - comp.hour) * 3600 - comp.minute * 60 - comp.second) * 1000;
                    return {
                        date: new Date(target.getTime() + diffMs),
                        config: config
                    };
                }
            }
            
            // Move to start of next day
            target.setHours(target.getHours() + (24 - comp.hour));
            const newComp = getNZComponents(target);
            const adjustToStartOfDay = (newComp.hour * 3600 + newComp.minute * 60 + newComp.second) * 1000;
            target = new Date(target.getTime() - adjustToStartOfDay);
        }
        return null; // Should never happen
    }

    /**
     * Update the timer display.
     */
    function updateTimer() {
        const timerEl = document.getElementById(TIMER_ID);
        const subTextEl = document.getElementById(SUB_TEXT_ID);
        
        if (!timerEl) return;

        const now = getAdjustedTime();
        const comp = getNZComponents(now);
        const config = DAY_CONFIG[comp.weekday];

        const isOpen = config && config.open !== null && comp.hour >= config.open && comp.hour < config.close;

        if (isOpen) {
            timerEl.textContent = 'Open';
            // Do not update subTextEl if open, as per instructions
        } else {
            const nextOpen = getNextOpenTime(now);
            if (!nextOpen) return;

            // 1. Update Countdown Timer
            const diffMs = nextOpen.date.getTime() - now.getTime();
            const diffTotalSecs = Math.max(0, Math.floor(diffMs / 1000));
            const hours = Math.floor(diffTotalSecs / 3600);
            const minutes = Math.floor((diffTotalSecs % 3600) / 60);
            const seconds = diffTotalSecs % 60;

            const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerEl.textContent = formattedTime;

            // 2. Update Sub-text Message
            if (subTextEl) {
                const openHourStr = nextOpen.config.open === 11 ? '11:00am' : '9:00am';
                subTextEl.textContent = `Opens ${nextOpen.config.fullName} ${openHourStr}`;
            }
        }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', async () => {
        await syncWithServer();
        updateTimer();
        setInterval(updateTimer, 1000);
    });

    // Re-sync occasionally (every 10 minutes)
    setInterval(syncWithServer, 600000);
})();
