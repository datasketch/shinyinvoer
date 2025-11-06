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
    // Cache for rendered content per menu item
    this.contentCache = new Map();
    
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
    // Store the initial item to select after pre-rendering
    const initialItemId = this.menuItems.length > 0 ? this.menuItems[0].data.id : null;
    
    // Pre-render all menu items to ensure inputs are registered with default values
    // This happens even if panel is closed, so inputs are available immediately
    if (this.menuItems.length > 0) {
      console.log('[SidePanel] Pre-rendering all menu items to register inputs...');
      this.menuItems.forEach(({ data }) => {
        if (data.body_html) {
          // Pre-render each item (hidden but in DOM) so Shiny can register inputs
          this.preRenderMenuItem(data);
        }
      });
      
      // Wait for all uiOutputs to render, then bind all inputs
      // Pass the initial item ID to restore after rendering
      this.waitForAllOutputsAndBind(initialItemId);
    }
    
    if (this.options.initialOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  preRenderMenuItem(data) {
    // Skip if already cached
    if (this.contentCache.has(data.id)) return;
  
    try {
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'side-panel-item-content';
      contentWrapper.setAttribute('data-item-id', data.id);
  
      // Hidden but in DOM so Shiny can process it
      // Using display: block with opacity: 0 so Shiny processes it
      contentWrapper.style.display = 'block';
      contentWrapper.style.opacity = '0';
      contentWrapper.style.position = 'absolute';
      contentWrapper.style.pointerEvents = 'none';
      contentWrapper.style.left = '-9999px';
      contentWrapper.style.top = '-9999px';
      contentWrapper.style.width = '1px';
      contentWrapper.style.height = '1px';
      contentWrapper.style.overflow = 'hidden';
  
      // Insert HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = data.body_html;
      while (tempDiv.firstChild) contentWrapper.appendChild(tempDiv.firstChild);
  
      this.contentCache.set(data.id, contentWrapper);
      this.contentElement.appendChild(contentWrapper);
  
      // Initial bind to register uiOutputs
      if (window.Shiny && window.Shiny.bindAll) {
        try {
          window.Shiny.bindAll(contentWrapper);
          $(contentWrapper).trigger('shiny:connected');
        } catch (e) {
          console.warn('[SidePanel] Initial Shiny binding failed for', data.id, e);
        }
      }
  
    } catch (e) {
      console.error('[SidePanel] Error pre-rendering menu item:', data.id, e);
    }
  }

  waitForAllOutputsAndBind(initialItemId = null) {
    // First, we need to trigger the server to render all uiOutputs
    // by temporarily "selecting" each item one by one
    const itemsToRender = this.menuItems
      .map(({ data }) => data)
      .filter(item => item.body_html);
    
    if (itemsToRender.length === 0) {
      // No items to render, just select initial item if provided
      if (initialItemId) {
        setTimeout(() => {
          this.selectMenuItem(initialItemId);
        }, 100);
      }
      return;
    }

    console.log('[SidePanel] Triggering server to render all items...');
    
    // Temporarily select each item to trigger server rendering
    let currentIndex = 0;
    const renderNextItem = () => {
      if (currentIndex >= itemsToRender.length) {
        // All items have been "selected", now wait for outputs to render
        console.log('[SidePanel] All items triggered, waiting for outputs to render...');
        this.waitForOutputsToRender(initialItemId);
        return;
      }

      const item = itemsToRender[currentIndex];
      console.log('[SidePanel] Triggering render for item:', item.id);
      
      // Temporarily set as selected (but don't show it visually)
      this.selectedItemId = item.id;
      
      // Trigger change event to notify server
      this.triggerChange();
      
      // Move to next item after a delay
      currentIndex++;
      setTimeout(renderNextItem, 300);
    };

    // Start rendering items
    setTimeout(renderNextItem, 200);
  }

  waitForOutputsToRender(initialItemId = null) {
    // Wait for all uiOutputs to render, then bind all inputs
    const checkAllOutputs = (attempts = 0, maxAttempts = 40) => {
      if (attempts >= maxAttempts) {
        console.warn('[SidePanel] Max attempts reached waiting for all outputs');
        // Final bind attempt
        this.bindAllInputs();
        // Restore initial item selection
        if (initialItemId) {
          setTimeout(() => {
            this.selectMenuItem(initialItemId);
          }, 100);
        }
        return;
      }

      // Check all cached content for uiOutputs
      let allRendered = true;
      let hasAnyOutputs = false;
      
      this.contentCache.forEach((contentWrapper) => {
        const uiOutputs = contentWrapper.querySelectorAll('[id^="shiny-output-"]');
        if (uiOutputs.length > 0) {
          hasAnyOutputs = true;
          uiOutputs.forEach((output) => {
            const innerHTML = output.innerHTML.trim();
            // Check if output has meaningful content
            if (!innerHTML || 
                innerHTML === '' || 
                innerHTML === '<div></div>' || 
                innerHTML === '<div class="shiny-bound-output"></div>') {
              // Check if it has children
              if (output.children.length === 0) {
                allRendered = false;
              }
            }
          });
        }
      });

      if (allRendered || (!hasAnyOutputs && attempts > 10)) {
        console.log('[SidePanel] All outputs rendered, binding all inputs...');
        // All outputs are rendered, bind all inputs
        this.bindAllInputs();
        // Restore initial item selection after binding
        if (initialItemId) {
          setTimeout(() => {
            this.selectMenuItem(initialItemId);
          }, 200);
        }
      } else {
        // Check again after a delay
        setTimeout(() => checkAllOutputs(attempts + 1, maxAttempts), 200);
      }
    };

    // Start checking after initial delay
    setTimeout(() => checkAllOutputs(), 500);
  }

  bindAllInputs() {
    // Bind all inputs in all cached content
    if (!window.Shiny || !window.Shiny.bindAll) {
      return;
    }

    this.contentCache.forEach((contentWrapper) => {
      try {
        window.Shiny.bindAll(contentWrapper);
        $(contentWrapper).trigger('shiny:connected');
        $(contentWrapper).trigger('shiny:visualchange');
      } catch (e) {
        console.warn('[SidePanel] Error binding inputs for item:', contentWrapper.getAttribute('data-item-id'), e);
      }
    });

    // Also bind the entire content element
    try {
      window.Shiny.bindAll(this.contentElement);
      $(this.contentElement).trigger('shiny:connected');
    } catch (e) {
      console.warn('[SidePanel] Error binding content element:', e);
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
        
        // Hide all cached content first (but keep in DOM)
        this.contentCache.forEach((cachedContent) => {
          if (cachedContent && cachedContent.parentNode === this.contentElement) {
            // Hide but keep in DOM to preserve input values
            cachedContent.style.display = 'none';
            cachedContent.style.opacity = '0';
            cachedContent.style.pointerEvents = 'none';
            // Don't remove from DOM, just hide it
          }
        });
        
        // Check if content is already cached
        let contentWrapper = this.contentCache.get(itemId);
        
        if (!contentWrapper && data.body_html) {
          console.log('[SidePanel] Rendering new body_html for item:', data.id);
          try {
            // Create a wrapper div for this item's content
            contentWrapper = document.createElement('div');
            contentWrapper.className = 'side-panel-item-content';
            contentWrapper.setAttribute('data-item-id', itemId);
            
            // Make it invisible but in DOM so Shiny can process uiOutputs
            // Using opacity: 0 instead of visibility: hidden so Shiny processes it
            contentWrapper.style.display = 'block';
            contentWrapper.style.opacity = '1';
            contentWrapper.style.position = 'relative';
            contentWrapper.style.pointerEvents = 'auto';
            contentWrapper.style.left = 'auto';
            
            // Set innerHTML to the body_html content
            // Use a temporary container to safely parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data.body_html;
            while (tempDiv.firstChild) {
              contentWrapper.appendChild(tempDiv.firstChild);
            }
            
            // Cache the content
            this.contentCache.set(itemId, contentWrapper);
            
            // Append to content element (temporarily hidden)
            this.contentElement.appendChild(contentWrapper);
            
            // Re-bind Shiny outputs and inputs with proper initialization
            this.initializeShinyContent(contentWrapper);
          } catch (e) {
            console.error('[SidePanel] Error rendering body_html for item:', data.id, e);
            console.error('[SidePanel] Error details:', e.message, e.stack);
            // If there's an error, still cache an empty wrapper to avoid retrying
            if (!contentWrapper) {
              contentWrapper = document.createElement('div');
              contentWrapper.className = 'side-panel-item-content';
              contentWrapper.setAttribute('data-item-id', itemId);
              this.contentCache.set(itemId, contentWrapper);
            }
          }
        } else if (contentWrapper) {
          console.log('[SidePanel] Using cached content for item:', data.id);
          // Show cached content - restore normal visibility
          contentWrapper.style.display = 'block';
          contentWrapper.style.opacity = '1';
          contentWrapper.style.position = 'relative';
          contentWrapper.style.pointerEvents = 'auto';
          contentWrapper.style.left = 'auto';
          contentWrapper.style.top = 'auto';
          contentWrapper.style.width = 'auto';
          contentWrapper.style.height = 'auto';
          contentWrapper.style.overflow = 'visible';
          
          // Ensure it's in the DOM (in case it was removed somehow)
          if (!contentWrapper.parentNode) {
            this.contentElement.appendChild(contentWrapper);
          }
          
          // Re-bind Shiny to ensure all widgets are registered
          if (window.Shiny && window.Shiny.bindAll) {
            setTimeout(() => {
              try {
                window.Shiny.bindAll(contentWrapper);
                $(contentWrapper).trigger('shiny:connected');
                // Trigger visual change to ensure Shiny recognizes the widgets
                $(contentWrapper).trigger('shiny:visualchange');
              } catch (e) {
                console.error('[SidePanel] Error re-binding cached content:', e);
              }
            }, 50);
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

  initializeShinyContent(contentWrapper, isPreRender = false) {
    if (!window.Shiny) {
      return;
    }

    // Initial bind after a short delay to ensure DOM is ready
    setTimeout(() => {
      if (window.Shiny.bindAll) {
        try {
          window.Shiny.bindAll(contentWrapper);
          console.log('[SidePanel] Initial Shiny.bindAll completed');
        } catch (e) {
          console.error('[SidePanel] Error binding content:', e);
        }
      }
      
      // Trigger shiny:connected event for outputs
      $(contentWrapper).trigger('shiny:connected');
      
      // Check for uiOutput elements that need to render
      const uiOutputs = contentWrapper.querySelectorAll('[id^="shiny-output-"]');
      if (uiOutputs.length > 0) {
        console.log('[SidePanel] Found', uiOutputs.length, 'uiOutputs, waiting for render...');
        
        // Function to check if uiOutputs have rendered and initialize all widgets
        const checkAndInitialize = (attempts = 0, maxAttempts = 20) => {
          if (attempts >= maxAttempts) {
            console.warn('[SidePanel] Max attempts reached waiting for uiOutput render');
            // Final bind attempt
            if (window.Shiny.bindAll) {
              window.Shiny.bindAll(contentWrapper);
            }
            $(contentWrapper).trigger('shiny:connected');
            return;
          }

          // Check if uiOutputs have meaningful content (rendered)
          let hasRenderedContent = false;
          
          uiOutputs.forEach((output) => {
            // Check if output has meaningful content (not just empty divs)
            const innerHTML = output.innerHTML.trim();
            if (innerHTML && 
                innerHTML !== '' && 
                innerHTML !== '<div></div>' && 
                innerHTML !== '<div class="shiny-bound-output"></div>') {
              hasRenderedContent = true;
            }
            
            // Also check for any child elements that indicate rendering
            if (output.children.length > 0) {
              hasRenderedContent = true;
            } else {
              // Check if there are any elements inside (including text nodes with content)
              const firstChild = output.firstElementChild;
              if (firstChild !== null) {
                hasRenderedContent = true;
              }
            }
          });

          // If content is rendered or we've tried enough times, initialize
          if (hasRenderedContent || attempts > 5) {
            if (!isPreRender) {
              console.log('[SidePanel] uiOutputs rendered, initializing all widgets...');
            }
            
            // Make content visible now that it's rendered (only if not pre-rendering)
            if (!isPreRender) {
              contentWrapper.style.display = 'block';
              contentWrapper.style.opacity = '1';
              contentWrapper.style.position = 'relative';
              contentWrapper.style.pointerEvents = 'auto';
              contentWrapper.style.left = 'auto';
            }
            
            // Re-bind all widgets after outputs render
            if (window.Shiny.bindAll) {
              window.Shiny.bindAll(contentWrapper);
            }
            $(contentWrapper).trigger('shiny:connected');
            $(contentWrapper).trigger('shiny:visualchange');
            
            // Additional bind after a short delay to ensure all widgets are registered
            setTimeout(() => {
              if (window.Shiny.bindAll) {
                window.Shiny.bindAll(contentWrapper);
              }
              $(contentWrapper).trigger('shiny:connected');
            }, 150);
          } else {
            // Check again after a delay
            setTimeout(() => checkAndInitialize(attempts + 1, maxAttempts), 150);
          }
        };

        // Start checking after initial delay
        setTimeout(() => checkAndInitialize(), 200);
      } else {
        // No uiOutputs, but still ensure all widgets are bound
        // Make content visible (only if not pre-rendering)
        if (!isPreRender) {
          contentWrapper.style.display = 'block';
          contentWrapper.style.opacity = '1';
          contentWrapper.style.position = 'relative';
          contentWrapper.style.pointerEvents = 'auto';
          contentWrapper.style.left = 'auto';
        }
        
        setTimeout(() => {
          if (window.Shiny.bindAll) {
            window.Shiny.bindAll(contentWrapper);
          }
          $(contentWrapper).trigger('shiny:connected');
        }, 150);
      }
    }, 100);
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

