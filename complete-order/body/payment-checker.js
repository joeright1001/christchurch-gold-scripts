/**
 * Payment Status Checker
 * Handles payment button states and API communication
 * Extracted from code-payment-checker.txt
 */

// Define URLs
const DEV_URL = "https://1lm50541-3000.aue.devtunnels.ms";
const STAGING_FALLBACK_URL = "https://mware3-staging.up.railway.app";
const PROD_URL = "https://mware3-production.up.railway.app";

// Add MAX_ATTEMPTS constant
const MAX_ATTEMPTS = 5;

// Function to check if codespace is available
async function isCodespaceAvailable() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch(DEV_URL + '/health', {
            method: 'GET',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        console.log("Codespace not available:", error.message);
        return false;
    }
}

// Function to determine API URL based on environment
async function getApiBaseUrl() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('webflow.io')) {
        console.log("Staging environment detected - checking codespace availability");
        
        const codespaceAvailable = await isCodespaceAvailable();
        
        if (codespaceAvailable) {
            console.log("Using codespace DEV server");
            return DEV_URL;
        } else {
            console.log("Codespace unavailable - using railway staging server");
            return STAGING_FALLBACK_URL;
        }
    } else {
        console.log("Production environment detected - using PROD server");
        return PROD_URL;
    }
}

function getSessionDataWithExpiry(key) {
    const itemStr = sessionStorage.getItem(key);
    if (!itemStr) return null;

    try {
        const item = JSON.parse(itemStr);
        const now = new Date().getTime();

        if (now > item.expiry) {
            sessionStorage.removeItem(key);
            return null;
        }
        return item.value;
    } catch (error) {
        console.error(`Error parsing ${key}:`, error);
        return null;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setInitialStates() {
    const poliButton = document.querySelector('#paymentButton');
    const blinkButton = document.querySelector('#paymentBlinkpay');
    // const btcPayButton = document.querySelector('#paymentBitpay');
    const stripeButton = document.querySelector('#paymentCreditcard');
    const alipayButton = document.querySelector('#paymentAlipay');
    const windcaveButton = document.querySelector('#paymentWindcave');
    const pdfCheckmark = document.querySelector('#pdf-checkmark');
    const paylinkCheckmark = document.querySelector('#paylink-checkmark');

    [poliButton, blinkButton, /* btcPayButton, */ stripeButton, alipayButton, windcaveButton].forEach(button => {
        if (button) {
            button.innerHTML = `
                <span class="spinner"></span>
                <span>Processing...</span>
            `;
            button.classList.add('processing');
        }
    });

    [pdfCheckmark, paylinkCheckmark].forEach(icon => {
        if (icon) {
            icon.dataset.originalContent = icon.innerHTML;
            icon.innerHTML = '';
            icon.classList.add('status-icon', 'processing');
        }
    });
}

function setCompletionState() {
    const pdfCheckmark = document.querySelector('#pdf-checkmark');
    const paylinkCheckmark = document.querySelector('#paylink-checkmark');

    [pdfCheckmark, paylinkCheckmark].forEach(icon => {
        if (icon) {
            icon.classList.remove('processing', 'error');
            icon.classList.add('ready');
            icon.innerHTML = icon.dataset.originalContent;
        }
    });
}

function setErrorState() {
    const pdfCheckmark = document.querySelector('#pdf-checkmark');
    const paylinkCheckmark = document.querySelector('#paylink-checkmark');

    [pdfCheckmark, paylinkCheckmark].forEach(icon => {
        if (icon) {
            icon.classList.remove('processing');
            icon.classList.add('error');
            icon.innerHTML = `<svg width="30" height="30" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563" stroke="none" fill-rule="evenodd" fill="#e74c3c"></path></svg>`;
        }
    });
}

async function initializePaymentCheck() {
    // Get the API_URL based on current domain - FIXED: Added await
    const API_URL = await getApiBaseUrl();
    console.log(`Using API URL: ${API_URL}`);
    
    const poliButton = document.querySelector('#paymentButton');
    const blinkButton = document.querySelector('#paymentBlinkpay');
    // const btcPayButton = document.querySelector('#paymentBitpay');
    const stripeButton = document.querySelector('#paymentCreditcard');
    const alipayButton = document.querySelector('#paymentAlipay');
    const windcaveButton = document.querySelector('#paymentWindcave');

    // Check only required buttons (windcave is optional)
    if (!poliButton || !blinkButton || /* !btcPayButton || */ !stripeButton || !alipayButton) {
        console.error('ERROR: One or more required payment buttons not found');
        return;
    }

    console.log('Waiting 5 seconds before starting payment check...');
    await sleep(5000);
    console.log('Starting initialization after 5-second delay');

    const orderToken = getSessionDataWithExpiry('token');
    let attempts = 0;

    if (!orderToken) {
        console.error('ERROR: No order token found in sessionStorage or token has expired');
        [poliButton, blinkButton, /* btcPayButton, */ stripeButton, alipayButton, windcaveButton].forEach(button => {
            if (button) {
                button.innerHTML = 'Payment Option Not Available';
                button.classList.add('error');
            }
        });
        setErrorState();
        return;
    }

    async function checkPaymentStatus() {
        attempts++;
        console.log(`Attempt ${attempts} of ${MAX_ATTEMPTS}`);

        if (attempts > MAX_ATTEMPTS) {
            console.error('Maximum attempts reached');
            const allButtons = [poliButton, blinkButton, /* btcPayButton, */ stripeButton, alipayButton];
            if (windcaveButton) allButtons.push(windcaveButton);
            
            const allButtonsFailed = allButtons.every(button => !button.classList.contains('ready'));

            allButtons.forEach(button => {
                if (button && button.classList.contains('processing')) {
                    button.innerHTML = 'Payment link unavailable';
                    button.classList.remove('processing');
                    button.classList.add('error');
                }
            });

            if (allButtonsFailed) {
                setErrorState();
            } else {
                setCompletionState();
            }
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/payment-status/${orderToken}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Payment status response:', data);

            let poliReady = false;
            let blinkReady = false;
            // let btcPayReady = false;
            let stripeReady = false;
            let alipayReady = false;
            let windcaveReady = false;

            if (data.payments) {
                if (data.payments.POLi && poliButton) {
                    poliButton.innerHTML = 'Pay with POLi';
                    poliButton.href = data.payments.POLi.payment_url;
                    poliButton.classList.remove('processing');
                    poliButton.classList.add('ready');
                    poliReady = true;
                }
                
                if (data.payments.BLINK && blinkButton) {
                    blinkButton.innerHTML = 'Pay with Blink';
                    blinkButton.href = data.payments.BLINK.payment_url;
                    blinkButton.classList.remove('processing');
                    blinkButton.classList.add('ready');
                    blinkReady = true;
                }

                // BTCPay processing - COMMENTED OUT
                // if (data.payments.BTCPAY && btcPayButton) {
                //     btcPayButton.innerHTML = 'Pay with Bitcoin';
                //     btcPayButton.href = data.payments.BTCPAY.payment_url;
                //     btcPayButton.classList.remove('processing');
                //     btcPayButton.classList.add('ready');
                //     btcPayReady = true;
                // }

                if (data.payments.STRIPE && stripeButton) {
                    stripeButton.innerHTML = 'Pay with Credit Card';
                    stripeButton.href = data.payments.STRIPE.payment_url;
                    stripeButton.classList.remove('processing');
                    stripeButton.classList.add('ready');
                    stripeReady = true;
                }

                if (data.payments.ALIPAY && alipayButton) {
                    alipayButton.innerHTML = 'Pay with Alipay';
                    alipayButton.href = data.payments.ALIPAY.payment_url;
                    alipayButton.classList.remove('processing');
                    alipayButton.classList.add('ready');
                    alipayReady = true;
                }

                // Windcave processing (only if button exists)
                if (data.payments.WINDCAVE && windcaveButton) {
                    windcaveButton.innerHTML = 'Pay with Windcave';
                    windcaveButton.href = data.payments.WINDCAVE.payment_url;
                    windcaveButton.classList.remove('processing');
                    windcaveButton.classList.add('ready');
                    windcaveReady = true;
                }

                // Check if at least one payment is ready
                const anyPaymentReady = poliReady || blinkReady || /* btcPayReady || */ stripeReady || alipayReady || windcaveReady;
                
                // Check if all expected payments are ready (windcave only if button exists)
                const allExpectedReady = poliReady && blinkReady && /* btcPayReady && */ stripeReady && alipayReady && 
                    (!windcaveButton || windcaveReady);

                if (anyPaymentReady) {
                    setCompletionState();
                    if (!allExpectedReady) {
                        await sleep(2000);
                        await checkPaymentStatus();
                    }
                    return;
                }
            }

            // No payments ready yet, retry
            console.log('Payment URLs not ready, waiting 2 seconds before next attempt');
            await sleep(2000);
            await checkPaymentStatus();

        } catch (error) {
            console.error('Error checking payment status:', error);
            if (attempts < MAX_ATTEMPTS) {
                console.log('Retrying after error...');
                await sleep(2000);
                await checkPaymentStatus();
            } else {
                const allButtons = [poliButton, blinkButton, /* btcPayButton, */ stripeButton, alipayButton];
                if (windcaveButton) allButtons.push(windcaveButton);
                
                const allButtonsFailed = allButtons.every(button => !button.classList.contains('ready'));

                allButtons.forEach(button => {
                    if (button && button.classList.contains('processing')) {
                        button.innerHTML = 'Error checking payment';
                        button.classList.remove('processing');
                        button.classList.add('error');
                    }
                });

                if (allButtonsFailed) {
                    setErrorState();
                } else {
                    setCompletionState();
                }
            }
        }
    }

    console.log('Starting payment status check for token:', orderToken);
    await checkPaymentStatus();
}

window.Webflow = window.Webflow || [];
window.Webflow.push(async function() {
    setInitialStates();
    initializePaymentCheck().catch(error => {
        console.error('Fatal error in payment checker:', error);
        setErrorState();
    });
});
