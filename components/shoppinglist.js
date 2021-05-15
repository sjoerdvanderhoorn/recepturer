Vue.component('shoppinglist', {
    template: `
        <div class="container">
            <div class="row" style="margin-bottom: 0;">
                <div class="col s12 offset-m1">
                    <h1 class="header">Shopping list</h1>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <table class="striped">
                    <tbody>
                        <tr v-for="ingredient in ingredients">
                            <td>
                                <label>
                                    <input v-model="ingredient.checked" type="checkbox" @change="check(ingredient)" /><span></span>
                                </label>
                            </td>
                            <td :class="{strike:ingredient.checked}">
                                {{ingredient.quantity}}
                            <td :class="{strike:ingredient.checked}">
                                {{ingredient.unit}}
                            </td>
                            <td :class="{strike:ingredient.checked}">
                                {{ingredient.product}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                &nbsp;
                            </td>
                            <td>
                                <div class="input-field col s12">
                                    <input type="number" id="quantity">
                                    <label for="quantity">Quantity</label>
                                </div>
                            </td>
                            <td>
                                <div class="input-field col s12">
                                    <input type="text" id="unit" class="autocomplete">
                                    <label for="unit">Unit</label>
                              </div>
                            </td>
                            <td>
                                <div class="input-field col s12">
                                    <input type="text" id="product">
                                    <label for="product">Product</label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    `,
    props: ["mealplan", "shoppinglist"],
    data: function() {
        return {}
    },
    mounted: function() {
        var elems = document.querySelectorAll('#unit.autocomplete');
        var options = {
            data: Object.fromEntries(rcp.unitofmeasure().map(unit => [unit, null]))
        }
        M.Autocomplete.init(elems, options);
    },
    computed: {
        ingredients: function() {
            // Combine ingredients from mealplan with (ad hoc) shoppinglist
            var ingredients = this.mealplan.map(recipe => rcp.parse(recipe.directions));
            ingredients.concat(this.shoppinglist);
            ingredients = rcp.aggregate(ingredients.flat());
            return ingredients;
        },
        unitofmeasure: function() {
            return rcp.unitofmeasure();
        }
    },
    methods: {
        check: function(ingredient) {
            this.$forceUpdate();
        }
    }
});