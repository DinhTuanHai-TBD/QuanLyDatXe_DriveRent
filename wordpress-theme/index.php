<?php
/**
 * DriveRent WordPress Theme
 * 
 * @package DriveRent
 * @version 2.5
 */

// Chống cache trình duyệt đối với trang HTML
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

$theme_dir = get_template_directory();
$theme_uri = get_template_directory_uri();

// Tu dong tim file JS va CSS moi nhat duoc Vite bien dich
$js_files = glob($theme_dir . '/assets/index-*.js');
$css_files = glob($theme_dir . '/assets/index-*.css');

$js_url = '';
if (!empty($js_files)) {
    usort($js_files, function($a, $b) {
        return filemtime($b) - filemtime($a);
    });
    $js_url = $theme_uri . '/assets/' . basename($js_files[0]) . '?v=' . filemtime($js_files[0]);
}

$css_url = '';
if (!empty($css_files)) {
    usort($css_files, function($a, $b) {
        return filemtime($b) - filemtime($a);
    });
    $css_url = $theme_uri . '/assets/' . basename($css_files[0]) . '?v=' . filemtime($css_files[0]);
}
?><!doctype html>
<html <?php language_attributes(); ?>>
  <head>
    <meta charset="<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php wp_title('|', true, 'right'); ?><?php bloginfo('name'); ?> - Thuê Xe Máy & Ô Tô Tự Lái</title>
    <link rel="icon" type="image/png" href="<?php echo esc_url($theme_uri); ?>/favicon.png" />
    <link rel="shortcut icon" href="<?php echo esc_url($theme_uri); ?>/favicon.ico" />
    <meta name="description" content="Nha Trang Car / DriveRent - Dịch vụ cho thuê xe máy, ô tô và xe điện tự lái chuyên nghiệp hàng đầu. Đặt xe trực tuyến nhanh chóng, xe đời mới sạch sẽ, giao nhận tận nơi." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <?php if ($js_url): ?>
    <script type="module" crossorigin src="<?php echo esc_url($js_url); ?>"></script>
    <?php endif; ?>
    <?php if ($css_url): ?>
    <link rel="stylesheet" crossorigin href="<?php echo esc_url($css_url); ?>">
    <?php endif; ?>
    
    <?php wp_head(); ?>
  </head>
  <body <?php body_class('bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white'); ?>>
    <div id="root"></div>
    <?php wp_footer(); ?>
  </body>
</html>
