/**
 * Script Purpose:
 * This script captures user input data from multiple predefined rows, organizes it into a structured format, 
 * and redirects the user to a target page with the serialized data included in the URL as a query parameter. 
 * The target URL includes an anchor to direct the user to a specific section of the page.
 * It also shows a popup message if the user attempts to proceed without calculating values first.

 * Context:
 * - The script handles up to six rows of user inputs, where each row contains fields for:
 *   - Item name
 *   - Purity
 *   - Weight
 *   - Calculated value
 * - Only rows with valid data (non-empty and non-default) are included in the final grouped dataset.
 * - A "Grand Total" is also appended to the grouped dataset, fetched from a dedicated total field.

 * Constraints:
 * - Each input field must have a unique ID:
 *   - Item fields: item1, item2, ..., item6
 *   - Purity fields: purity1, purity2, ..., purity6
 *   - Weight fields: weight1, weight2, ..., weight6
 *   - Value fields: value1, value2, ..., value6
 *   - Grand Total field: total
 * - A button with the class `offer-button1` must be present to trigger the redirection.
 * - The target URL for redirection is hardcoded and includes an anchor (`#get-an-offer-wrapper`).

 * Required IDs and Classes:
 * - Row-specific field IDs:
 *   - Item fields: item1, item2, item3, item4, item5, item6
 *   - Purity fields: purity1, purity2, purity3, purity4, purity5, purity6
 *   - Weight fields: weight1, weight2, weight3, weight4, weight5, weight6
 *   - Value fields: value1, value2, value3, value4, value5, value6
 * - Total field ID: total
 * - Button class: offer-button1
 * - Wrapper div ID: get-offer-wrapper
 */

<script>
    document.addEventListener('DOMContentLoaded', function () {
        function captureData() {
            const dataPoints = [
                { item: 'item1', purity: 'purity1', weight: 'weight1', value: 'value1' },
                { item: 'item2', purity: 'purity2', weight: 'weight2', value: 'value2' },
                { item: 'item3', purity: 'purity3', weight: 'weight3', value: 'value3' },
                { item: 'item4', purity: 'purity4', weight: 'weight4', value: 'value4' },
                { item: 'item5', purity: 'purity5', weight: 'weight5', value: 'value5' },
                { item: 'item6', purity: 'purity6', weight: 'weight6', value: 'value6' },
            ];

            let groupedData = [];

            dataPoints.forEach(point => {
                const itemField = document.getElementById(point.item);
                const purityField = document.getElementById(point.purity);
                const weightField = document.getElementById(point.weight);
                const valueField = document.getElementById(point.value);

                if (itemField && purityField && weightField && valueField) {
                    const item = itemField.value.trim();
                    const purity = purityField.value.trim();
                    const weight = weightField.value.trim();
                    const value = valueField.textContent.trim();

                    if (purity !== '' && purity !== 'Select' && value !== '' && value !== '0') {
                        groupedData.push({
                            item: point.item,
                            purity: point.purity,
                            weight: point.weight,
                            value: point.value,
                            data: {
                                item: item || 'N/A',
                                purity: purity,
                                weight: (weight || '0') + 'g',
                                value: value || '0',
                            },
                        });
                    }
                }
            });

            const totalField = document.getElementById('total');
            if (totalField) {
                const totalValue = totalField.textContent.trim();
                groupedData.push({ total: 'total', data: { total: totalValue || '0' } });
            }

            console.log('Grouped Data:', groupedData);
            return groupedData;
        }

        // Function to show popup message
        function showPopupMessage(message) {
            // Remove any existing popup
            const existingPopup = document.getElementById('calculate-popup');
            if (existingPopup) {
                existingPopup.remove();
            }
            
            // Get the wrapper div
            const wrapperDiv = document.getElementById('get-offer-wrapper');
            if (!wrapperDiv) {
                console.error('Could not find wrapper div with ID get-offer-wrapper');
                return;
            }
            
            // Create popup element
            const popup = document.createElement('div');
            popup.id = 'calculate-popup';
            popup.textContent = message;
            popup.style.cssText = `
                color: #ff0000;
                background-color: #ffeeee;
                border: 1px solid #ff0000;
                padding: 10px 15px;
                border-radius: 4px;
                font-size: 14px;
                margin-top: 10px;
                text-align: center;
                width: 100%;
                box-sizing: border-box;
                display: block;
            `;
            
            // Append the popup to the wrapper div (it will appear at the bottom)
            wrapperDiv.appendChild(popup);
            
            // Auto-remove popup after 5 seconds
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 5000);
        }

        // Attach event listener to the offer button
        const offerButton = document.querySelector('.offer-button1');
        if (offerButton) {
            offerButton.addEventListener('click', function (event) {
                event.preventDefault();
                
                // Check if value1 is blank
                const value1Element = document.getElementById('value1');
                if (!value1Element || value1Element.textContent.trim() === '' || value1Element.textContent.trim() === '0') {
                    showPopupMessage("Please calculate first");
                    return;
                }
                
                // If value1 is not blank, proceed with normal flow
                const data = captureData();
                const serializedData = encodeURIComponent(JSON.stringify(data));
                const targetUrl = `${window.location.origin}/sell-gold-jewellery-offer?estCalcData=${serializedData}#get-an-offer-wrapper`;

                window.location.href = targetUrl;
            });
        }
    });
</script>