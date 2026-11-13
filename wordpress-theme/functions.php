<?php
/**
 * DriveRent Theme Functions & Definitions
 * 
 * @package DriveRent
 * @version 2.5
 */

function driverent_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script'
    ));
}
add_action('after_setup_theme', 'driverent_setup');

// Đảm bảo WordPress load module script chính xác
function driverent_script_type_attribute($tag, $handle, $src) {
    if (strpos($src, 'index-') !== false && strpos($src, '.js') !== false) {
        $tag = '<script type="module" crossorigin src="' . esc_url($src) . '"></script>';
    }
    return $tag;
}
add_filter('script_loader_tag', 'driverent_script_type_attribute', 10, 3);
