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
                                    <a :href="'#/recipe/' + recipe.id">Edit</a>
                                    <a href="#">Add to menu</a>
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