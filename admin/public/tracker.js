(function () {

    const API_URL = '/api/analytics';
    
    function getSessionId() {
        let sid = localStorage.getItem('__anly_sid');
        if (!sid) {
            sid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'sid_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('__anly_sid', sid);
        }
        return sid;
    }

    const sessionId = getSessionId();
    const startTime = Date.now();
    let visitSent = false;


    function trackVisit() {
        if (visitSent) return;
        fetch(`${API_URL}/visit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                userAgent: navigator.userAgent
            })
        }).catch(err => console.debug('Tracker blocked/failed', err));
        visitSent = true;
    }


    window.trackEvent = function(eventName) {
        fetch(`${API_URL}/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                type: eventName
            })
        }).catch(err => console.debug('Tracker event blocked', err));
    };


    function recordLeave() {
        const duration = Math.floor((Date.now() - startTime) / 1000); 
        
        const data = JSON.stringify({ sessionId, duration });
        if (navigator.sendBeacon) {
            navigator.sendBeacon(`${API_URL}/leave`, new Blob([data], { type: 'application/json' }));
        } else {
            fetch(`${API_URL}/leave`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: data,
                keepalive: true
            }).catch(() => {});
        }
    }

    window.addEventListener('load', trackVisit);
    
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') recordLeave();
    });

    window.addEventListener('beforeunload', recordLeave);


    document.addEventListener('click', (e) => {
        if (e.target.closest('.cta-button') || e.target.closest('#cta-final a')) {
            window.trackEvent('btn_cta_click');
        }
    });

})();
