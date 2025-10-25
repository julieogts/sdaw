// Simple Form Validation System
// Basic validation for forms

class FormValidator {
    constructor() {
        this.rules = {
            // Text - Letters and spaces only
            text: {
                pattern: /^[a-zA-Z\s]+$/,
                errorMessages: {
                    pattern: 'This field can only contain letters and spaces'   
                }
            },

            // Phone - Philippine format (09xxxxxxxxx or +639xxxxxxxxx)
            phone: {
                pattern: /^(09\d{9}|\+639\d{9})$/,
                errorMessages: {
                    pattern: 'Please enter a valid Philippine phone number (09xxxxxxxxx or +639xxxxxxxxx)'
                }
            },

            // Email
            email: {
                minLength: 5,
                maxLength: 100,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                errorMessages: {
                    minLength: 'Email must be at least 5 characters',
                    maxLength: 'Email must be less than 100 characters',
                    pattern: 'Please enter a valid email address'
                }
            },

            // Password
            password: {
                minLength: 6,
                maxLength: 128,
                pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
                errorMessages: {
                    minLength: 'Password must be at least 6 characters',
                    maxLength: 'Password must be less than 128 characters',
                    pattern: 'Password must contain at least one letter and one number'
                }
            }
        };
    }

    // Validate a single field
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.getAttribute('data-validation') || field.type;
        const rule = this.rules[fieldType];

        if (!rule) {
            return { valid: true };
        }

        // Check required
        if (field.hasAttribute('required') && !value) {
            return { valid: false, message: 'This field is required' };
        }

        // Check min length
        if (rule.minLength && value.length < rule.minLength) {
            return { valid: false, message: rule.errorMessages.minLength };
        }

        // Check max length
        if (rule.maxLength && value.length > rule.maxLength) {
            return { valid: false, message: rule.errorMessages.maxLength };
        }

        // Check pattern
        if (rule.pattern && value && !rule.pattern.test(value)) {
            return { valid: false, message: rule.errorMessages.pattern };
        }

        return { valid: true };
    }

    // Validate entire form
    validateForm(form) {
        const fields = form.querySelectorAll('input[data-validation], input[type="email"], input[type="password"], input[type="tel"], input[type="text"]');
        let isValid = true;
        const errors = [];

        fields.forEach(field => {
            const result = this.validateField(field);
            if (!result.valid) {
                isValid = false;
                errors.push({ field: field.name || field.id, message: result.message });
            }
        });

        return { valid: isValid, errors };
    }

    // Show validation error
    showError(field, message) {
        this.clearError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#dc3545';
    }

    // Clear validation error
    clearError(field) {
        const existingError = field.parentNode.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    // Setup real-time validation
    setupRealTimeValidation(form) {
        const fields = form.querySelectorAll('input[data-validation], input[type="email"], input[type="password"], input[type="tel"], input[type="text"]');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                const result = this.validateField(field);
                if (!result.valid) {
                    this.showError(field, result.message);
        } else {
                    this.clearError(field);
                }
            });

            field.addEventListener('input', () => {
                this.clearError(field);
            });
        });
    }
}

// Initialize validation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const validator = new FormValidator();
    
    // Setup validation for all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        validator.setupRealTimeValidation(form);
        
        form.addEventListener('submit', (e) => {
            const result = validator.validateForm(form);
            if (!result.valid) {
                e.preventDefault();
                result.errors.forEach(error => {
                    const field = form.querySelector(`[name="${error.field}"]`) || form.querySelector(`#${error.field}`);
                    if (field) {
                        validator.showError(field, error.message);
                    }
                });
            }
        });
    });
});