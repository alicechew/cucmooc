/////////////////////////////
//requireJS version:2.1.22 //
/////////////////////////////

requirejs.config({
    baseUrl: '../js',
    paths: {
        widgets: './widgets',
        lib: './lib',
        jquery: './lib/jquery-2.1.4.min',
        bootstrap: './lib/bootstrap',
        paginator: './lib/bootstrap-paginator',
        validate: './lib/jquery.validate',
        loginModule: './widgets/login-module',
        registerModule: './widgets/register-module'
    },
    shim: {
        bootstrap: ['jquery'],
        paginator: ['bootstrap'],
        validate: ['jquery'],
        loginModule: ['jquery'],
        registerModule: ['validate']

    }
});