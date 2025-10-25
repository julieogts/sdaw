// Enhanced Input Validation System
// Automatically applies validation to form fields based on their type and attributes

class InputValidator {
    constructor() {
        this.validators = new Map();
        this.setupValidators();
        this.initializeValidation();
    }

    // Setup validation rules for different field types
    setupValidators() {
        this.validators.set('email', {
            validate: (value) => SecurityValidator.validateEmail(value),
            sanitize: (value) => value.toLowerCase().trim()
        });

        this.validators.set('password', {
            validate: (value) => SecurityValidator.validatePassword(value),
            sanitize: (value) => value.trim()
        });

        this.validators.set('tel', {
            validate: (value) => SecurityValidator.validatePhoneNumber(value),
            sanitize: (value) => value.replace(/\D/g, '')
        });

        this.validators.set('number', {
            validate: (value, min, max) => SecurityValidator.validateNumber(value, min, max),
            sanitize: (value) => Number(value)
        });

        this.validators.set('text', {
            validate: (value, fieldName) => this.validateTextField(value, fieldName),
            sanitize: (value) => SecurityValidator.sanitizeString(value)
        });

        this.validators.set('search', {
            validate: (value) => SecurityValidator.validateSearchQuery(value),
            sanitize: (value) => SecurityValidator.sanitizeString(value, 100)
        });
    }

    // Initialize validation for all forms on the page
    initializeValidation() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupFormValidation();
            this.setupRealTimeValidation();
        });
    }

    // Setup form validation
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.validateForm(e));
        });
    }

    // Setup real-time validation
    setupRealTimeValidation() {
        // Email fields
        document.querySelectorAll('input[type="email"]').forEach(input => {
            this.setupFieldValidation(input, 'email');
        });

        // Password fields
        document.querySelectorAll('input[type="password"]').forEach(input => {
            this.setupFieldValidation(input, 'password');
        });

        // Phone number fields
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            this.setupFieldValidation(input, 'tel');
        });

        // Number fields
        document.querySelectorAll('input[type="number"]').forEach(input => {
            const min = parseFloat(input.getAttribute('min')) || 0;
            const max = parseFloat(input.getAttribute('max')) || Number.MAX_SAFE_INTEGER;
            this.setupFieldValidation(input, 'number', { min, max });
        });

        // Text fields with specific validation
        document.querySelectorAll('input[type="text"]').forEach(input => {
            const fieldName = this.getFieldName(input);
            this.setupFieldValidation(input, 'text', { fieldName });
        });

        // Search fields
        document.querySelectorAll('input[placeholder*="Search"]').forEach(input => {
            this.setupFieldValidation(input, 'search');
        });

        // Special field validations
        this.setupSpecialFieldValidations();
    }

    // Setup validation for a specific field
    setupFieldValidation(input, type, options = {}) {
        // Real-time validation on input
        input.addEventListener('input', (e) => {
            this.validateField(e.target, type, options);
        });

        // Validation on blur
        input.addEventListener('blur', (e) => {
            this.validateField(e.target, type, options);
        });

        // Prevent invalid characters on keypress
        input.addEventListener('keypress', (e) => {
            this.preventInvalidCharacters(e, type);
        });
    }

    // Setup special field validations
    setupSpecialFieldValidations() {
        // Postal code fields
        document.querySelectorAll('input[id*="postalCode"], input[id*="postal"]').forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
                this.validateField(e.target, 'postalCode');
            });
        });

        // Bank account fields
        document.querySelectorAll('input[id*="bank-account"], input[id*="account"]').forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
                this.validateField(e.target, 'bankAccount');
            });
        });

        // GCash number fields
        document.querySelectorAll('input[id*="gcash"]').forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
                this.validateField(e.target, 'gcash');
            });
        });

        // Price/amount fields
        document.querySelectorAll('input[id*="price"], input[id*="amount"], input[id*="payment-amount"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateField(e.target, 'price');
            });
        });

        // Customer name fields
        document.querySelectorAll('input[id*="customerName"], input[id*="walkInCustomerName"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateField(e.target, 'customerName');
            });
        });

        // Product name fields
        document.querySelectorAll('input[id*="productName"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateField(e.target, 'productName');
            });
        });
    }

    // Validate a single field
    validateField(input, type, options = {}) {
        const value = input.value;
        let result;

        switch (type) {
            case 'email':
                result = SecurityValidator.validateEmail(value);
                break;
            case 'password':
                result = SecurityValidator.validatePassword(value);
                break;
            case 'tel':
                result = SecurityValidator.validatePhoneNumber(value);
                break;
            case 'number':
                result = SecurityValidator.validateNumber(value, options.min, options.max);
                break;
            case 'text':
                result = this.validateTextField(value, options.fieldName);
                break;
            case 'search':
                result = SecurityValidator.validateSearchQuery(value);
                break;
            case 'postalCode':
                result = SecurityValidator.validatePostalCode(value);
                break;
            case 'bankAccount':
                result = SecurityValidator.validateBankAccount(value);
                break;
            case 'gcash':
                result = SecurityValidator.validateGCashNumber(value);
                break;
            case 'price':
                result = SecurityValidator.validatePrice(value);
                break;
            case 'customerName':
                result = SecurityValidator.validateCustomerName(value);
                break;
            case 'productName':
                result = SecurityValidator.validateProductName(value);
                break;
            default:
                result = { valid: true, sanitized: value };
        }

        this.displayFieldValidation(input, result);
        return result.valid;
    }

    // Validate text field based on field name
    validateTextField(value, fieldName) {
        if (!fieldName) {
            return SecurityValidator.validateSearchQuery(value);
        }

        const lowerFieldName = fieldName.toLowerCase();

        if (lowerFieldName.includes('name') && !lowerFieldName.includes('product')) {
            return SecurityValidator.validateFullName(value);
        } else if (lowerFieldName.includes('product')) {
            return SecurityValidator.validateProductName(value);
        } else if (lowerFieldName.includes('customer')) {
            return SecurityValidator.validateCustomerName(value);
        } else {
            return SecurityValidator.validateSearchQuery(value);
        }
    }

    // Display validation result for a field
    displayFieldValidation(input, result) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        // Remove existing validation messages
        const existingError = formGroup.querySelector('.field-error');
        const existingSuccess = formGroup.querySelector('.field-success');
        
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();

        // Remove existing classes
        input.classList.remove('field-error', 'field-success');

        if (!result.valid) {
            // Show error
            input.classList.add('field-error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = result.message;
            formGroup.appendChild(errorDiv);
        } else if (input.value.trim() !== '') {
            // Show success for non-empty valid fields
            input.classList.add('field-success');
        }
    }

    // Prevent invalid characters based on field type
    preventInvalidCharacters(e, type) {
        const char = String.fromCharCode(e.which);
        
        switch (type) {
            case 'number':
                if (!/[0-9.]/.test(char)) {
                    e.preventDefault();
                }
                break;
            case 'tel':
                if (!/[0-9+]/.test(char)) {
                    e.preventDefault();
                }
                break;
            case 'postalCode':
                if (!/[0-9]/.test(char)) {
                    e.preventDefault();
                }
                break;
            case 'bankAccount':
            case 'gcash':
                if (!/[0-9]/.test(char)) {
                    e.preventDefault();
                }
                break;
        }
    }

    // Validate entire form
    validateForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (input.type === 'submit' || input.type === 'button') return;
            
            const fieldName = this.getFieldName(input);
            const type = this.getFieldType(input);
            const options = this.getFieldOptions(input);
            
            const fieldValid = this.validateField(input, type, options);
            if (!fieldValid) {
                isValid = false;
            }
        });

        if (isValid) {
            // Form is valid, allow submission
            form.submit();
        } else {
            // Show general error message
            this.showFormError('Please correct the errors above before submitting.');
        }
    }

    // Get field name for validation
    getFieldName(input) {
        return input.id || input.name || input.placeholder || '';
    }

    // Get field type for validation
    getFieldType(input) {
        if (input.type === 'email') return 'email';
        if (input.type === 'password') return 'password';
        if (input.type === 'tel') return 'tel';
        if (input.type === 'number') return 'number';
        if (input.placeholder && input.placeholder.toLowerCase().includes('search')) return 'search';
        return 'text';
    }

    // Get field options for validation
    getFieldOptions(input) {
        const options = {};
        
        if (input.type === 'number') {
            options.min = parseFloat(input.getAttribute('min')) || 0;
            options.max = parseFloat(input.getAttribute('max')) || Number.MAX_SAFE_INTEGER;
        }
        
        options.fieldName = this.getFieldName(input);
        return options;
    }

    // Show form error message
    showFormError(message) {
        // Remove existing error messages
        const existingError = document.querySelector('.form-error');
        if (existingError) existingError.remove();

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 0.75rem;
            border: 1px solid #f5c6cb;
            border-radius: 0.375rem;
            margin-bottom: 1rem;
        `;
        errorDiv.textContent = message;

        // Insert at top of form
        const form = document.querySelector('form');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
        }
    }
}

// Initialize validation system
const inputValidator = new InputValidator();

// Add CSS for validation states
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .field-error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
    
    .field-success {
        border-color: #28a745 !important;
        box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
    }
    
    .field-error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .field-success-message {
        color: #28a745;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .form-error {
        background: #f8d7da;
        color: #721c24;
        padding: 0.75rem;
        border: 1px solid #f5c6cb;
        border-radius: 0.375rem;
        margin-bottom: 1rem;
    }
`;
document.head.appendChild(validationStyles);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputValidator;
} else {
    window.InputValidator = InputValidator;
}
