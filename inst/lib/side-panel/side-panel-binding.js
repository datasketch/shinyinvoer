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
    
    // Parse menu items from JSON
    var parsedMenuItems = JSON.parse(menuItems || '[]');
    
    // Wait for SidePanel class to be available
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
        
        // Store reference for later use
        el.sidePanelWidget = widget;
      } else {
        // Retry after a short delay if SidePanel is not yet loaded
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
    if (el.sidePanelWidget) {
      el.addEventListener('sidePanelChange', function(event) {
        callback();
      });
    }
  },
  
  unsubscribe: function(el) {
    if (el.sidePanelWidget) {
      el.removeEventListener('sidePanelChange', function(event) {
        // Remove event listener
      });
    }
  },
  
  getState: function(el) {
    return this.getValue(el);
  }
});

// Register the binding
Shiny.inputBindings.register(sidePanelBinding);

