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
                    <ul>
                        <li v-for="recipe in recipes">
                            <a :href="'#/recipe/' + recipe.id">{{recipe.title}}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `,
    props: ["recipes"],
    data: function() {
        return {}
    },
    methods: {

    }
});