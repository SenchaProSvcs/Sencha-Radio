Ext.define('Ext.data.proxy.YMusic', {
    extend: 'Ext.data.proxy.JsonP',
    requires: ['Ext.XTemplate'],
    config: {
        url: 'http://query.yahooapis.com/v1/public/yql',
        autoAppendParams: false,
        query: null
    },
    
    initialize: function() {
        this.queries = {
            popular: 'select * from music.track.popular'
        };
        
        this.callParent(arguments);
    },
    
    buildRequest: function(operation) {
        var me          = this,
            request     = me.callParent(arguments),
            queryTpl    = me.queries[me.getQuery()],
            filters     = operation.getFilters() || [],
            params      = request.getParams(),
            filterData  = {};
            
        Ext.iterate(filters, function(filter) {
            filterData[filter.getProperty()] = filter.getValue();
        });

        delete params.filters;

        Ext.applyIf(params, {
            format: 'json',
            q: Ext.isString(queryTpl) ? queryTpl : queryTpl.applyTemplate(filterData)
        });

        request.setParams(params);
        request.setUrl(Ext.urlAppend(request.getUrl(), Ext.urlEncode(params)));
        return request;
    }
}, function() {
    Ext.ClassManager.setAlias('Ext.data.proxy.YMusic', 'proxy.ymusic');
});