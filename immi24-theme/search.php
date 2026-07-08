<?php
/**
 * The template for displaying search results pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package immi24
 */

get_header();
?>

<main id="primary" class="site-main max-w-[1000px] mx-auto px-4 md:px-6 lg:px-0 py-8 md:py-12">

	<?php if ( have_posts() ) : ?>

		<header class="page-header mb-12 pb-6 border-b border-slate-200">
			<h1 class="text-3xl md:text-5xl font-extrabold headline-font tracking-tight text-slate-900 leading-[1.2] mb-4">
				<?php
				/* translators: %s: search query. */
				printf( esc_html__( 'Search results for: %s', 'immi24' ), '<span class="text-primary italic">"' . get_search_query() . '"</span>' );
				?>
			</h1>
		</header><!-- .page-header -->

		<div class="space-y-8">
			<?php
			/* Start the Loop */
			while ( have_posts() ) :
				the_post();
				
                $categories = get_the_category();
                $primary_cat = ! empty( $categories ) ? $categories[0] : null;
				?>
				<article id="post-<?php the_ID(); ?>" <?php post_class( 'flex flex-col md:flex-row gap-6 group border border-slate-100 p-4 rounded-xl hover:shadow-lg transition-shadow bg-white' ); ?>>
                    
                    <?php if ( has_post_thumbnail() ) : ?>
                        <div class="md:w-1/3 flex-shrink-0">
                            <a href="<?php the_permalink(); ?>" class="block aspect-[16/10] overflow-hidden rounded-lg bg-slate-100 h-full">
                                <?php the_post_thumbnail( 'medium', array( 'class' => 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' ) ); ?>
                            </a>
                        </div>
                    <?php endif; ?>
                    
                    <div class="flex-grow flex flex-col justify-center <?php echo ! has_post_thumbnail() ? 'w-full' : 'md:w-2/3'; ?>">
                        <?php if ( $primary_cat ) : ?>
                            <span class="text-primary text-[10px] font-bold uppercase tracking-widest mb-2 block">
                                <?php echo esc_html( $primary_cat->name ); ?>
                            </span>
                        <?php endif; ?>
                        
                        <h2 class="font-bold headline-font text-xl md:text-2xl leading-tight group-hover:text-primary transition-colors text-slate-900 mb-3">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h2>
                        
                        <div class="text-sm text-slate-600 line-clamp-3 mb-4">
                            <?php echo wp_trim_words( get_the_excerpt(), 25, '...' ); ?>
                        </div>
                        
                        <div class="flex items-center gap-3 text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-auto">
                            <span><?php echo get_the_date(); ?></span>
                        </div>
                    </div>
                </article>
				<?php
			endwhile;
			?>
		</div>

		<?php
		the_posts_navigation( array(
			'prev_text' => '<span class="material-symbols-outlined">arrow_back</span> ' . esc_html__( 'Previous', 'immi24' ),
			'next_text' => esc_html__( 'Next', 'immi24' ) . ' <span class="material-symbols-outlined">arrow_forward</span>',
            'class'     => 'mt-12 flex justify-between pt-6 border-t border-slate-200'
		) );

	else :
		?>
        <section class="no-results not-found text-center py-20 bg-slate-50 rounded-2xl border border-slate-100 px-6">
            <span class="material-symbols-outlined text-6xl text-slate-300 mb-4 block">search_off</span>
            <h1 class="text-3xl font-bold text-slate-900 mb-4"><?php esc_html_e( 'No Results Found', 'immi24' ); ?></h1>
            <p class="text-slate-600 mb-8 max-w-xl mx-auto"><?php printf( esc_html__( 'Sorry, but nothing matched your search terms for "%s". Please try again with some different keywords.', 'immi24' ), get_search_query() ); ?></p>
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
