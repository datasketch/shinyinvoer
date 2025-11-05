/**
 * Side Panel Widget
 * Main JavaScript class for side panel functionality
 */
class SidePanel {
  constructor(element, options) {
    this.element = element;
    this.options = Object.assign({
      menuItems: [],
      position: 'left',
      panelWidth: '300px',
      initialOpen: true,
      mainContentId: 'main-content',
      containerId: null,
      buttonText: 'Edit'
    }, options);

    this.isOpen = this.options.initialOpen;
    this.selectedItemId = null;
    
    // Set CSS variable for panel width
    document.documentElement.style.setProperty('--side-panel-width', this.options.panelWidth);
    
    this.init();
  }

  init() {
    this.createToggleButton();
    this.createPanel();
    this.createOverlay();
    this.setupEventListeners();
    this.setInitialState();
  }

  createToggleButton() {
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'side-panel-toggle-container';
    
    // Create button
    const button = document.createElement('button');
    button.className = 'side-panel-toggle-btn';
    button.type = 'button';
    button.setAttribute('aria-label', 'Toggle side panel');
    
    // Add icon to button
    const icon = document.createElement('span');
    icon.className = 'side-panel-toggle-btn-icon';
    const uniqueClipId = `clip0_${this.element.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
    icon.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#${uniqueClipId})">
          <path d="M15.8805 5.10929C16.277 4.71285 16.4998 4.17514 16.4999 3.61443C16.4999 3.05372 16.2773 2.51594 15.8808 2.11941C15.4844 1.72288 14.9467 1.50007 14.386 1.5C13.8253 1.49993 13.2875 1.7226 12.8909 2.11904L2.88145 12.1308C2.70732 12.3044 2.57854 12.5182 2.50645 12.7533L1.5157 16.0173C1.49632 16.0821 1.49485 16.151 1.51146 16.2167C1.52807 16.2823 1.56214 16.3422 1.61005 16.39C1.65796 16.4379 1.71792 16.4718 1.78357 16.4883C1.84922 16.5048 1.91812 16.5033 1.98295 16.4838L5.2477 15.4938C5.48258 15.4224 5.69633 15.2944 5.8702 15.121L15.8805 5.10929Z" stroke="black" stroke-opacity="0.4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11.25 3.75L14.25 6.75" stroke="black" stroke-opacity="0.4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
          <clipPath id="${uniqueClipId}">
            <rect width="18" height="18" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    `;
    
    button.appendChild(icon);
    
    // Add text outside button, to the right
    const text = document.createElement('span');
    text.className = 'side-panel-toggle-text';
    text.textContent = this.options.buttonText || 'Edit';
    
    buttonContainer.appendChild(button);
    buttonContainer.appendChild(text);
    
    this.toggleButton = button;
    this.toggleContainer = buttonContainer;
    this.element.appendChild(buttonContainer);
  }

  createPanel() {
    const panelContainer = document.createElement('div');
    panelContainer.className = 'side-panel-container';
    panelContainer.id = this.element.id + '-panel';
    panelContainer.setAttribute('data-side-panel-id', this.element.id);
    panelContainer.style.width = this.options.panelWidth;
    
    // Determine where to append the panel
    let targetContainer = document.body;
    if (this.options.containerId) {
      const containerElement = document.getElementById(this.options.containerId);
      if (containerElement) {
        targetContainer = containerElement;
        // If inside a container, use absolute positioning
        panelContainer.classList.add('side-panel-in-container');
        // Make sure container has relative positioning
        const containerStyle = window.getComputedStyle(containerElement);
        if (containerStyle.position === 'static') {
          containerElement.style.position = 'relative';
        }
        
        // Ensure container has a defined height - wait for DOM to be ready
        setTimeout(() => {
          const containerStyle = window.getComputedStyle(containerElement);
          const containerHeight = containerStyle.height;
          
          if (!containerHeight || containerHeight === 'auto' || containerHeight === '0px') {
            // Try to get computed height or set a minimum
            const computedHeight = containerElement.offsetHeight || containerElement.scrollHeight;
            if (computedHeight > 0) {
              containerElement.style.height = computedHeight + 'px';
            } else {
              // Set minimum height if container has no height
              containerElement.style.minHeight = '400px';
            }
          }
          
          // Set panel height to match container - use computed height
          const finalHeight = containerElement.offsetHeight || containerElement.scrollHeight;
          if (finalHeight > 0) {
            panelContainer.style.height = finalHeight + 'px';
          } else {
            panelContainer.style.height = '100%';
          }
        }, 100);
      }
    }

    // Create sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'side-panel-sidebar';
    this.sidebar = sidebar;

    // Create menu items
    this.menuItems = this.options.menuItems.map(item => {
      const menuItem = document.createElement('button');
      menuItem.className = 'side-panel-menu-item';
      menuItem.setAttribute('data-item-id', item.id);
      menuItem.setAttribute('aria-label', item.tooltip || item.title);
      menuItem.innerHTML = item.icon || '';
      
      // Add tooltip
      if (item.tooltip) {
        const tooltip = document.createElement('span');
        tooltip.className = 'side-panel-tooltip';
        tooltip.textContent = item.tooltip;
        menuItem.appendChild(tooltip);
      }

      menuItem.addEventListener('click', () => this.selectMenuItem(item.id));
      sidebar.appendChild(menuItem);
      return { element: menuItem, data: item };
    });

    // Create header first (so it can overlay everything)
    const header = document.createElement('div');
    header.className = 'side-panel-header';
    
    const title = document.createElement('h2');
    title.className = 'side-panel-title';
    title.textContent = 'Menu';
    this.titleElement = title;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'side-panel-close-btn';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close panel');
    closeBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    closeBtn.addEventListener('click', () => this.close());

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Create body (sidebar + content)
    const body = document.createElement('div');
    body.className = 'side-panel-body';

    // Create content area
    const content = document.createElement('div');
    content.className = 'side-panel-content';
    this.contentElement = content;

    body.appendChild(sidebar);
    body.appendChild(content);

    // Add header and body to container
    panelContainer.appendChild(header);
    panelContainer.appendChild(body);

    // Add position class to panel container
    panelContainer.classList.add('side-panel-' + this.options.position);
    
    this.panelContainer = panelContainer;
    targetContainer.appendChild(panelContainer);
  }

  createOverlay() {
    // Only create overlay if panel is in document body (not in a container)
    if (this.options.containerId) {
      // No overlay needed when panel is inside a container
      this.overlay = null;
      return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'side-panel-overlay';
    overlay.addEventListener('click', () => this.close());
    this.overlay = overlay;
    document.body.appendChild(overlay);
  }

  setupEventListeners() {
    this.toggleButton.addEventListener('click', () => {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    });

    // Select first menu item by default and load its content
    if (this.menuItems.length > 0 && !this.selectedItemId) {
      const firstItem = this.menuItems[0].data;
      // Use selectMenuItem to ensure content is loaded properly
      this.selectMenuItem(firstItem.id);
    }
  }

  setInitialState() {
    if (this.options.initialOpen) {
      this.open();
      // Select first menu item if panel is initially open
      if (this.menuItems.length > 0) {
        const firstItem = this.menuItems[0];
        console.log('[SidePanel] Initializing with first item:', firstItem.data.id);
        this.selectMenuItem(firstItem.data.id);
      }
    } else {
      this.close();
    }
  }

  open() {
    this.isOpen = true;
    this.panelContainer.classList.add('open');
    this.toggleButton.classList.add('active');
    if (this.overlay) {
      this.overlay.classList.add('active');
    }
    this.shiftMainContent(true);
    this.triggerChange();
  }

  close() {
    this.isOpen = false;
    this.panelContainer.classList.remove('open');
    this.toggleButton.classList.remove('active');
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
    this.shiftMainContent(false);
    this.triggerChange();
  }

  selectMenuItem(itemId) {
    console.log('[SidePanel] selectMenuItem called with itemId:', itemId);
    // Update selected state - first remove active from all items
    this.menuItems.forEach(({ element }) => {
      element.classList.remove('active');
    });
    
    // Update selected state and content
    this.menuItems.forEach(({ element, data }) => {
      if (data.id === itemId) {
        console.log('[SidePanel] Selecting menu item:', data.id, 'with body_html:', !!data.body_html);
        element.classList.add('active');
        this.selectedItemId = itemId;
        this.titleElement.textContent = data.title;
        
        // Clear previous content
        while (this.contentElement.firstChild) {
          this.contentElement.removeChild(this.contentElement.firstChild);
        }
        
        // Render body_html if provided
        if (data.body_html) {
          console.log('[SidePanel] Rendering body_html for item:', data.id);
          // Set innerHTML to the body_html content
          this.contentElement.innerHTML = data.body_html;
          
          // Re-bind Shiny outputs and inputs
          if (window.Shiny) {
            setTimeout(() => {
              if (window.Shiny.bindAll) {
                try {
                  window.Shiny.bindAll(this.contentElement);
                  console.log('[SidePanel] Shiny.bindAll completed');
                } catch (e) {
                  console.error('[SidePanel] Error binding content:', e);
                }
              }
              
              // Trigger shiny:connected event for outputs
              $(this.contentElement).trigger('shiny:connected');
              
              // Wait for uiOutput to render if present
              const uiOutputs = this.contentElement.querySelectorAll('[id^="shiny-output-"]');
              if (uiOutputs.length > 0) {
                console.log('[SidePanel] Found', uiOutputs.length, 'uiOutputs, waiting for render...');
                setTimeout(() => {
                  // Re-bind again after outputs render
                  if (window.Shiny.bindAll) {
                    window.Shiny.bindAll(this.contentElement);
                  }
                  $(this.contentElement).trigger('shiny:connected');
                  $(this.contentElement).trigger('shiny:visualchange');
                }, 300);
              }
            }, 100);
          }
        } else {
          console.log('[SidePanel] No body_html provided for item:', data.id);
        }
      } else {
        element.classList.remove('active');
      }
    });

    this.triggerChange();
  }

  shiftMainContent(shift) {
    const mainContent = document.getElementById(this.options.mainContentId);
    if (mainContent) {
      mainContent.classList.add('main-content-shifted');
      // Add position-specific class
      const positionClass = 'side-panel-' + this.options.position + '-shifted';
      if (shift) {
        mainContent.classList.add('shifted', positionClass);
      } else {
        mainContent.classList.remove('shifted', positionClass);
      }
    }
  }

  triggerChange() {
    // Dispatch custom event for Shiny binding
    const event = new CustomEvent('sidePanelChange', {
      detail: {
        isOpen: this.isOpen,
        selectedItem: this.selectedItemId
      }
    });
    this.element.dispatchEvent(event);
  }

  getValue() {
    return {
      isOpen: this.isOpen,
      selectedItem: this.selectedItemId
    };
  }

  setValue(value) {
    if (value.isOpen !== undefined) {
      if (value.isOpen) {
        this.open();
      } else {
        this.close();
      }
    }
    if (value.selectedItem !== undefined) {
      this.selectMenuItem(value.selectedItem);
    }
  }

  destroy() {
    if (this.panelContainer && this.panelContainer.parentNode) {
      this.panelContainer.parentNode.removeChild(this.panelContainer);
    }
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    if (this.toggleContainer && this.toggleContainer.parentNode) {
      this.toggleContainer.parentNode.removeChild(this.toggleContainer);
    }
  }
}

// Make SidePanel available globally for Shiny binding
if (typeof window !== 'undefined') {
  window.SidePanel = SidePanel;
}

// Export for use in binding (Node.js/CommonJS)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SidePanel;
}

