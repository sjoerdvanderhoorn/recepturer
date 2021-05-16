Vue.component('mealplan', {
    template: `
        <div class="container">
            <div class="row" style="margin-bottom: 0;">
                <div class="col s12 offset-m1">
                    <h1 class="header">Meal plan</h1>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <div class="row">
                        <div class="col s12 m4" v-for="recipe in mealplan">
                            <div class="card teal">
                                <div class="card-content white-text">
                                    <span class="card-title">{{recipe.title}}</span>
                                    <p>{{recipe.description}}</p>
                                </div>
                                <div class="card-action">
                                    <a :href="'#/recipe/' + recipe.id">Recipe</a>
                                    <a class="dropdown-trigger" href="#/mealplan/" :data-target="'people_' + recipe.id">{{recipe.people}} person(s)</a>
                                    <ul :id="'people_' + recipe.id" class='dropdown-content'>
                                        <li><a href="#/mealplan/" @click="changePeople(recipe, 1)">One person</a></li>
                                        <li><a href="#/mealplan/" @click="changePeople(recipe, 2)">Two people</a></li>
                                        <li><a href="#/mealplan/" @click="changePeople(recipe, 3)">Three people</a></li>
                                        <li><a href="#/mealplan/" @click="changePeople(recipe, 4)">Four people</a></li>
                                        <li><a href="#/mealplan/" @click="changePeople(recipe, 5)">Five people</a></li>
                                    </ul>
                                    <a href="#/mealplan/" @click="$root.removeFromMealPlan(recipe)">Remove</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ["mealplan"],
    data: function() {
        return {}
    },
    methods: {
        removeFromMealPlan: function(recipe) {
            var i = this.$root.mealplan.findIndex(r => r.id == recipe.id);
            if (i > -1) {
                this.$delete(this.$root.mealplan, i);
            }
        },
        changePeople(recipe, people) {
            recipe.people = people;
            this.$forceUpdate();
        }
    }
});