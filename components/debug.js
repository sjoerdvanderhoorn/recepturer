Vue.component('debug', {
    template: `
        <div class="container">
            <div class="row" style="margin-bottom: 0;">
                <div class="col s12 offset-m1">
                    <h1 class="header">Debug</h1>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <h4>Recipes</h4>
                    <pre class="teal lighten-5 z-depth-3" style="padding: 5px; overflow: auto; width: 100%; height: 300px;">{{recipes}}</pre>
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