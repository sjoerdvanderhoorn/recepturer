function Recepturer() {

    // Private variables
    var _settings = {
        unitofmeasure: [],
        temperature: [],
        time: []
    };

    // Private methods
    function _ingredientRegex() {
        return new RegExp(`\\b([\\d\\,\\.]+)\\s(${_settings.unitofmeasure.map(unit => unit.name).join("|")})\\s([\\w\\-\\'\\’\\\`]+)`, "gi");
    }

    function _temperatureRegex() {
        return new RegExp(`\\b(([\\d])+)\\s(${_settings.temperature.map(item => item.name).join("|")})\\b`, "gi");
    }

    function _timeRegex() {
        return new RegExp(`\\b(([\\d\\,\\.\\-])+)\\s(${_settings.time.map(item => item.name).join("|")})\\b`, "gi");;
    }

    // Public properties
    this.ingredientRegex = _ingredientRegex();
    this.temperatureRegex = _temperatureRegex();
    this.timeRegex = _timeRegex();

    // Public methods
    this.settings = function(settings) {
        _settings = settings;
        this.ingredientRegex = _ingredientRegex();
        this.temperatureRegex = _temperatureRegex();
        this.timeRegex = _timeRegex();
    }

    this.parse = function(recipe) {
        var ingredients = recipe.match(this.ingredientRegex);
        ingredients = (ingredients || []).map(ingredient => {
            // Parse quantity, unit, and product from ingredient
            var parsed = ingredient.match(new RegExp(this.ingredientRegex, "i"));
            return {
                quantity: parseFloat(parsed[1].replace(",", ".")) * (_settings.unitofmeasure.find(unit => unit.name == parsed[2]).conversion || 1),
                unit: _settings.unitofmeasure.find(unit => unit.name == parsed[2]).unit,
                product: parsed[3]
            };
        });
        return ingredients;
    }

    this.aggregate = function(ingredients) {
        return ingredients.reduce((all, ingredient) => {
            // Combine ingredients that have the same unit and product
            var existing = all.find(item => item.unit == ingredient.unit && item.product == ingredient.product);
            if (existing) {
                existing.quantity += ingredient.quantity;
                existing.checked = existing.checked || ingredient.checked;
            } else {
                all.push(ingredient);
            }
            return all;
        }, []).sort((a, b) => {
            // Order ingredients by product name and then quantity
            return a.product.localeCompare(b.product) || a.quantity - b.quantity;
        });
    }

    this.format = function(html) {
        // Remove current formatting
        html = this.strip(html);
        // Mark using regular expressions
        html = html.replace(rcp.ingredientRegex, "<span class='recipe ingredient'>$&</span>");
        html = html.replace(rcp.temperatureRegex, "<span class='recipe temperature'>$&</span>");
        html = html.replace(rcp.timeRegex, "<span class='recipe time'>$&</span>");
        // Add formatting for lists and newlines
        html = html.replace(/(?:^|\n)\*\s(.*)/gi, "<ol><li>$1</li></ol>");
        html = html.replace(/<\/li><\/ol><ol><li>/gi, "</li><li>");
        html = html.replace(/\n/gi, "<br/>");
        return html;
    }

    this.strip = function(html) {
        html = html.replace(/<(div|br)(.*?)>/gi, "<li>");
        html = html.replace(/<li>/gi, "\n* ");
        html = html.replace(/<(.*?)>/gi, "");
        return html;
    }

    this.unitofmeasure = function() {
        return _settings.unitofmeasure.map(unit => unit.name);
    }

};