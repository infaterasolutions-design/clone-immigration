<?php
/**
 * Immi24 Launch Prep Tool
 * 
 * Provides an admin interface to bulk-optimize images and delete dummy content 
 * right before deploying to the live Hostinger server.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

class Immi24_Launch_Prep {

    public function __construct() {
        add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
        add_action( 'admin_init', array( $this, 'handle_form_submissions' ) );
    }

    public function add_admin_menu() {
        add_submenu_page(
            'tools.php',
            'Immi24 Launch Prep',
            'Immi24 Launch Prep',
            'manage_options',
            'immi24-launch-prep',
            array( $this, 'render_admin_page' )
        );
    }

    public function render_admin_page() {
        ?>
        <div class="wrap">
            <h1>Immi24 Launch Prep & Optimizer</h1>
            <p>Use these tools to finalize the site before going live on Hostinger.</p>
            
            <?php if ( isset( $_GET['message'] ) ) : ?>
                <div class="updated notice is-dismissible">
                    <p><strong><?php echo esc_html( sanitize_text_field( $_GET['message'] ) ); ?></strong></p>
                </div>
            <?php endif; ?>

            <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-top: 20px;">
                
                <!-- AVIF Bulk Optimization -->
                <div class="card" style="max-width: 400px; padding: 20px; box-sizing: border-box;">
                    <h2 class="title" style="margin-top:0;">1. Bulk Optimize Images (AVIF)</h2>
                    <p>This will regenerate thumbnails for all existing images in your media library, forcing WordPress to generate the highly-compressed AVIF versions.</p>
                    <p><em>Note: If you have a massive library, do this in batches or use a dedicated plugin. For dummy testing, this is safe.</em></p>
                    <form method="post" action="">
                        <?php wp_nonce_field( 'immi24_bulk_optimize_nonce', 'immi24_launch_nonce' ); ?>
                        <input type="hidden" name="immi24_action" value="bulk_optimize">
                        <button type="submit" class="button button-primary">Regenerate Media Library to AVIF</button>
                    </form>
                </div>

                <!-- Nuke Dummy Content -->
                <div class="card" style="max-width: 400px; padding: 20px; box-sizing: border-box; border-left: 4px solid #d63638;">
                    <h2 class="title" style="margin-top:0; color: #d63638;">2. Nuke Dummy Content</h2>
                    <p><strong>WARNING: DANGER!</strong></p>
                    <p>Clicking this button will instantly delete ALL posts, pages, comments, and categories (except General). It will leave you with a completely blank slate.</p>
                    <p>Use this ONLY right before going live, after you are done testing the layout.</p>
                    <form method="post" action="" onsubmit="return confirm('Are you ABSOLUTELY sure? This will delete all posts, pages, and categories. This cannot be undone.');">
                        <?php wp_nonce_field( 'immi24_nuke_content_nonce', 'immi24_launch_nonce' ); ?>
                        <input type="hidden" name="immi24_action" value="nuke_content">
                        <button type="submit" class="button button-primary" style="background: #d63638; border-color: #d63638; color: white;">Delete All Dummy Content</button>
                    </form>
                </div>

            </div>
        </div>
        <?php
    }

    public function handle_form_submissions() {
        if ( ! isset( $_POST['immi24_action'] ) || ! current_user_can( 'manage_options' ) ) {
            return;
        }

        $action = sanitize_text_field( $_POST['immi24_action'] );

        if ( $action === 'bulk_optimize' && isset( $_POST['immi24_launch_nonce'] ) && wp_verify_nonce( $_POST['immi24_launch_nonce'], 'immi24_bulk_optimize_nonce' ) ) {
            $this->do_bulk_optimize();
        }

        if ( $action === 'nuke_content' && isset( $_POST['immi24_launch_nonce'] ) && wp_verify_nonce( $_POST['immi24_launch_nonce'], 'immi24_nuke_content_nonce' ) ) {
            $this->do_nuke_content();
        }
    }

    private function do_bulk_optimize() {
        require_once( ABSPATH . 'wp-admin/includes/image.php' );
        
        $attachments = get_posts( array(
            'post_type'      => 'attachment',
            'post_mime_type' => 'image',
            'post_status'    => 'inherit',
            'posts_per_page' => 100, // Limit to 100 to prevent timeout during dummy phase
        ) );

        $count = 0;
        foreach ( $attachments as $attachment ) {
            $file = get_attached_file( $attachment->ID );
            if ( $file && file_exists( $file ) ) {
                $metadata = wp_generate_attachment_metadata( $attachment->ID, $file );
                wp_update_attachment_metadata( $attachment->ID, $metadata );
                $count++;
            }
        }

        wp_redirect( admin_url( 'tools.php?page=immi24-launch-prep&message=' . urlencode( "Successfully regenerated AVIF thumbnails for $count images." ) ) );
        exit;
    }

    private function do_nuke_content() {
        // 1. Delete all posts and pages
        $all_posts = get_posts( array(
            'post_type'      => array( 'post', 'page' ),
            'post_status'    => 'any',
            'posts_per_page' => -1,
        ) );
        foreach ( $all_posts as $post ) {
            wp_delete_post( $post->ID, true );
        }

        // 2. Delete all categories (except ID 1, usually Uncategorized/General)
        $categories = get_categories( array( 'hide_empty' => false ) );
        foreach ( $categories as $cat ) {
            if ( $cat->term_id != 1 && $cat->term_id != get_option( 'default_category' ) ) {
                wp_delete_term( $cat->term_id, 'category' );
            }
        }

        // 3. Delete all comments
        $comments = get_comments();
        foreach ( $comments as $comment ) {
            wp_delete_comment( $comment->comment_ID, true );
        }

        wp_redirect( admin_url( 'tools.php?page=immi24-launch-prep&message=' . urlencode( 'Nuke successful! All dummy posts, pages, categories, and comments have been deleted. The site is now a blank slate.' ) ) );
        exit;
    }
}

new Immi24_Launch_Prep();
