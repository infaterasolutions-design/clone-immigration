<?php
/**
 * Template Name: Contact Us
 *
 * This template displays a custom contact form without needing plugins.
 */

$form_message = '';
$form_status = '';

if ( $_SERVER['REQUEST_METHOD'] === 'POST' && isset( $_POST['immi24_contact_submit'] ) ) {
    
    // Verify Nonce
    if ( ! isset( $_POST['immi24_contact_nonce'] ) || ! wp_verify_nonce( $_POST['immi24_contact_nonce'], 'immi24_submit_contact' ) ) {
        $form_message = 'Security check failed. Please try again.';
        $form_status = 'error';
    } else {
        // Honeypot check (hidden field to trap bots)
        if ( ! empty( $_POST['website_url'] ) ) {
            $form_message = 'Submission blocked due to spam detection.';
            $form_status = 'error';
        } else {
            // Sanitize inputs
            $name    = sanitize_text_field( $_POST['full_name'] ?? '' );
            $email   = sanitize_email( $_POST['email_address'] ?? '' );
            $subject = sanitize_text_field( $_POST['subject'] ?? 'New Message from Website' );
            $message = sanitize_textarea_field( $_POST['message'] ?? '' );

            if ( empty( $name ) || empty( $email ) || empty( $message ) ) {
                $form_message = 'Please fill out all required fields (Name, Email, and Message).';
                $form_status = 'error';
            } elseif ( ! is_email( $email ) ) {
                $form_message = 'Please provide a valid email address.';
                $form_status = 'error';
            } else {
                // Send email
                $to = get_option( 'admin_email' );
                $email_subject = 'New Contact Form Submission: ' . $subject;
                $body = "You have received a new message from the contact form on your website.\n\n" .
                        "Name: $name\n" .
                        "Email: $email\n\n" .
                        "Message:\n$message\n";
                $headers = array( 'Reply-To: ' . $name . ' <' . $email . '>' );

                if ( wp_mail( $to, $email_subject, $body, $headers ) ) {
                    $form_message = 'Thank you for reaching out! Your message has been sent successfully.';
                    $form_status = 'success';
                } else {
                    $form_message = 'There was a problem sending your message. Please try again later.';
                    $form_status = 'error';
                }
            }
        }
    }
}

get_header(); ?>

<main id="primary" class="site-main py-12 md:py-20 bg-slate-50">
    <div class="max-w-4xl mx-auto px-4 md:px-6">
        
        <header class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-extrabold headline-font text-slate-900 tracking-tight mb-4">
                <?php the_title(); ?>
            </h1>
            <p class="text-lg text-slate-600 max-w-2xl mx-auto">
                Have a question about immigration policy, want to report a tip, or just want to say hello? Fill out the form below and our team will get back to you.
            </p>
        </header>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
            
            <?php if ( $form_message ) : ?>
                <div class="mb-8 p-4 rounded-lg text-sm font-medium <?php echo $form_status === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'; ?>">
                    <?php echo esc_html( $form_message ); ?>
                </div>
            <?php endif; ?>

            <form action="<?php echo esc_url( get_permalink() ); ?>" method="post" class="space-y-6">
                
                <?php wp_nonce_field( 'immi24_submit_contact', 'immi24_contact_nonce' ); ?>
                
                <!-- Honeypot Field -->
                <div style="display:none;">
                    <label for="website_url">Leave this field blank if you are human:</label>
                    <input type="text" name="website_url" id="website_url" value="" tabindex="-1" autocomplete="off" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="full_name" class="block text-sm font-semibold text-slate-900 mb-2">Full Name *</label>
                        <input type="text" name="full_name" id="full_name" required class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white" placeholder="John Doe">
                    </div>
                    <div>
                        <label for="email_address" class="block text-sm font-semibold text-slate-900 mb-2">Email Address *</label>
                        <input type="email" name="email_address" id="email_address" required class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white" placeholder="john@example.com">
                    </div>
                </div>

                <div>
                    <label for="subject" class="block text-sm font-semibold text-slate-900 mb-2">Subject (Optional)</label>
                    <input type="text" name="subject" id="subject" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white" placeholder="What is this regarding?">
                </div>

                <div>
                    <label for="message" class="block text-sm font-semibold text-slate-900 mb-2">Message *</label>
                    <textarea name="message" id="message" rows="6" required class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white resize-y" placeholder="Write your message here..."></textarea>
                </div>

                <div>
                    <button type="submit" name="immi24_contact_submit" class="w-full md:w-auto px-8 py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm text-sm tracking-wide uppercase">
                        Send Message
                    </button>
                </div>

            </form>
        </div>

    </div>
</main>

<?php
get_footer();
