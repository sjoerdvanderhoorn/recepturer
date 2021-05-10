var Recepturer = (function() {

    function Recepturer() {
        // Constructor
    }

    // Private variables
    var dot = "";


    // Public properties
    this.isLoaded = false;

    // Public methods
    Recepturer.prototype.register = function(options) {
        this.treecontainer = options.treecontainer;
        this.tree = options.tree;
    }


    // Private methods
    function init() {

    }


    return Recepturer;
})();