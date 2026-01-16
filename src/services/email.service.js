const nodemailer = require('nodemailer');
const config = require('../config/environment');
const logger = require('../utils/logger');

// Create transporter
const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false,
    auth: {
        user: config.email.user,
        pass: config.email.password
    }
});

/**
 * Send email
 */
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: config.email.from,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error('Email sending error:', error);
        throw error;
    }
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (user) => {
    const subject = 'Welcome to Our E-Commerce Platform!';
    const html = `
    <h1>Welcome ${user.name}!</h1>
    <p>Thank you for registering with us.</p>
    <p>We're excited to have you on board.</p>
    <p>Start shopping now and enjoy exclusive deals!</p>
  `;

    return sendEmail(user.email, subject, html);
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, resetToken) => {
    const resetUrl = `${config.frontend.url}/reset-password?token=${resetToken}`;

    const subject = 'Password Reset Request';
    const html = `
    <h1>Password Reset</h1>
    <p>Hi ${user.name},</p>
    <p>You requested to reset your password.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

    return sendEmail(user.email, subject, html);
};

/**
 * Send order confirmation email
 */
const sendOrderConfirmationEmail = async (user, order) => {
    const subject = `Order Confirmation - ${order.orderNumber}`;

    const itemsList = order.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `).join('');

    const html = `
    <h1>Order Confirmation</h1>
    <p>Hi ${user.name},</p>
    <p>Thank you for your order!</p>
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    
    <h2>Order Details</h2>
    <table border="1" cellpadding="10">
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsList}
      </tbody>
    </table>
    
    <h3>Order Summary</h3>
    <p>Subtotal: $${order.subtotal.toFixed(2)}</p>
    <p>Tax: $${order.tax.toFixed(2)}</p>
    <p>Shipping: $${order.shippingCost.toFixed(2)}</p>
    <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
    
    <h3>Shipping Address</h3>
    <p>
      ${order.shippingAddress.street}<br>
      ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
      ${order.shippingAddress.country} ${order.shippingAddress.zipCode}
    </p>
    
    <p>We'll send you another email when your order ships.</p>
  `;

    return sendEmail(user.email, subject, html);
};

/**
 * Send order shipped email
 */
const sendOrderShippedEmail = async (user, order) => {
    const subject = `Your Order Has Shipped - ${order.orderNumber}`;
    const html = `
    <h1>Order Shipped</h1>
    <p>Hi ${user.name},</p>
    <p>Great news! Your order has been shipped.</p>
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
    ${order.shippingCarrier ? `<p><strong>Carrier:</strong> ${order.shippingCarrier}</p>` : ''}
    <p>Your order should arrive soon!</p>
  `;

    return sendEmail(user.email, subject, html);
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendOrderConfirmationEmail,
    sendOrderShippedEmail
};
