/**
 * Side Panel Widget
 * Main JavaScript class for side panel functionality
 */
class SidePanel {
  constructor(element, options) {
    // Validate element is a valid DOM node
    if (!element || !(element instanceof Node) || element.nodeType !== Node.ELEMENT_NODE) {
      console.error('[SidePanel] Invalid element provided. Expected a valid DOM element.');
      throw new Error('SidePanel: element must be a valid DOM element');
    }

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
    // Flag to prevent accidental double destruction
    this._destroyed = false;
    // Cache for rendered content per menu item
    this.contentCache = new Map();
    // Track pending timeouts for cleanup
    this.bindingTimeouts = new Map(); // itemId -> timeoutId
    this.bindingTimeout = null; // Debounce timeout for batch binding
    // Track active polling intervals for cleanup
    this.activeIntervals = new Set(); // Set of interval IDs
    // Store event handler references for cleanup
    this.eventHandlers = {
      toggleClick: null,
      closeClick: null,
      overlayClick: null,
      menuItemClicks: new Map() // itemId -> handler
    };
    // Cache Shiny API for performance
    this.shiny = window.Shiny || null;
    this.shinyBindAll = this.shiny && this.shiny.bindAll ? this.shiny.bindAll : null;
    this.shinySetInputValue = this.shiny && this.shiny.setInputValue ? this.shiny.setInputValue : null;
    // Cache main content element reference
    this.mainContent = null;
    // Debounce timeout for triggerChange
    this.triggerChangeTimeout = null;
    
    // Set CSS variable for panel width
    document.documentElement.style.setProperty('--side-panel-width', this.options.panelWidth);
    
    this.init();
  }

  init() {
    // Store reference to instance on element for debugging and to prevent leaks
    // Only if element is still valid and in DOM
    if (this.element && this.element.nodeType === Node.ELEMENT_NODE) {
      try {
        this.element.sidePanelWidget = this;
      } catch (e) {
        console.warn('[SidePanel] Could not store widget reference on element:', e);
      }
    }
    
    // Cache main content element reference
    if (this.options.mainContentId) {
      this.mainContent = document.getElementById(this.options.mainContentId);
    }
    
    this.createToggleButton();
    this.createPanel();
    this.createOverlay();
    this.setupEventListeners();
    this.setInitialState();
  }

  /**
   * Check if a uiOutput element has rendered content
   * @param {HTMLElement} output - The output element to check
   * @returns {boolean} True if output has meaningful content
   */
  hasRenderedOutput(output) {
    const innerHTML = output.innerHTML.trim();
    // Check if output has meaningful content (not just empty divs)
    if (innerHTML && 
        innerHTML !== '' && 
        innerHTML !== '<div></div>' && 
        innerHTML !== '<div class="shiny-bound-output"></div>') {
      return true;
    }
    
    // Check for child elements
    if (output.children.length > 0) {
      return true;
    }
    
    // Check for first element child
    return output.firstElementChild !== null;
  }

  /**
   * Promise-based delay helper
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Promise that resolves after the delay
   */
  delay(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
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

      // Store handler reference for cleanup
      const clickHandler = () => this.selectMenuItem(item.id);
      this.eventHandlers.menuItemClicks.set(item.id, clickHandler);
      menuItem.addEventListener('click', clickHandler);
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
    // Store handler reference for cleanup
    this.eventHandlers.closeClick = () => this.close();
    closeBtn.addEventListener('click', this.eventHandlers.closeClick);

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
    // Store handler reference for cleanup
    this.eventHandlers.overlayClick = () => this.close();
    overlay.addEventListener('click', this.eventHandlers.overlayClick);
    this.overlay = overlay;
    document.body.appendChild(overlay);
  }

  setupEventListeners() {
    // Store handler reference for cleanup
    this.eventHandlers.toggleClick = () => {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    };
    this.toggleButton.addEventListener('click', this.eventHandlers.toggleClick);

    // Note: Initial item selection is handled in setInitialState()
    // after pre-rendering to avoid redundant calls and flicker
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

  /**
   * Centralized method to bind Shiny content with debouncing and state tracking
   * Uses __bound property on element to track binding state
   * @param {HTMLElement} contentWrapper - The content element to bind
   * @param {string} itemId - The menu item ID (for timeout tracking)
   * @param {boolean} force - Force binding even if already bound
   * @param {number} delay - Delay in milliseconds before binding
   */
  bindShinyContent(contentWrapper, itemId, force = false, delay = 0) {
    if (!this.shinyBindAll || !contentWrapper) {
      return;
    }

    // Skip if already bound and not forcing
    if (contentWrapper.__bound && !force) {
      return;
    }

    // If forcing, reset bound state
    if (force) {
      contentWrapper.__bound = false;
    }

    // Clear existing timeout if any
    if (this.bindingTimeouts.has(itemId)) {
      clearTimeout(this.bindingTimeouts.get(itemId));
      this.bindingTimeouts.delete(itemId);
    }

    // Create binding function
    const performBinding = () => {
      try {
        // Only bind if element is still in DOM and not already bound
        if (contentWrapper.parentNode && !contentWrapper.__bound) {
          this.shinyBindAll(contentWrapper);
          // Use native event instead of jQuery
          contentWrapper.dispatchEvent(new CustomEvent('shiny:connected', { bubbles: true }));
          contentWrapper.__bound = true;
        }
        // Clean up timeout tracking
        this.bindingTimeouts.delete(itemId);
      } catch (e) {
        console.warn('[SidePanel] Error binding content for item:', itemId, e);
        this.bindingTimeouts.delete(itemId);
      }
    };

    // Schedule binding with delay
    if (delay > 0) {
      const timeoutId = setTimeout(performBinding, delay);
      this.bindingTimeouts.set(itemId, timeoutId);
    } else {
      performBinding();
    }
  }

  /**
   * Batch bind multiple items with debouncing
   * @param {Array<string>} itemIds - Array of item IDs to bind
   * @param {number} delay - Delay in milliseconds before binding
   */
  batchBindItems(itemIds, delay = 100) {
    if (!this.shinyBindAll) {
      return;
    }

    // Clear existing batch timeout
    if (this.bindingTimeout) {
      clearTimeout(this.bindingTimeout);
    }

    // Schedule batch binding
    this.bindingTimeout = setTimeout(() => {
      itemIds.forEach(itemId => {
        const contentWrapper = this.contentCache.get(itemId);
        if (contentWrapper && !contentWrapper.__bound) {
          this.bindShinyContent(contentWrapper, itemId, false, 0);
        }
      });
      this.bindingTimeout = null;
    }, delay);
  }

  preRenderMenuItem(data) {
    // Skip if already cached
    if (this.contentCache.has(data.id)) return;
  
    try {
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'side-panel-item-content side-panel-hidden-offscreen';
      contentWrapper.setAttribute('data-item-id', data.id);
  
      // Insert HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = data.body_html;
      while (tempDiv.firstChild) contentWrapper.appendChild(tempDiv.firstChild);
  
      this.contentCache.set(data.id, contentWrapper);
      this.contentElement.appendChild(contentWrapper);
  
      // Use centralized binding method
      this.bindShinyContent(contentWrapper, data.id, false, 50);
  
    } catch (e) {
      console.error('[SidePanel] Error pre-rendering menu item:', data.id, e);
    }
  }

  waitForAllOutputsAndBind(initialItemId = null) {
    // First, we need to trigger the server to render all uiOutputs
    // by requesting render for each item one by one (without changing selection)
    const itemsToRender = this.menuItems
      .map(({ data }) => data)
      .filter(item => item.body_html);
    
    if (itemsToRender.length === 0) {
      // No items to render, just select initial item if provided
      if (initialItemId) {
        this.delay(100).then(() => this.selectMenuItem(initialItemId));
      }
      return Promise.resolve();
    }

    console.log('[SidePanel] Triggering server to render all items...');
    
    // Request render for each item sequentially using Promise chain
    return new Promise((resolve) => {
      let currentIndex = 0;
      
      const triggerNextItem = () => {
        if (currentIndex >= itemsToRender.length) {
          // All items have been requested for render, now wait for outputs to render
          console.log('[SidePanel] All items triggered, waiting for outputs to render...');
          this.waitForOutputsToRender(initialItemId).then(resolve);
          return;
        }

        const item = itemsToRender[currentIndex];
        console.log('[SidePanel] Requesting render for item:', item.id);
        
        // Trigger change event with renderOnly flag (doesn't change selectedItemId)
        this.triggerChange({ renderOnly: true, renderItemId: item.id });
        
        currentIndex++;
        this.delay(300).then(triggerNextItem);
      };

      // Start after initial delay
      this.delay(200).then(triggerNextItem);
    });
  }

  waitForOutputsToRender(initialItemId = null) {
    return new Promise((resolve) => {
      const start = Date.now();
      const interval = setInterval(() => {
        let allRendered = true;
        let hasAnyOutputs = false;

        this.contentCache.forEach((contentWrapper) => {
          const uiOutputs = contentWrapper.querySelectorAll('[id^="shiny-output-"]');
          if (uiOutputs.length > 0) {
            hasAnyOutputs = true;
            uiOutputs.forEach((output) => {
              if (!this.hasRenderedOutput(output)) {
                allRendered = false;
              }
            });
          }
        });

        const elapsed = Date.now() - start;

        if (allRendered || (!hasAnyOutputs && elapsed > 2000)) {
          clearInterval(interval);
          this.activeIntervals.delete(interval);
          console.log('[SidePanel] All outputs rendered, binding all inputs...');
          this.bindAllInputs();
          if (initialItemId) {
            this.delay(150).then(() => this.selectMenuItem(initialItemId));
          }
          resolve();
        } else if (elapsed > 10000) {
          // Timeout max
          clearInterval(interval);
          this.activeIntervals.delete(interval);
          console.warn('[SidePanel] Timeout waiting for all outputs');
          this.bindAllInputs();
          if (initialItemId) {
            this.delay(150).then(() => this.selectMenuItem(initialItemId));
          }
          resolve();
        }
      }, 200);

      // Track interval for cleanup
      this.activeIntervals.add(interval);
    });
  }

  bindAllInputs() {
    // Use batch binding to avoid redundant calls
    const itemIds = Array.from(this.contentCache.keys());
    this.batchBindItems(itemIds, 100);

    // Also bind the entire content element (only once)
    if (this.shinyBindAll && this.contentElement) {
      try {
        this.shinyBindAll(this.contentElement);
        this.contentElement.dispatchEvent(new CustomEvent('shiny:connected', { bubbles: true }));
      } catch (e) {
        console.warn('[SidePanel] Error binding content element:', e);
      }
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
    
    // Single iteration to update all menu items and handle selection
    let selectedData = null;
    this.menuItems.forEach(({ element, data }) => {
      if (data.id === itemId) {
        element.classList.add('active');
        selectedData = data;
      } else {
        element.classList.remove('active');
      }
    });
    
    if (!selectedData) {
      console.warn('[SidePanel] Menu item not found:', itemId);
      return;
    }
    
    console.log('[SidePanel] Selecting menu item:', selectedData.id, 'with body_html:', !!selectedData.body_html);
    this.selectedItemId = itemId;
    this.titleElement.textContent = selectedData.title;
    
    // Hide all cached content first (but keep in DOM to preserve input values)
    // Only change CSS classes, do NOT modify innerHTML
    this.contentCache.forEach((cachedContent) => {
      if (cachedContent && cachedContent.parentNode === this.contentElement) {
        // Hide but keep in DOM to preserve input values
        cachedContent.classList.remove('side-panel-visible');
        cachedContent.classList.add('side-panel-hidden-offscreen');
      }
    });
    
    // Check if content is already cached
    let contentWrapper = this.contentCache.get(itemId);
    
    if (!contentWrapper && selectedData.body_html) {
      console.log('[SidePanel] Rendering new body_html for item:', selectedData.id);
      try {
        // Create a wrapper div for this item's content
        contentWrapper = document.createElement('div');
        contentWrapper.className = 'side-panel-item-content side-panel-visible';
        contentWrapper.setAttribute('data-item-id', itemId);
        
        // Set innerHTML to the body_html content
        // Use a temporary container to safely parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = selectedData.body_html;
        while (tempDiv.firstChild) {
          contentWrapper.appendChild(tempDiv.firstChild);
        }
        
        // Cache the content
        this.contentCache.set(itemId, contentWrapper);
        
        // Append to content element
        this.contentElement.appendChild(contentWrapper);
        
        // Re-bind Shiny outputs and inputs with proper initialization
        this.initializeShinyContent(contentWrapper);
      } catch (e) {
        console.error('[SidePanel] Error rendering body_html for item:', selectedData.id, e);
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
      console.log('[SidePanel] Using cached content for item:', selectedData.id);
      // Show cached content - restore normal visibility
      contentWrapper.classList.remove('side-panel-hidden-offscreen');
      contentWrapper.classList.add('side-panel-visible');
      
      // Ensure it's in the DOM (in case it was removed somehow)
      if (!contentWrapper.parentNode) {
        this.contentElement.appendChild(contentWrapper);
      }
      
      // Use centralized binding method (only if not already bound)
      // Trigger visual change to ensure Shiny recognizes the widgets
      // Check if already bound to avoid unnecessary setTimeout
      if (!contentWrapper.__bound) {
        this.delay(50).then(() => {
          this.bindShinyContent(contentWrapper, itemId, false, 0);
          if (contentWrapper) {
            contentWrapper.dispatchEvent(new CustomEvent('shiny:visualchange', { bubbles: true }));
          }
        });
      } else {
        // Already bound, just trigger visual change
        this.delay(50).then(() => {
          if (contentWrapper) {
            contentWrapper.dispatchEvent(new CustomEvent('shiny:visualchange', { bubbles: true }));
          }
        });
      }
    } else {
      console.log('[SidePanel] No body_html provided for item:', selectedData.id);
    }

    this.triggerChange();
  }

  shiftMainContent(shift) {
    // Use cached reference or get it if not cached
    if (!this.mainContent && this.options.mainContentId) {
      this.mainContent = document.getElementById(this.options.mainContentId);
    }
    
    if (this.mainContent) {
      this.mainContent.classList.add('main-content-shifted');
      // Add position-specific class
      const positionClass = 'side-panel-' + this.options.position + '-shifted';
      if (shift) {
        this.mainContent.classList.add('shifted', positionClass);
      } else {
        this.mainContent.classList.remove('shifted', positionClass);
      }
    }
  }

  initializeShinyContent(contentWrapper, isPreRender = false) {
    if (!this.shiny || !contentWrapper) {
      return;
    }

    const itemId = contentWrapper.getAttribute('data-item-id');
    if (!itemId) {
      console.warn('[SidePanel] Content wrapper missing data-item-id');
      return;
    }

    // Initial bind after a short delay to ensure DOM is ready
    // Use centralized binding method
    this.bindShinyContent(contentWrapper, itemId, false, 100);
    
    // Check for uiOutput elements that need to render
    const uiOutputs = contentWrapper.querySelectorAll('[id^="shiny-output-"]');
    if (uiOutputs.length > 0) {
      console.log('[SidePanel] Found', uiOutputs.length, 'uiOutputs, waiting for render...');
      
      return new Promise((resolve) => {
        const start = Date.now();
        let attempts = 0;
        
        // Shared check function to avoid duplication
        const checkOutputs = () => {
          let hasRenderedContent = false;
          uiOutputs.forEach((output) => {
            if (this.hasRenderedOutput(output)) {
              hasRenderedContent = true;
            }
          });
          return hasRenderedContent;
        };
        
        // Shared completion function
        const complete = () => {
          clearInterval(interval);
          this.activeIntervals.delete(interval);
          
          if (!isPreRender) {
            console.log('[SidePanel] uiOutputs rendered, initializing all widgets...');
            contentWrapper.classList.remove('side-panel-hidden-offscreen');
            contentWrapper.classList.add('side-panel-visible');
          }
          
          // Use centralized binding method (force rebind after outputs render)
          this.bindShinyContent(contentWrapper, itemId, true, 0);
          
          // Trigger visual change event using native events
          if (contentWrapper) {
            contentWrapper.dispatchEvent(new CustomEvent('shiny:visualchange', { bubbles: true }));
          }
          
          resolve();
        };
        
        // Shared timeout handler
        const handleTimeout = () => {
          clearInterval(interval);
          this.activeIntervals.delete(interval);
          console.warn('[SidePanel] Timeout waiting for uiOutput render');
          this.bindShinyContent(contentWrapper, itemId, true, 0);
          resolve();
        };
        
        const interval = setInterval(() => {
          attempts++;
          const elapsed = Date.now() - start;

          if (checkOutputs() || attempts > 5) {
            complete();
          } else if (elapsed > 6000) {
            handleTimeout();
          }
        }, 150);

        // Track interval for cleanup
        this.activeIntervals.add(interval);
      });
    } else {
      // No uiOutputs, but still ensure all widgets are bound
      // Make content visible (only if not pre-rendering)
      if (!isPreRender) {
        contentWrapper.classList.remove('side-panel-hidden-offscreen');
        contentWrapper.classList.add('side-panel-visible');
      }
      
      // Use centralized binding method
      this.bindShinyContent(contentWrapper, itemId, false, 150);
      return Promise.resolve();
    }
  }

  triggerChange(options = {}) {
    // Build state object once
    const stateValue = {
      isOpen: this.isOpen,
      selectedItem: this.selectedItemId
    };
    
    // If renderOnly is true, include render request info without changing state
    if (options.renderOnly) {
      stateValue.renderOnly = true;
      stateValue.renderItemId = options.renderItemId || null;
      // For render requests, use renderItemId as selectedItem temporarily
      stateValue.selectedItem = options.renderItemId || this.selectedItemId;
    }
    
    // Debounce rapid changes (except renderOnly which should be immediate)
    if (!options.renderOnly && this.triggerChangeTimeout) {
      clearTimeout(this.triggerChangeTimeout);
    }
    
    const performTrigger = () => {
      // Direct notification to server using Shiny.setInputValue (explicit and guaranteed)
      if (this.shinySetInputValue) {
        this.shinySetInputValue(
          this.element.id + "_state",
          stateValue,
          { priority: "event" }
        );
      }
      
      // Dispatch custom event for Shiny binding (kept for compatibility)
      // Reuse stateValue as detail (same structure)
      const event = new CustomEvent('sidePanelChange', { detail: stateValue });
      this.element.dispatchEvent(event);
      
      this.triggerChangeTimeout = null;
    };
    
    // For renderOnly, trigger immediately; otherwise debounce
    if (options.renderOnly) {
      performTrigger();
    } else {
      this.triggerChangeTimeout = setTimeout(performTrigger, 50);
    }
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

  destroy(force = false) {
    // Prevent accidental destruction
    if (this._destroyed) {
      console.warn('[SidePanel] Widget already destroyed, ignoring destroy() call');
      return;
    }

    // Require explicit confirmation to prevent accidental destruction
    if (!force) {
      console.warn('[SidePanel] destroy() called without force flag. Use destroy(true) to confirm destruction.');
      return;
    }

    // Verify element still exists before destroying
    if (!this.element || !this.element.parentNode) {
      console.warn('[SidePanel] Element no longer in DOM, marking as destroyed');
      this._destroyed = true;
      return;
    }

    // Mark as destroyed immediately to prevent re-entry
    this._destroyed = true;

    // Clear all pending binding timeouts
    if (this.bindingTimeout) {
      clearTimeout(this.bindingTimeout);
      this.bindingTimeout = null;
    }
    
    // Clear triggerChange debounce timeout
    if (this.triggerChangeTimeout) {
      clearTimeout(this.triggerChangeTimeout);
      this.triggerChangeTimeout = null;
    }
    
    // Clear individual item binding timeouts
    this.bindingTimeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.bindingTimeouts.clear();
    
    // Clear all active polling intervals
    this.activeIntervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.activeIntervals.clear();
    
    // Remove event listeners
    if (this.toggleButton && this.eventHandlers.toggleClick) {
      this.toggleButton.removeEventListener('click', this.eventHandlers.toggleClick);
    }
    
    if (this.overlay && this.eventHandlers.overlayClick) {
      this.overlay.removeEventListener('click', this.eventHandlers.overlayClick);
    }
    
    // Remove menu item click listeners
    this.menuItems.forEach(({ element, data }) => {
      const handler = this.eventHandlers.menuItemClicks.get(data.id);
      if (element && handler) {
        element.removeEventListener('click', handler);
      }
    });
    this.eventHandlers.menuItemClicks.clear();
    
    // Find and remove close button listener (it's in the header)
    if (this.panelContainer) {
      const closeBtn = this.panelContainer.querySelector('.side-panel-close-btn');
      if (closeBtn && this.eventHandlers.closeClick) {
        closeBtn.removeEventListener('click', this.eventHandlers.closeClick);
      }
    }
    
    // Clean up __bound properties from all content wrappers
    this.contentCache.forEach((contentWrapper) => {
      if (contentWrapper && contentWrapper.__bound !== undefined) {
        delete contentWrapper.__bound;
      }
    });
    
    // Clear content cache
    this.contentCache.clear();
    
    // Remove DOM elements
    if (this.panelContainer && this.panelContainer.parentNode) {
      this.panelContainer.parentNode.removeChild(this.panelContainer);
    }
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    if (this.toggleContainer && this.toggleContainer.parentNode) {
      this.toggleContainer.parentNode.removeChild(this.toggleContainer);
    }
    
    // Clear instance reference from element to prevent memory leaks
    if (this.element && this.element.sidePanelWidget === this) {
      delete this.element.sidePanelWidget;
    }
    
    // Clear event handlers object
    this.eventHandlers = {
      toggleClick: null,
      closeClick: null,
      overlayClick: null,
      menuItemClicks: new Map()
    };
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

