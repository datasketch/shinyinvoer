// Shiny input binding for side panel widget
var sidePanelBinding = new Shiny.InputBinding();

$.extend(sidePanelBinding, {
  find: function(scope) {
    return $(scope).find('.side-panel-widget');
  },

  initialize: function(el) {
    var menuItems = el.dataset.menuItems;
    var position = el.dataset.position || 'left';
    var panelWidth = el.dataset.panelWidth || '300px';
    var initialOpen = el.dataset.initialOpen === 'true';
    var mainContentId = el.dataset.mainContentId || 'main-content';
    var containerId = el.dataset.containerId || null;
    var buttonText = el.dataset.buttonText || 'Edit';

    var parsedMenuItems = JSON.parse(menuItems || '[]');

    var initWidget = function() {
      var SidePanelClass = window.SidePanel || (typeof SidePanel !== 'undefined' ? SidePanel : null);
      if (SidePanelClass) {
        var widget = new SidePanelClass(el, {
          menuItems: parsedMenuItems,
          position: position,
          panelWidth: panelWidth,
          initialOpen: initialOpen,
          mainContentId: mainContentId,
          containerId: containerId,
          buttonText: buttonText
        });

        // Guardar referencia
        el.sidePanelWidget = widget;

        // 🔥 Forzar binding de inputs después del render inicial
        setTimeout(function() {
          if (window.Shiny && window.Shiny.bindAll) {
            try {
              console.log('[SidePanel] Rebinding inputs after init');
              const scope = containerId
                ? document.getElementById(containerId)
                : el.parentElement;
              window.Shiny.bindAll(scope || document.body);
              $(scope || document.body).trigger('shiny:visualchange');
            } catch (e) {
              console.warn('[SidePanel] Rebind failed', e);
            }
          }
        }, 300);
      } else {
        setTimeout(initWidget, 50);
      }
    };

    initWidget();
  },

  getValue: function(el) {
    if (el.sidePanelWidget) {
      return el.sidePanelWidget.getValue();
    }
    return { isOpen: false, selectedItem: null };
  },

  setValue: function(el, value) {
    if (el.sidePanelWidget) {
      el.sidePanelWidget.setValue(value);
    }
  },

  receiveMessage: function(el, data) {
    if (el.sidePanelWidget) {
      var value = {};
      if (data.open !== undefined) {
        value.isOpen = data.open;
      }
      if (data.selectedItem !== undefined) {
        value.selectedItem = data.selectedItem;
      }
      if (Object.keys(value).length > 0) {
        el.sidePanelWidget.setValue(value);
      }
    }
  },

  subscribe: function(el, callback) {
    el.addEventListener('sidePanelChange', function() {
      callback();
    });
  },

  unsubscribe: function(el) {
    el.removeEventListener('sidePanelChange', function() {});
  },

  getState: function(el) {
    return this.getValue(el);
  }
});

// Register the binding
Shiny.inputBindings.register(sidePanelBinding);
