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
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      max-width: 480px;
      width: 90%;
      max-height: 90vh;
      overflow: hidden;
      transform: translateY(30px) scale(0.95);
      transition: all 0.3s ease;
      position: relative;
    }

    .modal-overlay.active .modal-content {
      transform: translateY(0) scale(1);
    }

    .modal-header {
      padding: 24px 24px 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .modal-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-bottom: 16px;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #6b7280;
      cursor: pointer;
      padding: 4px;
      line-height: 1;
      transition: color 0.2s ease;
    }

    .modal-close:hover {
      color: #374151;
    }

    .modal-body {
      padding: 0 24px 24px 24px;
    }

    .modal-body h2 {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 12px 0;
      line-height: 1.3;
    }

    .modal-body p {
      font-size: 16px;
      color: #6b7280;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      flex: 1;
      min-width: 120px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #e5e7eb;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
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
          <h2>Market Currently Closed</h2>
          <p>The market is closed. You can wait until trading recommences or speak to a broker during business hours for more options.</p>
          <div class="modal-actions">
            <button class="btn-secondary" id="wait-btn">Wait for Market Open</button>
            <button class="btn-primary" id="contact-broker">Bullion Broker</button>
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
  const waitBtn = document.getElementById('wait-btn');
  const contactBrokerBtn = document.getElementById('contact-broker');

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

  // Wait button functionality
  waitBtn.addEventListener('click', function() {
    closeModalFunction();
    // Add your logic here for what happens when user chooses to wait
    console.log('User chose to wait for market open');
  });

  // Bullion Broker button functionality - redirects to /broker
  contactBrokerBtn.addEventListener('click', function() {
    window.location.href = '/contact-us';
  });
});
