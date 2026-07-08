<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package immi24
 */

get_header();
?>

<main id="primary" class="site-main max-w-[1298px] mx-auto px-4 md:px-6 lg:px-24 py-8 md:py-12">

	<?php
	while ( have_posts() ) :
		the_post();
		
        // Get primary category
        $categories = get_the_category();
        $primary_cat = ! empty( $categories ) ? $categories[0] : null;
		?>

		<article id="post-<?php the_ID(); ?>" <?php post_class( 'article-wrapper relative' ); ?>>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 relative">
                
                <!-- Article Content -->
                <div class="lg:col-span-2 w-full">
                    
                    <!-- Category & Meta -->
                    <div class="flex items-center gap-3 mb-5 md:mb-3 flex-wrap">
                        <?php if ( $primary_cat ) : ?>
                            <div class="bg-[#eef2ff] text-[#1e3a8a] px-3 py-1.5 rounded flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase font-sans">
                                <a href="<?php echo esc_url( get_category_link( $primary_cat->term_id ) ); ?>" class="hover:opacity-80 transition-opacity">
                                    <?php echo esc_html( $primary_cat->name ); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        
                        <span class="text-slate-300 mx-1 text-[8px]">●</span>
                        <span class="text-slate-500 text-sm font-medium"><?php echo esc_html( get_the_date() ); ?></span>
                    </div>

                    <!-- Title -->
                    <header class="entry-header">
                        <h1 class="text-2xl md:text-3xl lg:text-4xl font-extrabold font-headline tracking-tighter text-slate-900 mb-5 leading-[1.1]">
                            <?php the_title(); ?>
                        </h1>
                    </header>
                    
                    <!-- Subtitle / Excerpt -->
                    <?php if ( has_excerpt() ) : ?>
                        <p class="text-[20px] md:text-[24px] text-slate-500 leading-[1.35] mb-8 font-normal font-headline pr-4 lg:pr-12">
                            <?php echo get_the_excerpt(); ?>
                        </p>
                    <?php endif; ?>

                    <!-- Author Info -->
                    <div class="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                        <div class="w-14 h-14 rounded-md overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                            <?php echo get_avatar( get_the_author_meta( 'ID' ), 56, '', '', array( 'class' => 'w-full h-full object-cover' ) ); ?>
                        </div>
                        <div class="flex flex-col justify-center gap-1.5">
                            <span class="text-slate-900 font-bold text-[16px] leading-none hover:text-primary transition-colors">
                                <?php the_author_posts_link(); ?>
                            </span>
                            <div class="text-slate-500 text-[14px] leading-none">
                                <?php echo get_the_time( 'M j, Y \a\t g:i a' ); ?>
                            </div>
                        </div>
                    </div>

                    <!-- Featured Image -->
                    <?php if ( has_post_thumbnail() ) : ?>
                        <div class="rounded-xl shadow-2xl shadow-slate-200/50 relative group mb-8">
                            <div class="overflow-hidden rounded-xl bg-slate-100">
                                <?php the_post_thumbnail( 'full', array( 'class' => 'w-full aspect-[16/9] object-cover', 'loading' => 'eager', 'fetchpriority' => 'high' ) ); ?>
                            </div>
                            <?php 
                            $caption = get_the_post_thumbnail_caption();
                            if ( $caption ) : ?>
                                <div class="px-4 py-2 bg-surface-container-low text-on-surface-variant text-[11px] italic font-medium rounded-b-xl">
                                    <?php echo esc_html( $caption ); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>

                    <!-- Content -->
                    <div class="entry-content prose prose-lg max-w-none font-body pb-12 text-slate-800 mt-4">
                        <?php
                        the_content();
                        
                        wp_link_pages( array(
                            'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'immi24' ),
                            'after'  => '</div>',
                        ) );
                        ?>
                    </div>
                    
                    <!-- Tags -->
                    <?php
                    $tags_list = get_the_tag_list( '', esc_html_x( ', ', 'list item separator', 'immi24' ) );
                    if ( $tags_list ) {
                        printf( '<div class="tags-links mt-8 mb-8 pt-4 border-t border-slate-100"><span class="font-bold text-sm text-slate-900 mr-2">%1$s</span> %2$s</div>', esc_html__( 'Tags:', 'immi24' ), $tags_list ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                    }
                    ?>
                    
                    <!-- Related Articles (Slider) -->
                    <?php
                    if ( $primary_cat ) {
                        $related_query = new WP_Query( array(
                            'category__in'   => array( $primary_cat->term_id ),
                            'post__not_in'   => array( get_the_ID() ),
                            'posts_per_page' => 6,
                            'ignore_sticky_posts' => 1,
                        ) );

                        if ( $related_query->have_posts() ) :
                            ?>
                            <div class="related-articles my-12 pt-8 border-t border-slate-200">
                                <h3 class="text-xl font-extrabold headline-font mb-6 text-slate-900 border-l-4 border-primary pl-3 uppercase tracking-tight">Read More in <?php echo esc_html( $primary_cat->name ); ?></h3>
                                
                                <div class="flex gap-4 md:gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x">
                                    <?php while ( $related_query->have_posts() ) : $related_query->the_post(); ?>
                                        <a href="<?php the_permalink(); ?>" class="flex-shrink-0 w-[260px] md:w-[280px] snap-start group block">
                                            <div class="aspect-[16/10] overflow-hidden rounded-md mb-3 bg-slate-100">
                                                <?php if ( has_post_thumbnail() ) : ?>
                                                    <?php the_post_thumbnail( 'medium', array( 'class' => 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' ) ); ?>
                                                <?php endif; ?>
                                            </div>
                                            <h4 class="font-bold text-sm leading-snug group-hover:text-primary transition-colors text-slate-900 mb-2 line-clamp-2">
                                                <?php the_title(); ?>
                                            </h4>
                                            <span class="text-[11px] text-slate-500 font-medium tracking-widest uppercase"><?php echo get_the_date(); ?></span>
                                        </a>
                                    <?php endwhile; ?>
                                </div>
                            </div>
                            <?php
                            wp_reset_postdata();
                        endif;
                    }
                    ?>

                    <?php
                    // If comments are open or we have at least one comment, load up the comment template.
                    // Note: Currently omitted by default per instructions, can uncomment if needed.
                    /*
                    if ( comments_open() || get_comments_number() ) :
                        comments_template();
                    endif;
                    */
                    ?>

                </div>

                <!-- Right Sidebar -->
                <aside class="space-y-6 lg:col-span-1">
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
                                'post__not_in'   => array( get_the_ID() ), // Exclude current post
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
                                'post__not_in'   => array( get_the_ID() ), // Exclude current post
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
                </aside>
            </div>
		</article><!-- #post-<?php the_ID(); ?> -->

		<?php
	endwhile; // End of the loop.
	?>

</main><!-- #main -->

<?php
get_footer();
