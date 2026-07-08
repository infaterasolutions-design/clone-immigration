<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package immi24
 */

get_header();
?>

<main id="primary" class="site-main max-w-[900px] mx-auto px-4 md:px-6 py-12 md:py-16">

	<?php
	while ( have_posts() ) :
		the_post();
		?>

		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
			<header class="entry-header mb-8 pb-6 border-b border-slate-100">
				<?php the_title( '<h1 class="text-3xl md:text-5xl font-extrabold headline-font tracking-tight text-slate-900 leading-[1.2]">', '</h1>' ); ?>
			</header>

            <?php if ( has_post_thumbnail() ) : ?>
                <div class="mb-10 overflow-hidden rounded-xl bg-slate-100 shadow-md">
                    <?php the_post_thumbnail( 'full', array( 'class' => 'w-full h-auto object-cover' ) ); ?>
                </div>
            <?php endif; ?>

			<div class="entry-content prose prose-lg max-w-none font-body text-slate-800 pb-12">
				<?php
				the_content();

				wp_link_pages( array(
					'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'immi24' ),
					'after'  => '</div>',
				) );
				?>
			</div>

		</article><!-- #post-<?php the_ID(); ?> -->

		<?php
	endwhile; // End of the loop.
	?>

</main><!-- #main -->

<?php
get_footer();
