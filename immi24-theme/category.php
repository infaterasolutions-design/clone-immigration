<?php
/**
 * The template for displaying category pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package immi24
 */

get_header();
?>

<main id="primary" class="site-main max-w-[1298px] mx-auto px-3 md:px-4 lg:px-24 py-6 md:py-8 mb-12">

	<?php if ( have_posts() ) : ?>

		<!-- Header Section -->
		<div class="mb-6 md:mb-10 pb-4 md:pb-6 border-b border-slate-200">
			<h1 class="text-2xl md:text-3xl lg:text-5xl font-extrabold headline-font text-slate-900 mb-2 md:mb-4">
                <?php echo single_cat_title( '', false ); ?>
            </h1>
            <?php
            // Show optional category description
            the_archive_description( '<p class="text-slate-600 text-sm md:text-lg leading-relaxed max-w-3xl">', '</p>' );
			?>
		</div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative">
            
            <!-- Main Feed -->
            <div class="lg:col-span-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <?php
                    /* Start the Loop */
                    while ( have_posts() ) :
                        the_post();
                        ?>
                        <article id="post-<?php the_ID(); ?>" <?php post_class( 'group flex flex-col space-y-3 md:space-y-4 border border-transparent hover:border-slate-100 pb-4 rounded-xl transition-all hover:shadow-lg bg-white relative' ); ?>>
                            
                            <a href="<?php the_permalink(); ?>" class="block">
                                <div class="relative aspect-[16/10] overflow-hidden rounded-t-xl w-full bg-slate-100">
                                    <?php if ( has_post_thumbnail() ) : ?>
                                        <?php the_post_thumbnail( 'large', array( 'class' => 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' ) ); ?>
                                    <?php endif; ?>
                                    
                                    <div class="absolute top-3 left-3 bg-primary px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest rounded-sm shadow-md">
                                        <?php echo single_cat_title( '', false ); ?>
                                    </div>
                                </div>
                            </a>
                            
                            <div class="px-3 md:px-4 space-y-2 md:space-y-3 flex-grow border-x border-b border-transparent group-hover:border-slate-100 rounded-b-xl transition-all flex flex-col">
                                <h2 class="text-lg md:text-xl font-extrabold headline-font leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-3">
                                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                </h2>
                                
                                <p class="text-slate-600 text-sm leading-relaxed line-clamp-2 flex-grow">
                                    <?php echo wp_trim_words( get_the_excerpt(), 15, '...' ); ?>
                                </p>
                                
                                <div class="flex items-center gap-3 pt-3 md:pt-4 text-[11px] text-slate-500 font-medium tracking-widest uppercase border-t border-slate-100 mt-auto">
                                    <span><?php echo get_the_date(); ?></span>
                                </div>
                            </div>

                        </article>
                        <?php
                    endwhile;
                    ?>
                </div>

                <div class="mt-12 flex justify-center pt-8 border-t border-slate-200">
                    <?php
                    the_posts_pagination( array(
                        'mid_size'  => 2,
                        'prev_text' => '<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">arrow_back</span> Previous</span>',
                        'next_text' => '<span class="flex items-center gap-2">Next <span class="material-symbols-outlined text-[18px]">arrow_forward</span></span>',
                        'class'     => 'pagination-ui',
                    ) );
                    ?>
                </div>
            </div>

            <!-- Right Sidebar Widget -->
            <div class="lg:col-span-4 hidden lg:block">
                <?php if ( is_active_sidebar( 'sidebar-1' ) ) : ?>
                    <?php dynamic_sidebar( 'sidebar-1' ); ?>
                <?php else : ?>
                
                <!-- Trending News Widget -->
                <div class="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 mb-6">
                    <h3 class="font-headline font-extrabold text-sm tracking-widest uppercase text-primary mb-6">Trending News</h3>
                    <div class="space-y-6">
                        <?php
                        $trending = new WP_Query( array(
                            'post_type'      => 'post',
                            'posts_per_page' => 5,
                            'orderby'        => 'comment_count',
                            'ignore_sticky_posts' => 1,
                        ) );

                        if ( $trending->have_posts() ) :
                            while ( $trending->have_posts() ) : $trending->the_post();
                                ?>
                                <a href="<?php the_permalink(); ?>" class="group block">
                                    <div class="text-xs font-bold mb-1 text-slate-500">
                                        <?php echo get_the_date(); ?>
                                    </div>
                                    <h4 class="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-slate-800">
                                        <?php the_title(); ?>
                                    </h4>
                                </a>
                                <?php
                            endwhile;
                            wp_reset_postdata();
                        endif;
                        ?>
                    </div>
                </div>

                <!-- Latest Updates Widget -->
                <div class="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
                    <h3 class="font-headline font-extrabold text-sm tracking-widest uppercase text-primary mb-6">Latest Updates</h3>
                    <div class="space-y-6">
                        <?php
                        $latest = new WP_Query( array(
                            'post_type'      => 'post',
                            'posts_per_page' => 5,
                            'ignore_sticky_posts' => 1,
                        ) );

                        if ( $latest->have_posts() ) :
                            while ( $latest->have_posts() ) : $latest->the_post();
                                ?>
                                <a href="<?php the_permalink(); ?>" class="group block flex gap-4 items-center">
                                    <div class="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-slate-100">
                                        <?php if ( has_post_thumbnail() ) : ?>
                                            <?php the_post_thumbnail( 'thumbnail', array( 'class' => 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' ) ); ?>
                                        <?php endif; ?>
                                    </div>
                                    <div>
                                        <h4 class="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-slate-800 line-clamp-2 mb-1">
                                            <?php the_title(); ?>
                                        </h4>
                                        <div class="text-[10px] font-bold text-slate-400">
                                            <?php echo get_the_date(); ?>
                                        </div>
                                    </div>
                                </a>
                                <?php
                            endwhile;
                            wp_reset_postdata();
                        endif;
                        ?>
                    </div>
                </div>
                
                <?php endif; ?>
            </div>
        </div>

	<?php else : ?>
        <section class="no-results not-found text-center py-20">
            <h1 class="text-3xl font-bold text-slate-900 mb-4"><?php esc_html_e( 'No Posts Found', 'immi24' ); ?></h1>
            <p class="text-slate-600 mb-8"><?php esc_html_e( 'It seems there are no articles in this category yet.', 'immi24' ); ?></p>
            <div class="max-w-md mx-auto">
                <?php get_search_form(); ?>
            </div>
        </section>
	<?php endif; ?>

</main><!-- #main -->

<?php
get_footer();
