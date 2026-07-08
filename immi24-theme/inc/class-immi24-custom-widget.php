<?php
/**
 * Custom Widget to display posts manually while preserving Tailwind CSS styling.
 */

class Immi24_Manual_Posts_Widget extends WP_Widget {

    public function __construct() {
        parent::__construct(
            'immi24_manual_posts_widget',
            esc_html__( 'Custom Sidebar Widget', 'immi24' ),
            array( 'description' => esc_html__( 'Display specific posts with exact theme styling (Trending or Latest Updates).', 'immi24' ) )
        );
    }

    public function widget( $args, $instance ) {
        echo $args['before_widget'];

        if ( ! empty( $instance['title'] ) ) {
            echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ) . $args['after_title'];
        }

        $style    = ! empty( $instance['style'] ) ? $instance['style'] : 'text';
        $post_ids = ! empty( $instance['post_ids'] ) ? $instance['post_ids'] : '';
        $count    = ! empty( $instance['count'] ) ? absint( $instance['count'] ) : 5;

        $query_args = array(
            'post_type'           => 'post',
            'posts_per_page'      => $count,
            'ignore_sticky_posts' => 1,
        );

        if ( ! empty( $post_ids ) ) {
            // Convert comma separated string to array of integers
            $ids = array_map( 'intval', array_map( 'trim', explode( ',', $post_ids ) ) );
            $ids = array_filter( $ids ); // Remove zeros/empty
            if ( ! empty( $ids ) ) {
                $query_args['post__in'] = $ids;
                $query_args['orderby']  = 'post__in'; // Maintain exact order they typed
            }
        }

        if ( ! empty( $instance['cat'] ) ) {
            $query_args['cat'] = absint( $instance['cat'] );
        }

        $custom_query = new WP_Query( $query_args );

        if ( $custom_query->have_posts() ) {
            echo '<div class="space-y-6">';

            while ( $custom_query->have_posts() ) {
                $custom_query->the_post();

                if ( 'text' === $style ) {
                    // "Trending News" Style (Text only)
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
                } else {
                    // "Latest Updates" Style (Image thumbnail)
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
                }
            }
            
            echo '</div>';
            wp_reset_postdata();
        } else {
            echo '<p class="text-sm text-slate-500">No posts found.</p>';
        }

        echo $args['after_widget'];
    }

    public function form( $instance ) {
        $title    = ! empty( $instance['title'] ) ? $instance['title'] : esc_html__( 'Trending News', 'immi24' );
        $style    = ! empty( $instance['style'] ) ? $instance['style'] : 'text';
        $post_ids = ! empty( $instance['post_ids'] ) ? $instance['post_ids'] : '';
        $cat      = ! empty( $instance['cat'] ) ? $instance['cat'] : 0;
        $count    = ! empty( $instance['count'] ) ? absint( $instance['count'] ) : 5;
        ?>
        <p>
            <label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_attr_e( 'Title:', 'immi24' ); ?></label>
            <input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
        </p>
        <p>
            <label for="<?php echo esc_attr( $this->get_field_id( 'style' ) ); ?>"><?php esc_attr_e( 'Design Style:', 'immi24' ); ?></label>
            <select class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'style' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'style' ) ); ?>">
                <option value="text" <?php selected( $style, 'text' ); ?>><?php esc_html_e( 'Text Only (Trending News Style)', 'immi24' ); ?></option>
                <option value="image" <?php selected( $style, 'image' ); ?>><?php esc_html_e( 'With Thumbnail (Latest Updates Style)', 'immi24' ); ?></option>
            </select>
        </p>
        <p>
            <label for="<?php echo esc_attr( $this->get_field_id( 'post_ids' ) ); ?>"><?php esc_attr_e( 'Manual Post IDs (Comma Separated):', 'immi24' ); ?></label>
            <input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'post_ids' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'post_ids' ) ); ?>" type="text" value="<?php echo esc_attr( $post_ids ); ?>">
            <small><?php esc_html_e( 'Leave blank to automatically show the latest posts. Enter IDs like "12, 45, 68" to manually pick specific posts.', 'immi24' ); ?></small>
        </p>
        <p>
            <label for="<?php echo esc_attr( $this->get_field_id( 'cat' ) ); ?>"><?php esc_attr_e( 'Filter by Category:', 'immi24' ); ?></label>
            <?php
            wp_dropdown_categories( array(
                'show_option_all' => esc_html__( 'All Categories', 'immi24' ),
                'name'            => $this->get_field_name( 'cat' ),
                'id'              => $this->get_field_id( 'cat' ),
                'selected'        => $cat,
                'class'           => 'widefat',
            ) );
            ?>
        </p>
        <p>
            <label for="<?php echo esc_attr( $this->get_field_id( 'count' ) ); ?>"><?php esc_attr_e( 'Number of Posts (if not using IDs):', 'immi24' ); ?></label>
            <input class="tiny-text" id="<?php echo esc_attr( $this->get_field_id( 'count' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'count' ) ); ?>" type="number" step="1" min="1" value="<?php echo esc_attr( $count ); ?>" size="3">
        </p>
        <?php
    }

    public function update( $new_instance, $old_instance ) {
        $instance = array();
        $instance['title']    = ( ! empty( $new_instance['title'] ) ) ? sanitize_text_field( $new_instance['title'] ) : '';
        $instance['style']    = ( ! empty( $new_instance['style'] ) && in_array( $new_instance['style'], array( 'text', 'image' ) ) ) ? $new_instance['style'] : 'text';
        $instance['post_ids'] = ( ! empty( $new_instance['post_ids'] ) ) ? sanitize_text_field( $new_instance['post_ids'] ) : '';
        $instance['cat']      = ( ! empty( $new_instance['cat'] ) ) ? absint( $new_instance['cat'] ) : 0;
        $instance['count']    = ( ! empty( $new_instance['count'] ) ) ? absint( $new_instance['count'] ) : 5;
        return $instance;
    }
}
