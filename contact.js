document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('formMessages');
    const submitBtn = document.getElementById('submitBtn');

    if (!contactForm) return;

    // API URL can be set on the form via data-action attribute, otherwise use relative /api/contact
    const apiUrl = contactForm.dataset.action || contactForm.getAttribute('action') || '/api/contact';

    function showFormMessage(message, type = 'success') {
        if (!formMessages) return;
        formMessages.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
        formMessages.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function setSpinner(show) {
        if (!submitBtn) return;
        const spinner = submitBtn.querySelector('.spinner-border');
        const submitText = submitBtn.querySelector('.submit-text');
        if (spinner) spinner.classList.toggle('d-none', !show);
        if (submitText) submitText.classList.toggle('d-none', show);
    }

    function validate() {
        let valid = true;
        const nameEl = document.getElementById('name');
        const emailEl = document.getElementById('email');
        const subjectEl = document.getElementById('subject');
        const messageEl = document.getElementById('message');

        // Clear previous invalid states
        [nameEl, emailEl, subjectEl, messageEl].forEach(el => {
            if (!el) return;
            el.classList.remove('is-invalid');
        });

        if (!nameEl || !nameEl.value.trim()) {
            valid = false;
            nameEl && nameEl.classList.add('is-invalid');
        }

        const emailVal = emailEl?.value.trim() || '';
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailEl || !emailRe.test(emailVal)) {
            valid = false;
            emailEl && emailEl.classList.add('is-invalid');
        }

        if (!subjectEl || !subjectEl.value.trim()) {
            valid = false;
            subjectEl && subjectEl.classList.add('is-invalid');
        }

        if (!messageEl || !messageEl.value.trim()) {
            valid = false;
            messageEl && messageEl.classList.add('is-invalid');
        }

        return valid;
    }

    // Remove invalid class on input
    ['name', 'email', 'subject', 'message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => el.classList.remove('is-invalid'));
    });

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!validate()) {
            showFormMessage('Please fix the form errors highlighted below.', 'danger');
            return;
        }

        const name = document.getElementById('name')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const subject = document.getElementById('subject')?.value || 'Contact Form';
        const message = document.getElementById('message')?.value.trim() || '';

        const formData = { name, email, subject, message };

        // Disable submit button and show spinner while sending
        if (submitBtn) {
            submitBtn.setAttribute('disabled', 'disabled');
            setSpinner(true);
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                let result = {};
                try { result = await response.json(); } catch (e) { /* ignore JSON parse error */ }

                if (result.success !== false) {
                    showFormMessage("Message sent successfully! I'll get back to you soon.", 'success');
                    contactForm.reset();
                } else {
                    showFormMessage(result.message || 'There was an error sending your message. Opening mail client as fallback.', 'warning');
                    openMailClientFallback(formData);
                }
            } else {
                showFormMessage('Server error. Opening mail client as fallback.', 'warning');
                openMailClientFallback(formData);
            }
        } catch (err) {
            console.error('Contact form error:', err);
            showFormMessage('Network error. Opening mail client as fallback.', 'warning');
            openMailClientFallback(formData);
        } finally {
            if (submitBtn) {
                submitBtn.removeAttribute('disabled');
                setSpinner(false);
            }
        }
    });

    function openMailClientFallback({ name, email, subject, message }) {
        const to = 'omugaprod@gmail.com';
        const mailSubject = encodeURIComponent(subject || 'Contact Form');
        const bodyLines = [
            `Name: ${name}`,
            `Email: ${email}`,
            '',
            message
        ];
        const mailBody = encodeURIComponent(bodyLines.join('\n'));

        // Build mailto link
        const mailto = `mailto:${to}?subject=${mailSubject}&body=${mailBody}`;

        // Open user's mail client
        window.location.href = mailto;
    }
});
