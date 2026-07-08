<?php
/**
 * Immi24 Custom Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package immi24
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.0.0' );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function immi24_setup() {
	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	// Let WordPress manage the document title.
	add_theme_support( 'title-tag' );

	// Enable support for Post Thumbnails on posts and pages.
	add_theme_support( 'post-thumbnails' );

	// Register Menus
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'immi24' ),
		'footer'  => __( 'Footer Menu', 'immi24' ),
	) );

	// Switch default core markup for search form, comment form, and comments to output valid HTML5.
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	// Add support for core custom logo.
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);
}
add_action( 'after_setup_theme', 'immi24_setup' );


// Custom Widget for manual posts
require get_template_directory() . '/inc/class-immi24-custom-widget.php';

// Launch Prep Tool (Bulk Optimize & Dummy Content Nuke)
if ( is_admin() ) {
    require get_template_directory() . '/inc/class-immi24-launch-prep.php';
}

/**
 * Register widget area and custom widgets.
 */

function immi24_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Main Sidebar', 'immi24' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here to display in the right sidebar.', 'immi24' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s mb-8 bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title text-xl font-bold headline-font mb-5 text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2"><span class="w-2 h-6 bg-primary rounded-full block"></span>',
			'after_title'   => '</h2>',
		)
	);

    // Register our custom manual posts widget
    register_widget( 'Immi24_Manual_Posts_Widget' );
}
add_action( 'widgets_init', 'immi24_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function immi24_scripts() {
	// Enqueue main stylesheet.
	wp_enqueue_style( 'immi24-style', get_stylesheet_uri(), array(), _S_VERSION );

    // Enqueue compiled Tailwind CSS with dynamic versioning to break browser cache
    $css_version = file_exists( get_template_directory() . '/assets/css/tailwind-output.css' ) ? filemtime( get_template_directory() . '/assets/css/tailwind-output.css' ) : _S_VERSION;
    wp_enqueue_style( 'immi24-tailwind', get_template_directory_uri() . '/assets/css/tailwind-output.css', array(), $css_version );

	// Enqueue main JavaScript file with dynamic versioning
    $js_version = file_exists( get_template_directory() . '/assets/js/main.js' ) ? filemtime( get_template_directory() . '/assets/js/main.js' ) : _S_VERSION;
	wp_enqueue_script( 'immi24-main-js', get_template_directory_uri() . '/assets/js/main.js', array(), $js_version, true );
}
add_action( 'wp_enqueue_scripts', 'immi24_scripts' );

/**
 * Disable parent category selection in the admin UI to enforce a flat category structure.
 */
function immi24_disable_parent_category_ui() {
    global $pagenow;
    
    // Only apply to the category edit/add screens
    if ( in_array( $pagenow, array( 'edit-tags.php', 'term.php' ) ) && isset($_GET['taxonomy']) && $_GET['taxonomy'] === 'category' ) {
        ?>
        <style>
            .term-parent-wrap { display: none !important; }
        </style>
        <?php
    }
}
add_action( 'admin_head', 'immi24_disable_parent_category_ui' );

/**
 * Ensure category archives always show the newest posts first and ignore sticky posts.
 */
function immi24_enforce_archive_sorting( $query ) {
    if ( ! is_admin() && $query->is_main_query() && ( is_category() || is_archive() || is_home() ) ) {
        $query->set( "ignore_sticky_posts", 1 );
        $query->set( "orderby", "date" );
        $query->set( "order", "DESC" );
    }
}
add_action( "pre_get_posts", "immi24_enforce_archive_sorting" );


/**
 * Add Tailwind classes to menu anchor tags (a) so custom menus match the theme design.
 */
function immi24_nav_menu_link_attributes( $atts, $item, $args ) {
    if ( 'primary' === $args->theme_location ) {
        if ( empty( $atts['class'] ) ) {
            $atts['class'] = '';
        }
        $atts['class'] .= ' hover:text-primary transition-colors';
    }
    if ( 'footer' === $args->theme_location ) {
        if ( empty( $atts['class'] ) ) {
            $atts['class'] = '';
        }
        $atts['class'] .= ' hover:text-primary transition-colors py-1 block';
    }
    return $atts;
}
add_filter( 'nav_menu_link_attributes', 'immi24_nav_menu_link_attributes', 10, 3 );


/**
 * ==============================================================================
 * OPTIMIZATION & CLEANUP (PRODUCTION READINESS)
 * ==============================================================================
 */

/**
 * 1. Remove unnecessary Gutenberg & WordPress frontend bloat
 */
function immi24_remove_frontend_bloat() {
    // Remove Gutenberg block library CSS
    wp_dequeue_style( 'wp-block-library' );
    wp_dequeue_style( 'wp-block-library-theme' );
    wp_dequeue_style( 'wc-blocks-style' );
    wp_dequeue_style( 'global-styles' );
    wp_dequeue_style( 'classic-theme-styles' );
    
    // Deregister dashicons for non-logged-in users
    if ( ! is_user_logged_in() ) {
        wp_deregister_style( 'dashicons' );
    }
}
add_action( 'wp_enqueue_scripts', 'immi24_remove_frontend_bloat', 100 );

/**
 * 2. Disable WordPress Emojis (reduces HTTP requests and inline JS)
 */
function immi24_disable_emojis() {
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
    remove_action( 'admin_print_styles', 'print_emoji_styles' ); 
    remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
    remove_filter( 'comment_text_rss', 'wp_staticize_emoji' ); 
    remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
}
add_action( 'init', 'immi24_disable_emojis' );

/**
 * 3. Enforce AVIF Image Generation (Fallback to WebP/JPEG)
 */
function immi24_force_avif_generation( $formats ) {
    $formats['image/jpeg'] = 'image/avif';
    $formats['image/png']  = 'image/avif';
    $formats['image/webp'] = 'image/avif';
    return $formats;
}
add_filter( 'image_editor_output_format', 'immi24_force_avif_generation' );

/**
 * Optimize next-gen image compression quality
 */
add_filter( 'wp_editor_set_quality', function( $quality, $mime_type ) {
    if ( 'image/avif' === $mime_type || 'image/webp' === $mime_type ) {
        return 75; // Optimize AVIF compression
    }
    return $quality;
}, 10, 2 );

/**
 * 4. Load assets conditionally (Comments script)
 */
function immi24_conditional_scripts() {
    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'immi24_conditional_scripts' );


/**
 * 5. One-time Database Cleanup (Removes "Hello World" and renames "Uncategorized")
 */
function immi24_one_time_database_cleanup() {
    // Only run this once
    if ( get_option( 'immi24_cleanup_done' ) ) {
        return;
    }

    // Delete "Hello world!" post
    $hello_world = get_page_by_path( 'hello-world', OBJECT, 'post' );
    if ( $hello_world ) {
        wp_delete_post( $hello_world->ID, true );
    }

    // Delete "Sample Page"
    $sample_page = get_page_by_path( 'sample-page', OBJECT, 'page' );
    if ( $sample_page ) {
        wp_delete_post( $sample_page->ID, true );
    }

    // Rename "Uncategorized" to "General"
    $uncategorized = get_category_by_slug( 'uncategorized' );
    if ( $uncategorized ) {
        wp_update_term( $uncategorized->term_id, 'category', array(
            'name' => 'General',
            'slug' => 'general'
        ));
    }

    // Mark as done
    update_option( 'immi24_cleanup_done', true );
}
add_action( 'admin_init', 'immi24_one_time_database_cleanup' );

/**
 * 6. Disable Admin Bar on Frontend
 */
show_admin_bar(false);

/**
 * 7. Automate Missing Image Alt Attributes for SEO/Accessibility
 */
function immi24_ensure_image_alt( $attr, $attachment, $size ) {
    if ( empty( $attr['alt'] ) ) {
        // Fallback to the post title of the parent post
        $parent = get_post( $attachment->post_parent );
        if ( $parent && ! empty( $parent->post_title ) ) {
            $attr['alt'] = trim( strip_tags( $parent->post_title ) );
        } else {
            $attr['alt'] = trim( strip_tags( $attachment->post_title ) );
        }
    }
    return $attr;
}
add_filter( 'wp_get_attachment_image_attributes', 'immi24_ensure_image_alt', 10, 3 );

