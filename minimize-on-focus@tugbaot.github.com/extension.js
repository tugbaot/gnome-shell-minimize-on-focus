import Meta from 'gi://Meta';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class MinimizeOnFocusExtension extends Extension {
    enable() {
        this._minimizing = false;

        // Applications which trigger the minimize behaviour.
        this._triggerApps = [
            'nemo',
            'sakura',
        ];

        // Applications which should never be minimized.
        this._excludedApps = [
            'mpv',
        ];

        this._focusChangedId =
            global.display.connect('notify::focus-window', () => {
                this._onFocusChanged();
            });
    }

    disable() {
        if (this._focusChangedId) {
            global.display.disconnect(this._focusChangedId);
            this._focusChangedId = null;
        }

        this._minimizing = false;
    }

    _onFocusChanged() {
        if (this._minimizing)
            return;

        const focusedWindow = global.display.focus_window;

        if (!focusedWindow)
            return;

        // Only act when one of our trigger applications is focused.
        if (!this._isTriggerApplication(focusedWindow))
            return;

        // Only act on normal application windows.
        if (focusedWindow.get_window_type() !== Meta.WindowType.NORMAL)
            return;

        // Only act when the trigger application is fully maximized.
        if (!focusedWindow.is_maximized())
            return;

        const workspace = focusedWindow.get_workspace();

        if (!workspace)
            return;

        this._minimizing = true;

        try {
            const windows = global.display.list_all_windows();

            for (const window of windows) {
                // Don't touch the focused window.
                if (window === focusedWindow)
                    continue;

                // Only minimise normal application windows.
                if (window.get_window_type() !== Meta.WindowType.NORMAL)
                    continue;

                // Only windows on the same workspace.
                if (window.get_workspace() !== workspace)
                    continue;

                // Never minimise excluded applications.
                if (this._isExcludedApplication(window))
                    continue;

                // Don't bother with already-minimized windows.
                if (window.minimized)
                    continue;

                window.minimize();
            }
        } finally {
            this._minimizing = false;
        }
    }

    _isTriggerApplication(window) {
        const wmClass = window.get_wm_class();

        if (!wmClass)
            return false;

        return this._triggerApps.includes(wmClass.toLowerCase());
    }

    _isExcludedApplication(window) {
        const wmClass = window.get_wm_class();

        if (!wmClass)
            return false;

        return this._excludedApps.includes(wmClass.toLowerCase());
    }
}