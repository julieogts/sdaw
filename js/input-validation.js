// Simple Input Validation
// Basic input validation for forms

// Simple email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simple phone validation (Philippine format)
function validatePhone(phone) {
    const phoneRegex = /^(09\d{9}|\+639\d{9})$/;
    return phoneRegex.test(phone);
}

// Simple password validation
function validatePassword(password) {
    return password && password.length >= 6;
}

// Simple text validation
function validateText(text) {
    return text && text.trim().length > 0;
}

// Setup basic form validation
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let isValid = true;
            
            // Validate email fields
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value && !validateEmail(field.value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    isValid = false;
                } else {
                    clearFieldError(field);
                }
            });
            
            // Validate phone fields
            const phoneFields = form.querySelectorAll('input[type="tel"]');
            phoneFields.forEach(field => {
                if (field.value && !validatePhone(field.value)) {
                    showFieldError(field, 'Please enter a valid phone number');
                    isValid = false;
                } else {
                    clearFieldError(field);
                }
            });
            
            // Validate password fields
            const passwordFields = form.querySelectorAll('input[type="password"]');
            passwordFields.forEach(field => {
                if (field.value && !validatePassword(field.value)) {
                    showFieldError(field, 'Password must be at least 6 characters');
                    isValid = false;
                } else {
                    clearFieldError(field);
                }
            });
            
            // Validate required text fields
            const textFields = form.querySelectorAll('input[type="text"][required]');
            textFields.forEach(field => {
                if (!validateText(field.value)) {
                    showFieldError(field, 'This field is required');
                    isValid = false;
                } else {
                    clearFieldError(field);
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
            });
        });

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
        errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#dc3545';
}

// Clear field error
function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}