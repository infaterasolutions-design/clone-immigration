<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package immi24
 */

get_header();
?>

<main id="primary" class="site-main max-w-3xl mx-auto px-4 py-24 md:py-32 text-center">

	<section class="error-404 not-found bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-16 shadow-sm">
		<header class="page-header mb-8">
            <span class="material-symbols-outlined text-7xl md:text-9xl text-slate-200 mb-6 block">find_in_page</span>
			<h1 class="text-4xl md:text-6xl font-extrabold headline-font tracking-tight text-slate-900 mb-4">
				<?php esc_html_e( '404', 'immi24' ); ?>
			</h1>
            <h2 class="text-xl md:text-2xl font-bold text-slate-700">
                <?php esc_html_e( 'Oops! That page can&rsquo;t be found.', 'immi24' ); ?>
            </h2>
		</header><!-- .page-header -->

		<div class="page-content text-slate-600 mb-10 text-lg">
			<p><?php esc_html_e( 'It looks like nothing was found at this location. The page might have been removed, renamed, or temporarily unavailable. Maybe try a search?', 'immi24' ); ?></p>
		</div><!-- .page-content -->

        <div class="max-w-md mx-auto">
            <?php get_search_form(); ?>
        </div>

        <div class="mt-12 pt-8 border-t border-slate-200">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="inline-flex items-center gap-2 bg-primary hover:bg-blue-800 text-white font-bold font-headline py-3 px-8 rounded-full shadow-md transition-transform transform hover:-translate-y-1">
                <span class="material-symbols-outlined text-[18px]">home</span>
                <?php esc_html_e( 'Return to Homepage', 'immi24' ); ?>
            </a>
        </div>
	</section><!-- .error-404 -->

</main><!-- #main -->

<?php
get_footer();
