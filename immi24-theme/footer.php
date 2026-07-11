<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #page div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package immi24
 */

?>
    <footer class="py-8 md:py-12 px-4 md:px-6 bg-[#F9FAFB] text-slate-600 border-t border-slate-200 mt-12 md:mt-20">
      <div class="max-w-screen-2xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          
          <div class="col-span-2 md:col-span-1">
            <span class="text-2xl font-extrabold tracking-tighter headline-font block mb-4 md:mb-6 text-slate-900 site-branding">
                <?php if ( has_custom_logo() ) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" class="text-2xl font-bold headline-font text-primary">
                        <?php bloginfo( 'name' ); ?>
                    </a>
                <?php endif; ?>
            </span>
            <p class="text-sm leading-relaxed text-slate-600">
              The premier destination for accurate, real-time news and analysis regarding US immigration policy and global mobility.
            </p>
          </div>

          <div>
            <h4 class="font-bold uppercase tracking-widest text-xs mb-4 md:mb-6 text-slate-900">RESOURCES</h4>
            <ul class="space-y-3 text-sm">
              <li><a href="#" class="hover:text-primary transition-colors py-1 block">Visa Fee Calculator</a></li>
              <li><a href="#" class="hover:text-primary transition-colors py-1 block">USCIS Processing Times</a></li>
              <li><a href="#" class="hover:text-primary transition-colors py-1 block">Visa Bulletin Archive</a></li>
              <li><a href="#" class="hover:text-primary transition-colors py-1 block">H1B Lottery Data</a></li>
              <li>
                <a href="<?php bloginfo('rss2_url'); ?>" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors py-1 flex items-center gap-2">
                    <span class="material-symbols-outlined text-[16px]">rss_feed</span> RSS Feed
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold uppercase tracking-widest text-xs mb-4 md:mb-6 text-slate-900">COMPANY</h4>
            <?php
            if ( has_nav_menu( 'footer' ) ) {
                wp_nav_menu(
                    array(
                        'theme_location' => 'footer',
                        'menu_class'     => 'space-y-3 text-sm footer-links',
                        'container'      => false,
                        'fallback_cb'    => false,
                        'add_a_class'    => 'hover:text-primary transition-colors py-1 block'
                    )
                );
            } else {
                // Fallback if no menu is assigned
                ?>
                <ul class="space-y-3 text-sm">
                  <li><a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>" class="hover:text-primary transition-colors py-1 block">About Us</a></li>
                  <li><a href="<?php echo esc_url( home_url( '/advertise-with-us/' ) ); ?>" class="hover:text-primary transition-colors py-1 block">Advertise With Us</a></li>
                  <li><a href="<?php echo esc_url( home_url( '/contact-us/' ) ); ?>" class="hover:text-primary transition-colors py-1 block">Contact Us</a></li>
                  <li><a href="<?php echo esc_url( home_url( '/disclaimer/' ) ); ?>" class="hover:text-primary transition-colors py-1 block">Disclaimer</a></li>
                  <li><a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>" class="hover:text-primary transition-colors py-1 block">Privacy Policy</a></li>
                  <li><a href="<?php echo esc_url( home_url( '/terms-conditions/' ) ); ?>" class="hover:text-primary transition-colors py-1 block">Terms & Conditions</a></li>
                </ul>
                <?php
            }
            ?>
          </div>

          <div class="col-span-2 md:col-span-1">
            <h4 class="font-bold uppercase tracking-widest text-xs mb-4 md:mb-6 text-slate-900">OUR OFFICE</h4>
            <div class="text-sm leading-relaxed text-slate-600 space-y-3">
              <p>
                <strong class="block text-slate-900">SANAZ E-COM LLC</strong>
              </p>
              <p>
                <strong class="block text-slate-900 text-xs uppercase tracking-widest mt-2">Mailing Address</strong>
                823 CONGRESS AVE, STE 150 #1505,<br />
                AUSTIN, TX 78767
              </p>
              <p>
                <strong class="block text-slate-900 text-xs uppercase tracking-widest mt-2">Physical Address</strong>
                823 CONGRESS AVE, STE 150 #1505,<br />
                AUSTIN, TX 78767
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Full-width bottom bar -->
      <div class="border-t border-slate-200 py-6 md:py-8 px-4 md:px-6 text-center text-slate-400 text-xs mt-8 md:mt-12 w-full">
        &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.
      </div>
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>
