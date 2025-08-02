/**
 * Custom Radio Button Controller
 * Handles radio button functionality and div visibility management
 * Extracted from code-radio-button.txt
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all required elements
    const container1 = document.getElementById('radio1');
    const container2 = document.getElementById('radio2');
    const container3 = document.getElementById('radio3');
    const container4 = document.getElementById('radio4');
    const container5 = document.getElementById('radio5');
    const container6 = document.getElementById('radio6');
    const container7 = document.getElementById('radio7');
    const container8 = document.getElementById('radio8');
    const hidden1 = document.getElementById('hidden1');
    const hidden2 = document.getElementById('hidden2');
    const hidden3 = document.getElementById('hidden3');
    const hidden4 = document.getElementById('hidden4');
    const hidden5 = document.getElementById('hidden5');
    const hidden6 = document.getElementById('hidden6');
    const hidden7 = document.getElementById('hidden7');
    const hidden8 = document.getElementById('hidden8');
    
    // Create radio buttons
    const radioBtn1 = document.createElement('input');
    radioBtn1.type = 'checkbox';
    radioBtn1.id = 'customRadio1';
    radioBtn1.className = 'customRadio';
    radioBtn1.checked = false;
    
    const radioBtn2 = document.createElement('input');
    radioBtn2.type = 'checkbox';
    radioBtn2.id = 'customRadio2';
    radioBtn2.className = 'customRadio';
    radioBtn2.checked = false;

    const radioBtn3 = document.createElement('input');
    radioBtn3.type = 'checkbox';
    radioBtn3.id = 'customRadio3';
    radioBtn3.className = 'customRadio';
    radioBtn3.checked = false;

    const radioBtn4 = document.createElement('input');
    radioBtn4.type = 'checkbox';
    radioBtn4.id = 'customRadio4';
    radioBtn4.className = 'customRadio';
    radioBtn4.checked = false;

    const radioBtn5 = document.createElement('input');
    radioBtn5.type = 'checkbox';
    radioBtn5.id = 'customRadio5';
    radioBtn5.className = 'customRadio';
    radioBtn5.checked = false;

    const radioBtn6 = document.createElement('input');
    radioBtn6.type = 'checkbox';
    radioBtn6.id = 'customRadio6';
    radioBtn6.className = 'customRadio';
    radioBtn6.checked = false;

    const radioBtn7 = document.createElement('input');
    radioBtn7.type = 'checkbox';
    radioBtn7.id = 'customRadio7';
    radioBtn7.className = 'customRadio';
    radioBtn7.checked = false;

    const radioBtn8 = document.createElement('input');
    radioBtn8.type = 'checkbox';
    radioBtn8.id = 'customRadio8';
    radioBtn8.className = 'customRadio';
    radioBtn8.checked = false;
    
    // Add the radio buttons to their containers
    if (container1) container1.appendChild(radioBtn1);
    if (container2) container2.appendChild(radioBtn2);
    if (container3) container3.appendChild(radioBtn3);
    if (container4) container4.appendChild(radioBtn4);
    if (container5) container5.appendChild(radioBtn5);
    if (container6) container6.appendChild(radioBtn6);
    if (container7) container7.appendChild(radioBtn7);
    if (container8) container8.appendChild(radioBtn8);
    
    // Function to hide all divs
    function hideAllDivs() {
        if (hidden1) hidden1.style.display = 'none';
        if (hidden2) hidden2.style.display = 'none';
        if (hidden3) hidden3.style.display = 'none';
        if (hidden4) hidden4.style.display = 'none';
        if (hidden5) hidden5.style.display = 'none';
        if (hidden6) hidden6.style.display = 'none';
        if (hidden7) hidden7.style.display = 'none';
        if (hidden8) hidden8.style.display = 'none';
    }

    // Function to uncheck all other buttons
    function uncheckOthers(exceptThis) {
        if(exceptThis !== radioBtn1) radioBtn1.checked = false;
        if(exceptThis !== radioBtn2) radioBtn2.checked = false;
        if(exceptThis !== radioBtn3) radioBtn3.checked = false;
        if(exceptThis !== radioBtn4) radioBtn4.checked = false;
        if(exceptThis !== radioBtn5) radioBtn5.checked = false;
        if(exceptThis !== radioBtn6) radioBtn6.checked = false;
        if(exceptThis !== radioBtn7) radioBtn7.checked = false;
        if(exceptThis !== radioBtn8) radioBtn8.checked = false;
    }
    
    // Add event listeners for all buttons
    radioBtn1.addEventListener('change', function() {
        if(this.checked) {
            uncheckOthers(this);
            hideAllDivs();
            if (hidden1) hidden1.style.display = 'block';
        } else {
            hideAllDivs();
        }
    });
    
    radioBtn2.addEventListener('change', function() {
        if(this.checked) {
            uncheckOthers(this);
            hideAllDivs();
            if (hidden2) hidden2.style.display = 'block';
        } else {
            hideAllDivs();
        }
    });

    radioBtn3.addEventListener('change', function() {
        if(this.checked) {
            uncheckOthers(this);
            hideAllDivs();
            if (hidden3) hidden3.style.display = 'block';
        } else {
            hideAllDivs();
        }
    });

    radioBtn4.addEventListener('change', function() {
        if(this.checked) {
            uncheckOthers(this);
            hideAllDivs();
            if (hidden4) hidden4.style.display = 'block';
        } else {
            hideAllDivs();
        }
    });

    radioBtn5.addEventListener('change', function() {
        if(this.checked) {
            uncheckOthers(this);
            hideAllDivs();
            if (hidden5) hidden5.style.display = 'block';
        } else {
            hideAllDivs();
        }
    });

    radioBtn6.addEventListener('change', function() {
        if(this.checked) {
            uncheckOthers(this);
            hideAllDivs();
            if (hidden6) hidden6.style.display = 'block';
        } else {
            hideAllDivs();
        }
    });

    radioBtn7.addEventListener('change', function() {
        if(this.checked) {
            uncheckOthers(this);
            hideAllDivs();
            if (hidden7) hidden7.style.display = 'block';
        } else {
            hideAllDivs();
        }
    });

    radioBtn8.addEventListener('change', function() {
        if(this.checked) {
            uncheckOthers(this);
            hideAllDivs();
            if (hidden8) hidden8.style.display = 'block';
        } else {
            hideAllDivs();
        }
    });
});
