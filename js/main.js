(function() {
  //Global single plage navigation object

  var nav = {
    // Page data
    pages: {},
    // Add a new page
    addPage: function(key, data) {
      this.pages[key] = data;
    },
    defaultPage: '',
    //Navigate to page
    goTo: function(pageKey) {
      // Push to history so back button works
      history.pushState({page: pageKey}, pageKey);
      // Call the navigation callback
      if (typeof this.onGoTo == 'function') {
        this.onGoTo(pageKey);
      }
    },
    goToDefault: function() {
      this.goTo(this.defaultPage);
    }
  };

  window.onpopstate = function(event) {
    nav.goTo(event.state.page);
  }

  window.nav = nav;
})();


(function() {
  // KO View Models

  // Data for each page
  var PageViewModel = function(pageKey) {
    var pageData = nav.pages[pageKey];

    this.text = pageData.text;
    this.buttons = pageData.buttons;

    this.buttonAction = function(button) {
      nav.goTo(button.to);
    };
  };

  // Manages switching between pages
  var RootViewModel = function() {
    this.currentPage = ko.observable();

    // This will be called when nav.goTo is called
    nav.onGoTo = (function(pageKey) {
      this.currentPage(new PageViewModel(pageKey));
    }).bind(this);

    // Start out on the default page
    nav.goToDefault();
  };

  // Start up KO
  document.addEventListener("DOMContentLoaded", function() {
    ko.applyBindings(new RootViewModel());
  });
})();


(function() {
  //Page data

  nav.addPage('cat', {
    text: 'do you have a cat?',
    buttons: [
      { label: 'yes', to: 'hungry'},
      { label: 'no', to: 'get'}
    ]
  });

  nav.addPage('hungry', {
    text: 'is your cat hungry?',
    buttons: [
      { label: 'yes', to: 'feed'},
      { label: 'no', to: 'cool'}
    ]
  });

  nav.addPage('get', {
    text: 'go get a cat',
  });

  nav.addPage('feed', {
    text: 'feed yer cat',
  });

  nav.addPage('cool', {
    text: 'cool',
  });

  nav.defaultPage = 'cat';
})();
