<?php
/**
 * The front page template file
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package immi24
 */

get_header();
?>

<main class="mt-2 md:mt-4 px-3 md:px-4 lg:px-0 mb-12">
    <div class="max-w-[1298px] mx-auto flex justify-center px-0 md:px-4 lg:px-24">
        <div class="flex-grow space-y-6 md:space-y-8 w-full">

            <?php
            // Hero Section Query: Get 5 latest posts
            $hero_query = new WP_Query( array(
                'post_type'      => 'post',
                'posts_per_page' => 5,
                'ignore_sticky_posts' => 1,
            ) );

            if ( $hero_query->have_posts() ) :
                $hero_query->the_post(); // First post for the main hero
                $hero_id = get_the_ID();
                $hero_cat = get_the_category();
                $hero_cat_name = ! empty( $hero_cat ) ? $hero_cat[0]->name : 'News';
                ?>
                <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <!-- Left: Featured Story -->
                    <a href="<?php the_permalink(); ?>" class="group cursor-pointer block">
                        <div class="relative aspect-[16/10] overflow-hidden mb-3 md:mb-4 rounded-md bg-slate-100">
                            <?php if ( has_post_thumbnail() ) : ?>
                                <?php the_post_thumbnail( 'large', array( 'class' => 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105', 'loading' => 'eager', 'fetchpriority' => 'high' ) ); ?>
                            <?php else : ?>
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Cpath d='M150 180l30-40 40 50 30-20 40 60H110z' fill='%23cbd5e1'/%3E%3Ccircle cx='160' cy='120' r='15' fill='%23cbd5e1'/%3E%3C/svg%3E" alt="" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <?php endif; ?>
                        </div>
                        <div class="space-y-2 md:space-y-3">
                            <span class="text-primary text-[10px] font-bold uppercase tracking-widest"><?php echo esc_html( $hero_cat_name ); ?></span>
                            <h1 class="text-on-surface text-2xl md:text-3xl font-bold headline-font leading-tight group-hover:text-primary transition-colors">
                                <?php the_title(); ?>
                            </h1>
                            <p class="text-on-surface-variant text-sm md:text-base leading-relaxed line-clamp-3">
                                <?php echo wp_trim_words( get_the_excerpt(), 20, '...' ); ?>
                            </p>
                        </div>
                    </a>

                    <!-- Right: 2x2 Grid -->
                    <div class="grid grid-cols-2 gap-4 md:gap-6">
                        <?php
                        // The remaining 4 posts
                        while ( $hero_query->have_posts() ) : $hero_query->the_post();
                            $grid_cat = get_the_category();
                            $grid_cat_name = ! empty( $grid_cat ) ? $grid_cat[0]->name : 'News';
                            ?>
                            <a href="<?php the_permalink(); ?>" class="space-y-2 group cursor-pointer block">
                                <div class="aspect-[4/3] overflow-hidden rounded-md relative bg-slate-100">
                                    <?php if ( has_post_thumbnail() ) : ?>
                                        <?php the_post_thumbnail( 'medium', array( 'class' => 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' ) ); ?>
                                    <?php endif; ?>
                                </div>
                                <span class="text-primary text-[10px] font-bold uppercase tracking-widest block mt-2"><?php echo esc_html( $grid_cat_name ); ?></span>
                                <h3 class="font-bold headline-font text-xs md:text-sm leading-tight group-hover:text-primary transition-colors text-slate-900"><?php the_title(); ?></h3>
                                <p class="text-[10px] text-slate-400 font-medium"><?php echo get_the_date(); ?></p>
                            </a>
                            <?php
                        endwhile;
                        wp_reset_postdata();
                        ?>
                    </div>
                </section>
            <?php endif; ?>

            <!-- Top Stories -->
            <?php
            $top_stories = new WP_Query( array(
                'post_type'      => 'post',
                'posts_per_page' => 6,
                'offset'         => 5, // Skip the hero posts
                'ignore_sticky_posts' => 1,
            ) );

            if ( $top_stories->have_posts() ) :
                ?>
                <section class="py-4 border-y border-slate-100">
                    <div class="flex items-center justify-between mb-4 md:mb-6">
                        <h2 class="text-lg md:text-xl font-extrabold headline-font border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-tight text-slate-900">
                            Top Stories
                            <span class="block text-sm text-slate-500 font-normal normal-case tracking-normal mt-1 border-none">Real experiences, city guides &amp; insider tips for immigrants</span>
                        </h2>
                    </div>
                    <div class="flex gap-4 md:gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x mt-2">
                        <?php
                        while ( $top_stories->have_posts() ) : $top_stories->the_post();
                            $ts_cat = get_the_category();
                            $ts_cat_name = ! empty( $ts_cat ) ? $ts_cat[0]->name : 'News';
                            ?>
                            <a href="<?php the_permalink(); ?>" class="flex-shrink-0 w-[240px] md:w-[280px] snap-start group cursor-pointer block">
                                <div class="relative aspect-[16/10] w-full overflow-hidden mb-3 rounded-md bg-slate-100">
                                    <?php if ( has_post_thumbnail() ) : ?>
                                        <?php the_post_thumbnail( 'medium', array( 'class' => 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' ) ); ?>
                                    <?php endif; ?>
                                    <div class="absolute top-2 left-2 bg-primary px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-tighter rounded-sm"><?php echo esc_html( $ts_cat_name ); ?></div>
                                </div>
                                <h4 class="font-bold text-sm leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2 text-slate-900"><?php the_title(); ?></h4>
                                <div class="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                                    <span><?php echo get_the_date(); ?></span>
                                </div>
                            </a>
                            <?php
                        endwhile;
                        wp_reset_postdata();
                        ?>
                    </div>
                </section>
            <?php endif; ?>

            <!-- Browse by Category (Static as per original design, just updated links to generic WP paths) -->
            <section class="py-4">
                <h2 class="text-lg md:text-xl font-extrabold headline-font border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-tight mb-4 md:mb-6 text-slate-900">Browse by Category</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    <a href="<?php echo esc_url( home_url( '/category/visa/' ) ); ?>" class="bg-blue-50/50 hover:bg-blue-100 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-blue-100/50 rounded-md">
                        <span class="material-symbols-outlined text-blue-600 text-2xl md:text-3xl mb-2 md:mb-3">assignment</span>
                        <span class="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">Visa</span>
                    </a>
                    <a href="<?php echo esc_url( home_url( '/category/green-card/' ) ); ?>" class="bg-emerald-50/50 hover:bg-emerald-100 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-emerald-100/50 rounded-md">
                        <span class="material-symbols-outlined text-emerald-600 text-2xl md:text-3xl mb-2 md:mb-3">card_membership</span>
                        <span class="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">Green Card</span>
                    </a>
                    <a href="<?php echo esc_url( home_url( '/category/uscis/' ) ); ?>" class="bg-amber-50/50 hover:bg-amber-100 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-amber-100/50 rounded-md">
                        <span class="material-symbols-outlined text-amber-600 text-2xl md:text-3xl mb-2 md:mb-3">account_balance</span>
                        <span class="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">USCIS</span>
                    </a>
                    <a href="<?php echo esc_url( home_url( '/category/ice-border/' ) ); ?>" class="bg-indigo-50/50 hover:bg-indigo-100 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-indigo-100/50 rounded-md">
                        <span class="material-symbols-outlined text-indigo-600 text-2xl md:text-3xl mb-2 md:mb-3">security</span>
                        <span class="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">ICE & Border</span>
                    </a>
                    <a href="<?php echo esc_url( home_url( '/category/students/' ) ); ?>" class="bg-violet-50/50 hover:bg-violet-100 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-violet-100/50 rounded-md">
                        <span class="material-symbols-outlined text-violet-600 text-2xl md:text-3xl mb-2 md:mb-3">school</span>
                        <span class="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">Students</span>
                    </a>
                    <a href="<?php echo esc_url( home_url( '/category/asylum-refugees/' ) ); ?>" class="bg-rose-50/50 hover:bg-rose-100 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-rose-100/50 rounded-md">
                        <span class="material-symbols-outlined text-rose-600 text-2xl md:text-3xl mb-2 md:mb-3">volunteer_activism</span>
                        <span class="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">Asylum & Refugees</span>
                    </a>
                    <a href="<?php echo esc_url( home_url( '/category/guides/' ) ); ?>" class="bg-orange-50/50 hover:bg-orange-100 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-orange-100/50 rounded-md">
                        <span class="material-symbols-outlined text-orange-600 text-2xl md:text-3xl mb-2 md:mb-3">menu_book</span>
                        <span class="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">Guides</span>
                    </a>
                    <a href="<?php echo esc_url( home_url( '/category/policy-watch/' ) ); ?>" class="bg-slate-100/50 hover:bg-slate-200 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-slate-200/50 rounded-md">
                        <span class="material-symbols-outlined text-slate-600 text-2xl md:text-3xl mb-2 md:mb-3">policy</span>
                        <span class="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">Policy Watch</span>
                    </a>
                    <a href="<?php echo esc_url( home_url( '/category/insights/' ) ); ?>" class="bg-cyan-50/50 hover:bg-cyan-100 transition-colors p-4 md:p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-cyan-100/50 rounded-md">
                        <span class="material-symbols-outlined text-cyan-600 text-2xl md:text-3xl mb-2 md:mb-3">insights</span>
                        <span class="font-bold headline-font text-[10px] md:text-[11px] uppercase tracking-widest text-slate-800">Insights</span>
                    </a>
                </div>
            </section>

            <!-- Latest Updates Section & Sidebar -->
            <section class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 py-4 border-t border-slate-100">
                
                <!-- Left/Main Column -->
                <div class="lg:col-span-2">
                    <h2 class="text-lg md:text-xl font-extrabold headline-font border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-tight text-slate-900 mb-6">Latest Updates</h2>
                    <div class="space-y-6">
                        <?php
                        $latest_updates = new WP_Query( array(
                            'post_type'      => 'post',
                            'posts_per_page' => 10,
                            'offset'         => 11, // Skip previous posts
                            'ignore_sticky_posts' => 1,
                        ) );

                        if ( $latest_updates->have_posts() ) :
                            while ( $latest_updates->have_posts() ) : $latest_updates->the_post();
                                $lu_cat = get_the_category();
                                $lu_cat_name = ! empty( $lu_cat ) ? $lu_cat[0]->name : 'News';
                                ?>
                                <article class="group pb-3 md:pb-4 border-b border-slate-100 flex gap-3 md:gap-6 cursor-pointer">
                                    <a href="<?php the_permalink(); ?>" class="flex-grow min-w-0">
                                        <div class="flex items-center gap-2 mb-1 md:mb-2">
                                            <span class="text-[10px] font-bold text-primary uppercase tracking-widest"><?php echo esc_html( $lu_cat_name ); ?></span>
                                            <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span class="text-[10px] text-slate-400 font-medium uppercase"><?php echo get_the_date(); ?></span>
                                        </div>
                                        <h3 class="text-base md:text-lg font-bold headline-font group-hover:text-primary transition-colors mb-1 md:mb-2 text-slate-900 line-clamp-2">
                                            <?php the_title(); ?>
                                        </h3>
                                        <p class="text-sm text-slate-600 leading-relaxed line-clamp-2">
                                            <?php echo wp_trim_words( get_the_excerpt(), 20, '...' ); ?>
                                        </p>
                                    </a>
                                    <a href="<?php the_permalink(); ?>" class="w-[110px] h-[75px] md:w-[190px] md:h-[125px] overflow-hidden flex-shrink-0 block bg-slate-100 relative rounded-sm">
                                        <?php if ( has_post_thumbnail() ) : ?>
                                            <?php the_post_thumbnail( 'medium', array( 'class' => 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700' ) ); ?>
                                        <?php else : ?>
                                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Cpath d='M150 180l30-40 40 50 30-20 40 60H110z' fill='%23cbd5e1'/%3E%3Ccircle cx='160' cy='120' r='15' fill='%23cbd5e1'/%3E%3C/svg%3E" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <?php endif; ?>
                                    </a>
                                </article>
                                <?php
                            endwhile;
                            wp_reset_postdata();
                        endif;
                        ?>
                    </div>
                </div>

                <!-- Right/Sidebar Column -->
                <aside class="space-y-6 lg:col-span-1">
                    <?php if ( is_active_sidebar( 'sidebar-1' ) ) : ?>
                        <?php dynamic_sidebar( 'sidebar-1' ); ?>
                    <?php else : ?>
                    
                    <!-- Latest News Sidebar -->
                    <div class="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
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
                </aside>
            </section>

            <!-- Trust Section (Static) -->
            <section class="py-4">
                <div class="grid grid-cols-1 md:grid-cols-2 bg-white border border-slate-200 shadow-sm overflow-hidden rounded-xl">
                    <div class="h-48 md:h-80 lg:h-auto overflow-hidden relative min-h-[200px] bg-slate-100">
                        <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/trust-banner.jpg' ); ?>" alt="Trusted Authority on US Immigration" class="w-full h-full object-cover" />
                    </div>
                    <div class="p-6 md:p-10 flex flex-col justify-center">
                        <div class="inline-flex items-center gap-2 bg-primary text-white px-3 py-1 self-start mb-4 md:mb-6 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                            <span class="material-symbols-outlined text-sm">fact_check</span> Fact-Checked Reporting
                        </div>
                        <h2 class="text-2xl md:text-3xl font-extrabold headline-font mb-3 md:mb-4 leading-tight text-slate-900">Your Real-Time Source on US Immigration</h2>
                        <p class="text-slate-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">We deliver fast, fact-checked analysis of shifting U.S. immigration policies, visa updates, and procedural changes — updated 24/7.</p>
                        <div class="flex items-center gap-6 md:gap-8">
                            <div>
                                <p class="text-xl md:text-2xl font-extrabold text-primary headline-font">Updated</p>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">EVERY HOUR</p>
                            </div>
                            <div class="w-px h-10 bg-slate-200"></div>
                            <div>
                                <p class="text-xl md:text-2xl font-extrabold text-primary headline-font">24/7</p>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">POLICY TRACKING</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    </div>
</main>

<?php
get_footer();
