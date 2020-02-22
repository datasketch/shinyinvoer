var output_states = [];

var escapeSelector = function(s) {
    return s.replace(/([!"#$%&'()*+,-./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
};

var show_spinner = function(id) {
  var selector = "#"+escapeSelector(id);
  $(selector).siblings(".load-container, .shiny-spinner-placeholder").removeClass('shiny-spinner-hidden');
  $(selector).siblings(".load-container").siblings('.shiny-bound-output, .shiny-output-error').css('visibility', 'hidden');
};

var hide_spinner = function(id) {
  var selector = "#"+escapeSelector(id);
  $(selector).siblings(".load-container, .shiny-spinner-placeholder").addClass('shiny-spinner-hidden');
  $(selector).siblings(".load-container").siblings('.shiny-bound-output').css('visibility', 'visible');
};

var update_spinner = function(id) {
  if (!(id in output_states)) {
    show_spinner(id);
  }
  if (output_states[id] <= 0) {
    show_spinner(id);
  } else {
    hide_spinner(id);
  }
};

$(document).on('shiny:bound', function(event) {
  var id = event.target.id;
  if (id === undefined || id === "") {
    return;
  }

  /* if not bound before, then set the value to 0 */
  if (!(id in output_states)) {
    output_states[id] = 0;
  }
  update_spinner(id);
});

/* When recalculating starts, show the spinner container & hide the output */
$(document).on('shiny:outputinvalidated', function(event) {
  var id = event.target.id;
  if (id === undefined) {
    return;
  }
  output_states[id] = 0;
  update_spinner(id);
});

/* When new value or error comes in, hide spinner container (if any) & show the output */
$(document).on('shiny:value shiny:error', function(event) {
  var id = event.target.id;
  if (id === undefined) {
    return;
  }
  output_states[id] = 1;
  update_spinner(id);
});
