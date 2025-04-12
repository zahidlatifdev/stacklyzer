const Mailjet = require('node-mailjet');

/**
 * Email service to handle sending emails via Mailjet
 */
class EmailService {
    constructor() {
        this.mailjet = Mailjet.apiConnect(
            process.env.MAILJET_API_KEY,
            process.env.MAILJET_SECRET_KEY
        );
    }

    /**
     * Send a contact form email
     * @param {Object} data - Contact form data
     * @param {string} data.name - Sender's name
     * @param {string} data.email - Sender's email
     * @param {string} data.message - Email message
     * @returns {Promise} - Mailjet API response
     */
    async sendContactEmail(data) {
        const { name, email, message } = data;

        if (!name || !email || !message) {
            throw new Error('Missing required fields: name, email, and message are required');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        try {
            const response = await this.mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: {
                            Email: process.env.CONTACT_FROM_EMAIL,
                            Name: 'Stacklyzer Contact Form'
                        },
                        To: [
                            {
                                Email: process.env.CONTACT_TO_EMAIL,
                                Name: 'Zahid Latif'
                            }
                        ],
                        ReplyTo: {
                            Email: email,
                            Name: name
                        },
                        Subject: `Stacklyzer Contact Form Submission`,
                        TextPart: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                        HTMLPart: `
              <h3>New contact form submission</h3>
              <p><strong>From:</strong> ${name} (${email})</p>
              <p><strong>Subject:</strong> Contact Form Message</p>
              <div style="padding: 20px; background-color: #f5f5f5; border-radius: 5px; margin-top: 20px;">
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
            `
                    }
                ]
            });

            return response.body;
        } catch (error) {
            console.error('Error sending email:', error.message);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}

module.exports = new EmailService();