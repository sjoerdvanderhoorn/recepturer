function Recepturer() {

    // Private variables
    var _settings = {
        unitofmeasure: [
            { name: "g", unit: "gram", conversion: 1 },
            { name: "gram", unit: "gram", conversion: 1 },
            { name: "kg", unit: "gram", conversion: 1000 },
            { name: "kilo", unit: "gram", conversion: 1000 },
            { name: "kilogram", unit: "gram", conversion: 1000 },
            { name: "pond", unit: "gram", conversion: 500 },
            { name: "ml", unit: "milliliter", conversion: 1 },
            { name: "milliliter", unit: "milliliter", conversion: 1 },
            { name: "dl", unit: "milliliter", conversion: 10 },
            { name: "deciliter", unit: "milliliter", conversion: 10 },
            { name: "cl", unit: "milliliter", conversion: 100 },
            { name: "centiliter", unit: "milliliter", conversion: 100 },
            { name: "l", unit: "milliliter", conversion: 1000 },
            { name: "liter", unit: "milliliter", conversion: 1000 },
            { name: "kop", unit: "kop", conversion: 1 },
            { name: "kopje", unit: "kop", conversion: 1 },
            { name: "kopjes", unit: "kop", conversion: 1 },
            { name: "el", unit: "el", conversion: 1 },
            { name: "eetlepel", unit: "el", conversion: 1 },
            { name: "eetlepels", unit: "el", conversion: 1 },
            { name: "tl", unit: "tl", conversion: 1 },
            { name: "theelepel", unit: "tl", conversion: 1 },
            { name: "theelepels", unit: "tl", conversion: 1 },
            { name: "stuk", unit: "stuk", conversion: 1 },
            { name: "stuks", unit: "stuk", conversion: 1 },
            { name: "hele", unit: "hele", conversion: 1 },
            { name: "halve", unit: "hele", conversion: 0.5 },
            { name: "paar", unit: "paar", conversion: 1 },
            { name: "teen", unit: "teen", conversion: 1 },
            { name: "tenen", unit: "teen", conversion: 1 },
            { name: "teentje", unit: "teen", conversion: 1 },
            { name: "teentjes", unit: "teen", conversion: 1 },
            { name: "stengel", unit: "stengel", conversion: 1 },
            { name: "stengels", unit: "stengel", conversion: 1 }
        ],
        temperature: ["c", "f", "graden", "celsius", "fahrenheit", "fahrenheit"],
        time: ["m", "min", "minuut", "minuten", "u", "uur", "uren", "s", "seconde", "seconden", "secondes"]
    };

    // Public properties

    this.ingredientRegex = new RegExp(`\\b([\\d\\,\\.]+)\\s(${_settings.unitofmeasure.map(unit => unit.name).join("|")})\\s([\\w\\-\\'\\’\\\`]+)`, "gi");
    this.temperatureRegex = new RegExp(`\\b(([\\d])+)\\s(${_settings.temperature.join("|")})\\b`, "gi");
    this.timeRegex = new RegExp(`\\b(([\\d\\,\\.\\-])+)\\s(${_settings.time.join("|")})\\b`, "gi");

    // Public methods
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