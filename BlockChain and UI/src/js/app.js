App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // front page.


    return await App.initWeb3();
  },

  initWeb3: async function() {
    /*
     * Replace me...
     */

    return App.initContract();
  },

  initContract: function() {
    /*
     * Replace me...
     */

    return App.bindEvents();
  },

};

function imageFunction(att1, att2) {
  console.log(att1 + " : " +att2);
  window.location.assign("car.html?testsdcx123")
}

$(function() {
  $(window).load(function() {
    App.init();
  });
});
