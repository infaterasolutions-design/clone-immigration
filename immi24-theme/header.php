<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until the main content.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package immi24
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
    
    <!-- Google Fonts as per original design tokens -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" media="print" onload="this.media='all'" />
    <noscript>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" />
    </noscript>
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" media="print" onload="this.media='all'" />
    <noscript>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" />
    </noscript>

	<?php wp_head(); ?>
</head>

<body <?php body_class( 'antialiased bg-surface text-on-surface' ); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
	<a class="skip-link screen-reader-text sr-only" href="#primary"><?php esc_html_e( 'Skip to content', 'immi24' ); ?></a>

	<header id="masthead" class="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
		<div class="max-w-screen-2xl mx-auto flex items-center justify-between px-4 py-2 md:py-3 min-h-[60px]">
			
			<!-- Left: Logo -->
			<div class="flex items-center flex-shrink-0 site-branding">
                <?php if ( has_custom_logo() ) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" class="flex items-center gap-2">
                        <span class="text-2xl font-bold headline-font text-primary"><?php bloginfo( 'name' ); ?></span>
                    </a>
                <?php endif; ?>
			</div>

			<!-- Center: Navigation -->
			<nav id="site-navigation" class="main-navigation hidden lg:block">
                <?php
                wp_nav_menu(
                    array(
                        'theme_location' => 'primary',
                        'menu_id'        => 'primary-menu',
                        'menu_class'     => 'flex items-center gap-6 text-sm font-semibold',
                        'container'      => false,
                        'fallback_cb'    => false,
                    )
                );
                ?>
			</nav>

			<!-- Right: Search + Mobile Toggle -->
			<div class="right-section flex items-center gap-3 flex-shrink-0">
				
                <!-- Desktop Search -->
                <div class="hidden lg:flex reuters-search-container js-search-container">
                    <form role="search" method="get" class="relative flex items-center js-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
                        <input 
                            type="search" 
                            class="reuters-search-input js-search-input" 
                            placeholder="Search news, updates..." 
                            value="<?php echo get_search_query(); ?>" 
                            name="s" 
                        />
                        <button type="button" class="reuters-search-icon js-search-toggle" aria-label="Toggle Search">
                            <span class="material-symbols-outlined text-[22px]">search</span>
                        </button>
                        <button type="button" class="reuters-close-btn js-search-close" aria-label="Close Search">
                            <span class="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </form>
                </div>

				<!-- Mobile: Search Icon -->
				<div class="flex lg:hidden items-center gap-1">
					<button class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary rounded-full hover:bg-slate-50 transition-colors js-mobile-search-toggle">
						<span class="material-symbols-outlined text-[22px]">search</span>
					</button>
				</div>

				<!-- Mobile: Hamburger -->
				<button class="hamburger-btn lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-primary transition-colors js-mobile-menu-toggle relative z-50" aria-label="Toggle navigation menu">
					<span class="block w-6 h-[2px] bg-current rounded-full transition-all duration-300 transform origin-center"></span>
					<span class="block w-6 h-[2px] bg-current rounded-full transition-all duration-300 transform origin-center"></span>
					<span class="block w-6 h-[2px] bg-current rounded-full transition-all duration-300 transform origin-center"></span>
				</button>
			</div>
		</div>

        <!-- Mobile Search Dropdown (Toggled via JS) -->
        <div class="js-mobile-search-dropdown absolute left-0 w-full bg-white border-b border-slate-100 p-4 z-40 shadow-sm opacity-0 invisible pointer-events-none transition-all duration-300 transform -translate-y-4 lg:hidden" style="top: 60px;">
            <form role="search" method="get" class="relative flex items-center" action="<?php echo esc_url( home_url( '/' ) ); ?>">
                <span class="material-symbols-outlined text-[18px] text-slate-400 absolute left-3">search</span>
                <input type="search" class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-[16px] outline-none" placeholder="Search news, updates..." value="<?php echo get_search_query(); ?>" name="s" />
            </form>
        </div>

        <!-- Mobile Menu Overlay (Animated via JS) -->
        <div class="js-mobile-menu absolute left-0 w-full z-40 bg-white flex flex-col lg:hidden opacity-0 invisible pointer-events-none transition-all duration-300 transform -translate-y-4 shadow-md border-b border-slate-100" style="top: 60px;">
            <div class="p-4 max-h-[calc(100vh-60px)] overflow-y-auto">
                <?php
                wp_nav_menu(
                    array(
                        'theme_location' => 'primary',
                        'menu_class'     => 'flex flex-col gap-4 text-lg font-medium',
                        'container'      => false,
                        'fallback_cb'    => false,
                    )
                );
                ?>
            </div>
        </div>
	</header>
