<?php
/**
 * Template for displaying search forms
 *
 * @package immi24
 */

// Generate a unique ID for each form and its input.
$immi24_unique_id = wp_unique_id( 'search-form-' );
?>
<form role="search" method="get" class="relative flex items-center js-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
    <label for="<?php echo esc_attr( $immi24_unique_id ); ?>" class="sr-only">
        <?php _e( 'Search for:', 'immi24' ); // phpcs:ignore: WordPress.Security.EscapeOutput.UnsafePrintedFunction ?>
    </label>
    <input 
        type="search" 
        id="<?php echo esc_attr( $immi24_unique_id ); ?>" 
        class="reuters-search-input js-search-input w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-[16px] outline-none focus:border-primary transition-colors" 
        placeholder="<?php echo esc_attr_x( 'Search news, updates...', 'placeholder', 'immi24' ); ?>" 
        value="<?php echo get_search_query(); ?>" 
        name="s" 
    />
    <button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary transition-colors" aria-label="<?php echo esc_attr_x( 'Submit Search', 'submit button', 'immi24' ); ?>">
        <span class="material-symbols-outlined text-[20px]">search</span>
    </button>
</form>
