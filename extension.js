/* extension.js */

const { GObject, St } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const SysActions = imports.misc.systemActions;
const SysMenu = Main.panel.statusArea.aggregateMenu._system.menu;
const Sys = Main.panel.statusArea.aggregateMenu._system;

let _origPowerOffItem;
let _bottomPowerOffItem;
let _systemActions = new SysActions.getDefault();

function init() {

	_origPowerOffItem = Sys._powerOffItem;

	_bottomPowerOffItem = new PopupMenu.PopupImageMenuItem(_('Power Off…'), 'system-shutdown-symbolic');

	_bottomPowerOffItem.connect('activate', () => {
		_systemActions.activatePowerOff();
	});

	_systemActions.bind_property('can-power-off',
	                         _bottomPowerOffItem,
	                         'visible',
	                         GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE);
}

function enable() {

	Sys._sessionSubMenu.icon.set_icon_name('avatar-default-symbolic');
	Sys._sessionSubMenu.label.set_text(_('Log Out'));
	Sys._powerOffItem.get_parent().actor.remove_child(Sys._powerOffItem);
	SysMenu.addMenuItem(_bottomPowerOffItem); 
}

function disable() {

	SysMenu.actor.remove_child(_bottomPowerOffItem);
	Sys._restartItem.get_parent().actor.insert_child_above(_origPowerOffItem, Sys._restartItem);
	Sys._sessionSubMenu.icon.set_icon_name('system-shutdown-symbolic');
	Sys._sessionSubMenu.label.set_text(_('Power Off / Log Out'));
}
