var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "knits"		    : "list",
        "knits/page/:page"  : "list",
        "knits/add"         : "addKnit",
        "knits/:id"         : "knitDetails",
        "about"             : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var wineList = new KnitCollection();
        wineList.fetch({success: function(){
            $("#content").html(new KnitListView({model: wineList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    knitDetails: function (id) {
        var wine = new Knit({_id: id});
        wine.fetch({success: function(){
            $("#content").html(new KnitView({model: wine}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addKnit: function() {
        var wine = new Knit();
        $('#content').html(new KnitView({model: wine}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'KnitView', 'KnitListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
