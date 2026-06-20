document.addEventListener('DOMContentLoaded', function() {
  // Create and inject CSS
  const style = document.createElement('style');
  style.textContent = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .modal-content {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow: hidden;
      transform: translateY(20px) scale(0.98);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
      position: relative;
    }

    .modal-overlay.active .modal-content {
      transform: translateY(0) scale(1);
    }

    .modal-header {
      padding: 24px 28px 0 28px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .modal-icon {
      width: 44px;
      height: 44px;
      background: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0f172a;
      margin-bottom: 20px;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #94a3b8;
      cursor: pointer;
      padding: 4px;
      line-height: 1;
      transition: color 0.2s ease;
    }

    .modal-close:hover {
      color: #0f172a;
    }

    .modal-body {
      padding: 0 28px 28px 28px;
    }

    .modal-body h2 {
      font-size: 20px;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 12px 0;
      line-height: 1.4;
      letter-spacing: -0.01em;
    }

    .modal-body p {
      font-size: 15px;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 10px 18px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease;
      flex: 1;
      min-width: 120px;
      text-align: center;
    }

    .btn-primary {
      background: #0f172a;
      color: white;
    }

    .btn-primary:hover {
      background: #1e293b;
    }

    .btn-secondary {
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #cbd5e1;
    }

    .btn-secondary:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }

    @media (max-width: 640px) {
      .modal-content {
        margin: 20px;
        width: calc(100% - 40px);
      }
      
      .modal-actions {
        flex-direction: column;
      }
      
      .btn-primary, .btn-secondary {
        flex: none;
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);

  // Create and inject HTML
  const modalHTML = `
    <div id="market-closed-modal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
            </svg>
          </div>
          <button class="modal-close" id="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <h2>Online Checkout Closed</h2>
          <p>Available Monday to Friday, 7:00am–11:00pm, with a 10:00am start on Mondays. Saturday checkout is available from 7:00am–10:00am. Closed on NZ public holidays.<br><br>All pricing is based on live-market data referencing exchanges in New York and London.<br><br>For after-hours trading, product availability, or private viewing options, please contact us directly for assistance.</p>
          <div class="modal-actions">
            <button class="btn-primary" id="contact-us-btn">Contact Us</button>
            <button class="btn-primary" id="live-pricing-btn">Live Pricing</button>
            <button class="btn-secondary" id="close-btn">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // JavaScript functionality
  const marketClosedButton = document.getElementById('button-closed');
  const modal = document.getElementById('market-closed-modal');
  const closeModal = document.getElementById('modal-close');
  const closeBtn = document.getElementById('close-btn');
  const contactUsBtn = document.getElementById('contact-us-btn');
  const livePricingBtn = document.getElementById('live-pricing-btn');

  // Show modal when market closed button is clicked
  if (marketClosedButton) {
    marketClosedButton.addEventListener('click', function(e) {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Close modal function
  function closeModalFunction() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close modal when X button is clicked
  closeModal.addEventListener('click', closeModalFunction);

  // Close modal when clicking outside of it
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModalFunction();
    }
  });

  // Close modal when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModalFunction();
    }
  });

  // Close button functionality
  closeBtn.addEventListener('click', function() {
    closeModalFunction();
  });

  // Contact Us button functionality
  contactUsBtn.addEventListener('click', function() {
    window.location.href = '/contact-us';
  });

  // Live Pricing button functionality
  if (livePricingBtn) {
    livePricingBtn.addEventListener('click', function() {
      window.location.href = '/live-price/gold-price-nz';
    });
  }
});
