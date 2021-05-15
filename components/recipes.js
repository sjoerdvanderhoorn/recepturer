Vue.component('recipes', {
    template: `
        <div class="container">
            <div class="row" style="margin-bottom: 0;">
                <div class="col s12 offset-m1">
                    <h1 class="header">Recipes</h1>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <div class="input-field col s6">
                        <input id="recipes_search" type="text" v-model="search">
                        <label for="recipes_search">Search</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <div class="row">
                        <div class="col s12 m4" v-for="recipe in filteredRecipes">
                            <div class="card teal">
                                <div class="card-content white-text">
                                    <span class="card-title">{{recipe.title}}</span>
                                    <p>{{recipe.description}}</p>
                                </div>
                                <div class="card-action">
                                    <a :href="'#/recipe/' + recipe.id">Recipe</a>
                                    <a class="dropdown-trigger" href="#/recipes/" v-show="!$root.isOnMealplan(recipe)" :data-target="'people_' + recipe.id">Add to meal plan</a>
                                    <ul :id="'people_' + recipe.id" class='dropdown-content'>
                                        <li><a href="#/recipes/" @click="$root.addToMealPlan(recipe, 1)">One person</a></li>
                                        <li><a href="#/recipes/" @click="$root.addToMealPlan(recipe, 2)">Two people</a></li>
                                        <li><a href="#/recipes/" @click="$root.addToMealPlan(recipe, 3)">Three people</a></li>
                                        <li><a href="#/recipes/" @click="$root.addToMealPlan(recipe, 4)">Four people</a></li>
                                        <li><a href="#/recipes/" @click="$root.addToMealPlan(recipe, 5)">Five people</a></li>
                                    </ul>
                                    <a href="#/recipes/" v-show="$root.isOnMealplan(recipe)" @click="$root.removeFromMealPlan(recipe)">Remove from meal plan</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ["recipes"],
    data: function() {
        return {
            search: ""
        }
    },
    computed: {
        filteredRecipes: function() {
            var words = this.search.match(/\w+|\d+/g) || [];
            var results = this.recipes.filter(recipe => words.every(word => JSON.stringify(recipe).includes(word)));
            return results;
        }
    },
    methods: {

    }
});