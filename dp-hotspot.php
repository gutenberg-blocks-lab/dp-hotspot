<?php
/**
 * Plugin Name:       DP Hotspot
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dp-hotspot
 *
 * @package           create-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * For plugin to work on multiple installs replace 'UNIQUE_PLUGIN_NAME'
 * Update plugin _VER on the line 32
 * Update plugin _REMOTE_URL on the line 34
 */
$plugin_prefix = 'DPHOTSPOTBLOCK';

define($plugin_prefix . '_DIR', plugin_basename(__DIR__));
define($plugin_prefix . '_BASE', plugin_basename(__FILE__));
define($plugin_prefix . '_PATH', plugin_dir_path(__FILE__));
define($plugin_prefix . '_VER', '1.0.0');
define($plugin_prefix . '_CACHE_KEY', 'dphotshpoblock-cache-key-for-plugin');
define($plugin_prefix . '_REMOTE_URL', 'http://selfhost.dplugins.com/wp-content/uploads/plugins/8/info.json');

require constant($plugin_prefix . '_PATH') . 'inc/update.php';

new DPUpdateChecker(
	constant($plugin_prefix . '_DIR'),
	constant($plugin_prefix . '_VER'),
	constant($plugin_prefix . '_CACHE_KEY'),
	constant($plugin_prefix . '_REMOTE_URL'),
	constant($plugin_prefix . '_BASE')
);


/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function hotspot_hotspot_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'hotspot_hotspot_block_init' );
