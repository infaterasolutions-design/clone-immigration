<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package immi24
 */

get_header();
?>

<main id="primary" class="site-main max-w-screen-2xl mx-auto px-4 py-8 md:py-12">

	<?php
	if ( have_posts() ) :

		if ( is_home() && ! is_front_page() ) :
			?>
			<header>
				<h1 class="text-3xl md:text-4xl font-extrabold headline-font text-slate-900 mb-8"><?php single_post_title(); ?></h1>
			</header>
			<?php
		endif;

		/* Start the Loop */
		echo '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
		while ( have_posts() ) :
			the_post();

			/*
			 * Include the Post-Type-specific template for the content.
			 */
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'bg-white border border-slate-200 p-4 hover:shadow-lg transition-shadow' ); ?>>
				<?php if ( has_post_thumbnail() ) : ?>
					<div class="mb-4 aspect-video overflow-hidden bg-slate-100">
						<a href="<?php the_permalink(); ?>">
							<?php the_post_thumbnail( 'large', array( 'class' => 'w-full h-full object-cover' ) ); ?>
						</a>
					</div>
				<?php endif; ?>
				
				<header class="entry-header mb-3">
					<?php
					$categories = get_the_category();
					if ( ! empty( $categories ) ) {
						echo '<div class="mb-2">';
						echo '<span class="text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-sm">' . esc_html( $categories[0]->name ) . '</span>';
						echo '</div>';
					}
					?>
					<h2 class="text-xl font-bold headline-font text-slate-900 leading-tight mb-2 hover:text-primary transition-colors">
						<a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a>
					</h2>
				</header>

				<div class="entry-summary text-sm text-slate-600 line-clamp-3">
					<?php the_excerpt(); ?>
				</div>
			</article>
			<?php

		endwhile;
		echo '</div>'; // End grid

		the_posts_navigation( array(
			'prev_text' => '<span class="material-symbols-outlined">arrow_back</span> ' . esc_html__( 'Previous', 'immi24' ),
			'next_text' => esc_html__( 'Next', 'immi24' ) . ' <span class="material-symbols-outlined">arrow_forward</span>',
            'class'     => 'mt-12 flex justify-between'
		) );

	else :
        ?>
        <section class="no-results not-found text-center py-20">
            <h2 class="text-2xl font-bold text-slate-900 mb-4"><?php esc_html_e( 'Nothing Found', 'immi24' ); ?></h2>
            <p class="text-slate-600 mb-8"><?php esc_html_e( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.', 'immi24' ); ?></p>
            <div class="max-w-md mx-auto">
                <?php get_search_form(); ?>
            </div>
        </section>
        <?php
	endif;
	?>

</main><!-- #main -->

<?php
get_footer();
