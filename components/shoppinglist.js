Vue.component('shoppinglist', {
    template: `
        <div class="container">
            <div class="row" style="margin-bottom: 0;">
                <div class="col s12 offset-m1">
                    <h1 class="header">Shopping list</h1>
                </div>
            </div>
            <div class="row" v-if="$root.mealplan.length > 0 || shoppinglist.length > 0">
                <div class="col s12 offset-m1">
                    <a href="#/shoppinglist/" @click="$root.clearMealPlanAndShoppingList()" class="waves-effect waves-light btn red darken-2"><i class="material-icons left">cleaning_services</i>Empty</a>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <table class="striped">
                        <template v-for="category in $root.shoppinglistArranged">
                            <thead>
                                <tr>
                                    <th colspan="5">
                                        <h4>{{category.name}}</h4>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="ingredient in category.ingredients" class="">
                                    <td width="40">
                                        <label>
                                            <input v-model="ingredient.checked" type="checkbox" @change="toggleIngredient(ingredient)" /><span></span>
                                        </label>
                                    </td>
                                    <td width="40" :class="{'right-align': true, strike:ingredient.checked}">
                                        {{ingredient.quantity}}
                                    </td>
                                    <td width="40" :class="{strike:ingredient.checked}">
                                        {{ingredient.unit}}
                                    </td>
                                    <td>
                                        <span :class="{strike:ingredient.checked}">
                                            {{ingredient.product}}
                                        </span>
                                        <span class="right" style="height: 10px;">
                                            <i class="material-icons pointer" @click="removeIngredient(ingredient)" title="Remove ingredient" v-if="isAdhocIngredient(ingredient)">undo</i>
                                            <i class="material-icons pointer" @click="changeQuantity(ingredient)" title="Change quantity">edit</i>
                                            <i class="material-icons pointer dropdown-trigger" title="Categorize" :data-target="'category_' + ingredient.product">category</i>
                                            <ul :id="'category_' + ingredient.product" class='dropdown-content'>
                                                <li v-for="category in categories"><a href="#/shoppinglist/" @click="changeCategory(ingredient, category)">{{category.name}}</a></li>
                                                <li class="divider" tabindex="-1"></li>
                                                <li><a href="#/shoppinglist/" @click="newCategory(ingredient)">New category</a></li>
                                            </ul>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </table>
                </div>
            </div>
            <div class="fixed-action-btn">
                <a class="btn-floating btn-large red" @click="addIngredient()">
                    <i class="large material-icons">add</i>
                </a>
            </div>
        </div>
    `,
    props: ["mealplan", "shoppinglist", "categories"],
    data: function() {
        return {
            quantity: null,
            unit: null,
            product: null
        }
    },
    updated: function() {
        M.AutoInit();
    },
    computed: {
        unitofmeasure: function() {
            return rcp.unitofmeasure();
        }
    },
    methods: {
        toggleIngredient: function(ingredient) {
            var existing = this.shoppinglist.find(i => i.product == ingredient.product);
            if (existing) {
                existing.checked = ingredient.checked;
            } else {
                ingredient.quantity = 0;
                ingredient.checked = true;
                this.shoppinglist.push(ingredient);
            }
        },
        changeQuantity: function(ingredient) {
            var existing = this.shoppinglist.find(i => i.product == ingredient.product);
            var quantityRequired = (existing ? ingredient.quantity - existing.quantity : ingredient.quantity);
            var newQuantity = parseFloat(window.prompt(`Enter total quantity for ${ingredient.product} in ${ingredient.unit}. The meal plan requires ${quantityRequired} ${ingredient.unit}.`, ingredient.quantity));
            if (!isNaN(newQuantity)) {
                if (existing) {
                    existing.quantity = newQuantity - quantityRequired;
                } else {
                    ingredient.quantity = newQuantity - quantityRequired;
                    this.shoppinglist.push(ingredient);
                }
            }
        },
        removeCategory: function(ingredient) {
            var category = this.categories.find(category => category.products.find(product => product.name == ingredient.product));
            if (category) {
                var i = category.products.findIndex(product => product.name == ingredient.product);
                this.$delete(category.products, i);
            }
        },
        changeCategory: function(ingredient, category) {
            this.removeCategory(ingredient);
            category.products.push({ name: ingredient.product });
        },
        newCategory: function(ingredient) {
            var newCategory = window.prompt(`Enter the name for the new category for ${ingredient.product}.`);
            if (newCategory) {
                var existing = this.categories.find(category => category.name == newCategory);
                if (existing) {
                    this.changeCategory(ingredient, existing);
                } else {
                    this.removeCategory(ingredient);
                    this.categories.push({
                        name: newCategory,
                        products: [{ name: ingredient.product }]
                    });
                }
            }
        },
        isAdhocIngredient: function(ingredient) {
            return this.shoppinglist.some(j => j.product == ingredient.product);
        },
        addIngredient: function() {
            var input = window.prompt(`Enter the quantity and name of the ingredient(s) you want to add. For example: 100 gram sugar and 3 teaspoons of pepper`);
            if (input) {
                var ingedients = rcp.parse(input);
                ingedients.map(ingredient => this.shoppinglist.push({ quantity: ingredient.quantity, unit: ingredient.unit, product: ingredient.product }))
            }
        },
        removeIngredient: function(ingredient) {
            var i = -1;
            do {
                i = this.shoppinglist.findIndex(j => j.product == ingredient.product);
                if (i > -1) {
                    this.$delete(this.shoppinglist, i);
                }
            } while (i > -1)
        }
    }
});