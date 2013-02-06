/**
 * @aside guide list
 * @aside video list
 *
 * List is a custom styled DataView which allows Grouping, Indexing, Icons, and a Disclosure. See the
 * [Guide](#!/guide/list) and [Video](#!/video/list) for more.
 *
 *     @example miniphone preview
 *     Ext.create('Ext.List', {
 *         fullscreen: true,
 *         itemTpl: '{title}',
 *         data: [
 *             { title: 'Item 1' },
 *             { title: 'Item 2' },
 *             { title: 'Item 3' },
 *             { title: 'Item 4' }
 *         ]
 *     });
 *
 * A more advanced example showing a list of people groped by last name:
 *
 *     @example miniphone preview
 *     Ext.define('Contact', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: ['firstName', 'lastName']
 *         }
 *     });
 *
 *     var store = Ext.create('Ext.data.Store', {
 *        model: 'Contact',
 *        sorters: 'lastName',
 *
 *        grouper: {
 *            groupFn: function(record) {
 *                return record.get('lastName')[0];
 *            }
 *        },
 *
 *        data: [
 *            { firstName: 'Tommy',   lastName: 'Maintz'  },
 *            { firstName: 'Rob',     lastName: 'Dougan'  },
 *            { firstName: 'Ed',      lastName: 'Spencer' },
 *            { firstName: 'Jamie',   lastName: 'Avins'   },
 *            { firstName: 'Aaron',   lastName: 'Conran'  },
 *            { firstName: 'Dave',    lastName: 'Kaneda'  },
 *            { firstName: 'Jacky',   lastName: 'Nguyen'  },
 *            { firstName: 'Abraham', lastName: 'Elias'   },
 *            { firstName: 'Jay',     lastName: 'Robinson'},
 *            { firstName: 'Nigel',   lastName: 'White'   },
 *            { firstName: 'Don',     lastName: 'Griffin' },
 *            { firstName: 'Nico',    lastName: 'Ferrero' },
 *            { firstName: 'Jason',   lastName: 'Johnston'}
 *        ]
 *     });
 *
 *     Ext.create('Ext.List', {
 *        fullscreen: true,
 *        itemTpl: '<div class="contact">{firstName} <strong>{lastName}</strong></div>',
 *        store: store,
 *        grouped: true
 *     });
 *
 * If you want to dock items to the bottom or top of a List, you can use the scrollDock configuration on child items in this List. The following example adds a button to the bottom of the List.
 *
 *     @example phone preview
 *     Ext.define('Contact', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: ['firstName', 'lastName']
 *         }
 *     });
 *
 *     var store = Ext.create('Ext.data.Store', {
 *        model: 'Contact',
 *        sorters: 'lastName',
 *
 *        grouper: {
 *            groupFn: function(record) {
 *                return record.get('lastName')[0];
 *            }
 *        },
 *
 *        data: [
 *            { firstName: 'Tommy',   lastName: 'Maintz'  },
 *            { firstName: 'Rob',     lastName: 'Dougan'  },
 *            { firstName: 'Ed',      lastName: 'Spencer' },
 *            { firstName: 'Jamie',   lastName: 'Avins'   },
 *            { firstName: 'Aaron',   lastName: 'Conran'  },
 *            { firstName: 'Dave',    lastName: 'Kaneda'  },
 *            { firstName: 'Jacky',   lastName: 'Nguyen'  },
 *            { firstName: 'Abraham', lastName: 'Elias'   },
 *            { firstName: 'Jay',     lastName: 'Robinson'},
 *            { firstName: 'Nigel',   lastName: 'White'   },
 *            { firstName: 'Don',     lastName: 'Griffin' },
 *            { firstName: 'Nico',    lastName: 'Ferrero' },
 *            { firstName: 'Jason',   lastName: 'Johnston'}
 *        ]
 *     });
 *
 *     Ext.create('Ext.List', {
 *         fullscreen: true,
 *         itemTpl: '<div class="contact">{firstName} <strong>{lastName}</strong></div>',
 *         store: store,
 *         items: [{
 *             xtype: 'button',
 *             scrollDock: 'bottom',
 *             docked: 'bottom',
 *             text: 'Load More...'
 *         }]
 *     });
 */
Ext.define('Ext.dataview.List', {
    alternateClassName: 'Ext.List',
    extend: 'Ext.dataview.DataView',
    xtype: 'list',

    mixins: ['Ext.mixin.Bindable'],

    requires: [
        'Ext.dataview.IndexBar',
        'Ext.dataview.ListItemHeader',
        'Ext.dataview.component.ListItem',
        'Ext.util.TranslatableList',
        'Ext.util.PositionMap'
    ],

    /**
     * @event disclose
     * @preventable doDisclose
     * Fires whenever a disclosure is handled
     * @param {Ext.dataview.List} this The List instance
     * @param {Ext.data.Model} record The record associated to the item
     * @param {HTMLElement} target The element disclosed
     * @param {Number} index The index of the item disclosed
     * @param {Ext.EventObject} e The event object
     */

    config: {
        /**
         * @cfg layout
         * Hide layout config in DataView. It only causes confusion.
         * @accessor
         * @private
         */
        layout: 'fit',

        /**
         * @cfg {Boolean/Object} indexBar
         * `true` to render an alphabet IndexBar docked on the right.
         * This can also be a config object that will be passed to {@link Ext.IndexBar}.
         * @accessor
         */
        indexBar: false,

        icon: null,

        /**
         * @cfg {Boolean} clearSelectionOnDeactivate
         * `true` to clear any selections on the list when the list is deactivated.
         * @removed 2.0.0
         */

        /**
         * @cfg {Boolean} preventSelectionOnDisclose `true` to prevent the item selection when the user
         * taps a disclose icon.
         * @accessor
         */
        preventSelectionOnDisclose: true,

        /**
         * @cfg baseCls
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'list',

        /**
         * @cfg {Boolean} pinHeaders
         * Whether or not to pin headers on top of item groups while scrolling for an iPhone native list experience.
         * @accessor
         */
        pinHeaders: true,

        /**
         * @cfg {Boolean} grouped
         * Whether or not to group items in the provided Store with a header for each item.
         * @accessor
         */
        grouped: false,

        /**
         * @cfg {Boolean/Function/Object} onItemDisclosure
         * `true` to display a disclosure icon on each list item.
         * The list will still fire the disclose event, and the event can be stopped before itemtap.
         * By setting this config to a function, the function passed will be called when the disclosure
         * is tapped.
         * Finally you can specify an object with a 'scope' and 'handler'
         * property defined. This will also be bound to the tap event listener
         * and is useful when you want to change the scope of the handler.
         * @accessor
         */
        onItemDisclosure: null,

        /**
         * @cfg {String} disclosureProperty
         * A property to check on each record to display the disclosure on a per record basis.  This
         * property must be false to prevent the disclosure from being displayed on the item.
         * @accessor
         */
        disclosureProperty: 'disclosure',

        /**
         * @cfg {String} ui
         * The style of this list. Available options are `normal` and `round`.
         */
        ui: 'normal',

        /**
         * @cfg {Boolean} useComponents
         * Flag the use a component based DataView implementation.  This allows the full use of components in the
         * DataView at the cost of some performance.
         *
         * Checkout the [DataView Guide](#!/guide/dataview) for more information on using this configuration.
         * @accessor
         * @private
         */

        /**
         * @cfg {Object} itemConfig
         * A configuration object that is passed to every item created by a component based DataView. Because each
         * item that a DataView renders is a Component, we can pass configuration options to each component to
         * easily customize how each child component behaves.
         * Note this is only used when useComponents is true.
         * @accessor
         * @private
         */

        /**
         * @cfg {Number} maxItemCache
         * Maintains a cache of reusable components when using a component based DataView.  Improving performance at
         * the cost of memory.
         * Note this is currently only used when useComponents is true.
         * @accessor
         * @private
         */

        /**
         * @cfg {String} defaultType
         * The xtype used for the component based DataView. Defaults to dataitem.
         * Note this is only used when useComponents is true.
         * @accessor
         */
        defaultType: 'listitem',

        /**
         * @cfg {Object} itemMap
         * @private
         */
        itemMap: {},

        /**
         * @cfg {Number} itemHeight
         * This allows you to set the default item height and is used to roughly calculate the amount
         * of items needed to fill the list. By default items are around 50px high.
         */
        itemHeight: 45,

        /**
         * @cfg {Boolean} refreshHeightOnUpdate
         * Set this to false if you make many updates to your list (like in an interval), but updates
         * won't affect the item's height. Doing this will increase the performance of these updates.
         */
        refreshHeightOnUpdate: true,

        /**
         * @cfg {Boolean} infinite
         * Set this to false to render all items in this list, and render them relatively.
         * Note that this configuration can not be dynamically changed after the list has instantiated.
         */
        infinite: true
    },

    constructor: function(config) {
        var me = this,
            layout;

        me.callParent(arguments);

        //<debug>
        layout = this.getLayout();
        if (layout && !layout.isFit) {
            Ext.Logger.error('The base layout for a DataView must always be a Fit Layout');
        }
        //</debug>
    },

    topItemIndex: 0,
    topItemPosition: 0,

    updateItemHeight: function(itemHeight) {
        this.getItemMap().setMinimumHeight(itemHeight);
    },

    applyItemMap: function(itemMap) {
        return Ext.factory(itemMap, Ext.util.PositionMap, this.getItemMap());
    },

    // apply to the selection model to maintain visual UI cues
    onItemTrigger: function(me, index, target, record, e) {
        if (!(this.getPreventSelectionOnDisclose() && Ext.fly(e.target).hasCls(this.getBaseCls() + '-disclosure'))) {
            this.callParent(arguments);
        }
    },

    beforeInitialize: function() {
        var me = this,
            container, scrollable;

        me.listItems = [];
        me.scrollDockItems = {
            top: [],
            bottom: []
        };

        container = me.container = me.add(new Ext.Container({
            scrollable: {
                scroller: {
                    autoRefresh: !me.getInfinite(),
                    direction: 'vertical'
                }
            }
        }));

        scrollable = container.getScrollable();

        me.bind(scrollable.getScroller().getTranslatable(), 'doTranslate', 'onTranslate');

        if (Ext.os.is.Android4 && !Ext.browser.is.ChromeMobile) {
            me.headerTranslateFn = Ext.Function.createThrottled(me.headerTranslateFn, 50, me);
        }

        // Tie List's scroller to its container's scroller
        me.setScrollable(scrollable);
        me.scrollableBehavior = container.getScrollableBehavior();
    },

    initialize: function() {
        var me = this,
            container = me.container,
            i, ln;

        me.updatedItems = [];
        me.headerMap = [];

        me.on(me.getTriggerCtEvent(), me.onContainerTrigger, me);
        me.on(me.getTriggerEvent(), me.onItemTrigger, me);

        me.header = Ext.factory({
            xclass: 'Ext.dataview.ListItemHeader',
            html: '&nbsp;',
            translatable: true,
            role: 'globallistheader',
            cls: ['x-list-header', 'x-list-header-swap']
        });

        me.getScrollableBehavior().getScrollView().getElement().insertFirst(me.header.renderElement);

        me.headerTranslate = me.header.getTranslatable();
        me.headerTranslate.translate(0, -10000);

        if (!me.getGrouped()) {
            me.updatePinHeaders(null);
        }

        container.element.on({
            delegate: '.' + me.getBaseCls() + '-disclosure',
            tap: 'handleItemDisclosure',
            scope: me
        });

        container.element.on({
            resize: 'onResize',
            scope: me
        });

        // Android 2.x not a direct child
        container.innerElement.on({
            touchstart: 'onItemTouchStart',
            touchend: 'onItemTouchEnd',
            tap: 'onItemTap',
            taphold: 'onItemTapHold',
            singletap: 'onItemSingleTap',
            doubletap: 'onItemDoubleTap',
            swipe: 'onItemSwipe',
            delegate: '.' + Ext.baseCSSPrefix + 'list-item',
            scope: me
        });

        for (i = 0, ln = me.scrollDockItems.top.length; i < ln; i++) {
            container.add(me.scrollDockItems.top[i]);
        }

        for (i = 0, ln = me.scrollDockItems.bottom.length; i < ln; i++) {
            container.add(me.scrollDockItems.bottom[i]);
        }

        if (me.getStore()) {
            me.refresh();
        }
    },

//    updateInline: function(newInline) {
//        var me = this;
//        me.callParent(arguments);
//        if (newInline) {
//            me.setOnItemDisclosure(false);
//            me.setIndexBar(false);
//            me.setGrouped(false);
//        }
//    },

    applyIndexBar: function(indexBar) {
        return Ext.factory(indexBar, Ext.dataview.IndexBar, this.getIndexBar());
    },

    updateIndexBar: function(indexBar) {
        var me = this;
        if (indexBar && me.getScrollable()) {
            me.indexBarElement = me.getScrollableBehavior().getScrollView().getElement().appendChild(indexBar.renderElement);

            indexBar.on({
                index: 'onIndex',
                scope: me
            });

            me.element.addCls(me.getBaseCls() + '-indexed');
        }
    },

    updateGrouped: function(grouped) {
        var me = this,
            baseCls = this.getBaseCls(),
            store = me.getStore(),
            cls = baseCls + '-grouped',
            unCls = baseCls + '-ungrouped';

        if (grouped) {
            me.addCls(cls);
            me.removeCls(unCls);
            me.updatePinHeaders(me.getPinHeaders());
        }
        else {
            me.addCls(unCls);
            me.removeCls(cls);
            me.updatePinHeaders(null);
        }

        if (store && store.getCount() && me.isPainted() && me.listItems.length) {
            me.setItemsCount(me.listItems.length);
            me.refreshScroller();
        }
    },

    updatePinHeaders: function(pinnedHeaders) {
        if (this.headerTranslate) {
            this.headerTranslate.translate(0, -10000);
        }
    },

    updateItemTpl: function(newTpl, oldTpl) {
        var me = this,
            listItems = me.listItems,
            store = me.getStore(),
            ln = listItems.length || 0,
            i, listItem;

        for (i = 0; i < ln; i++) {
            listItem = listItems[i];
            listItem.setTpl(newTpl);
        }
        if (store && store.getCount() && me.isPainted() && me.listItems.length) {
            me.setItemsCount(me.listItems.length);
            me.refreshScroller();
        }
    },

    onResize: function() {
        var me = this,
            container = me.container,
            element = container.element,
            minimumHeight = me.getItemMap().getMinimumHeight(),
            containerSize;

        if (me.getInfinite()) {
            me.containerSize = containerSize = element.getHeight();
            me.setItemsCount(Math.ceil(containerSize / minimumHeight) + 1);
            container.getScrollable().getScroller().refresh();
        }
    },

    scrollDockHeightRefresh: function() {
        var items = this.listItems,
            scrollDockItems = this.scrollDockItems,
            ln = items.length,
            i, item;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if ((item.isFirst && scrollDockItems.top.length) || (item.isLast && scrollDockItems.bottom.length)) {
                this.updatedItems.push(item);
            }
        }
        this.refreshScroller();
    },

    headerTranslateFn: function(record, transY, headerTranslate) {
        var headerString = this.getStore().getGroupString(record);

        if (this.currentHeader !== headerString) {
            this.currentHeader = headerString;
            this.header.setHtml(headerString);
        }
        headerTranslate.translate(0, transY);
    },

    onTranslate: function(x, y, args) {
        var me = this,
            listItems = me.listItems,
            itemsCount = listItems.length,
            currentTopIndex = me.topItemIndex,
            itemMap = me.getItemMap(),
            store = me.getStore(),
            storeCount = store.getCount(),
            info = me.getListItemInfo(),
            grouped = me.getGrouped(),
            storeGroups = me.groups,
            headerMap = me.headerMap,
            headerTranslate = me.headerTranslate,
            pinHeaders = me.getPinHeaders(),
            infinite = me.getInfinite(),
            maxIndex = storeCount - itemsCount + 1,
            topIndex, changedCount, i, index, item,
            closestHeader, record, pushedHeader, transY, element;

        if (infinite) {
            if (me.updatedItems.length) {
                me.updateItemHeights();
            }

            // This is the index of the item that is currently visible at the top of the list
            me.topItemPosition = itemMap.findIndex(-y) || 0;

            // This is the index of the item that is currently rendered at the top
            me.topItemIndex = topIndex = Math.max(0, Math.min(me.topItemPosition, maxIndex));
        }

        if (grouped && headerTranslate && storeGroups.length && pinHeaders) {
            closestHeader = itemMap.binarySearch(headerMap, -y);
            record = storeGroups[closestHeader].children[0];
            if (record) {
                pushedHeader = y + headerMap[closestHeader + 1] - me.headerHeight;
                // Top of the list or above (hide the floating header offscreen)
                if (y >= 0) {
                    transY = -10000;
                }
                // Scroll the floating header a bit
                else if (pushedHeader < 0) {
                    transY = pushedHeader;
                }
                // Stick to the top of the screen
                else {
                    transY = Math.max(0, y);
                }
                this.headerTranslateFn(record, transY, headerTranslate);
            }
        }

        // First we are gonna check if we need to update any list items based on our scrolling
        if (infinite) {
            if (currentTopIndex !== topIndex) {
                // Scroll up
                if (currentTopIndex > topIndex) {
                    changedCount = Math.min(itemsCount, currentTopIndex - topIndex);
                    for (i = changedCount - 1; i >= 0; i--) {
                        item = listItems.pop();
                        listItems.unshift(item);
                        me.updateListItem(item, i + topIndex, info);
                    }
                }
                else {
                    // Scroll down
                    changedCount = Math.min(itemsCount, topIndex - currentTopIndex);
                    for (i = 0; i < changedCount; i++) {
                        item = listItems.shift();
                        listItems.push(item);
                        index = i + topIndex + itemsCount - changedCount;
                        me.updateListItem(item, index, info);
                    }
                }
            }

            // Next we are gonna make sure all items are in the correct position within the scroll container
            for (i = 0; i < itemsCount; i++) {
                item = listItems[i];
                transY = itemMap.map[item.$dataIndex];
                if (!item.$hidden && item.$position !== transY) {
                    item.translate(0, transY);
                    item.$position = transY;
                }
            }

            if (listItems.length && grouped && pinHeaders) {
                if (me.headerIndices[topIndex]) {
                    element = listItems[0].getHeader().element;
                    if (y < itemMap.map[topIndex]) {
                        element.setVisibility(false);
                    }
                    else {
                        element.setVisibility(true);
                    }
                }
                for (i = 1; i <= changedCount; i++) {
                    if (listItems[i]) {
                        listItems[i].getHeader().element.setVisibility(true);
                    }
                }
            }
        }
    },

    setItemsCount: function(itemsCount) {
        var me = this,
            listItems = me.listItems,
            infinite = me.getInfinite(),
            minimumHeight = me.getItemMap().getMinimumHeight(),
            config = {
                xtype: me.getDefaultType(),
                itemConfig: me.getItemConfig(),
                tpl: me.getItemTpl(),
                minHeight: minimumHeight,
                cls: me.getItemCls()
            },
            info = me.getListItemInfo(),
            i, item, itemCls;

        if (!infinite) {
            itemsCount = (info.store && info.store.getCount()) || 0;
            itemCls = me.getBaseCls() + '-item-relative';
        }

        for (i = 0; i < itemsCount; i++) {
            // We begin by checking if we already have an item for this length
            item = listItems[i];

            // If we don't have an item yet at this index then create one
            if (!item) {
                item = Ext.factory(config);
                item.dataview = me;
                item.$height = minimumHeight;
                if (!infinite) {
                    item.addCls(itemCls);
                }
                me.container.doAdd(item);
                listItems.push(item);
            }

            item.$dataIndex = null;

            if (info.store) {
                me.updateListItem(item, i + me.topItemIndex, info);
            }
        }

        if (infinite) {
            // Right after we update all the items we can retreive all their heights to be used
            // for the next scroll frame
            me.updatedItems = listItems.slice();
        }
    },

    getListItemInfo: function() {
        var me = this,
            baseCls = me.getBaseCls();

        return {
            store: me.getStore(),
            grouped: me.getGrouped(),
            baseCls: baseCls,
            selectedCls: me.getSelectedCls(),
            headerCls: baseCls + '-header-wrap',
            footerCls: baseCls + '-footer-wrap',
            firstCls: baseCls + '-item-first',
            lastCls: baseCls + '-item-last',
            itemMap: me.getItemMap(),
            defaultItemHeight: me.getItemHeight()
        };
    },

    updateListItem: function(item, index, info) {
        var record = info.store.getAt(index);
        if (this.isSelected(record)) {
            item.addCls(info.selectedCls);
        }
        else {
            item.removeCls(info.selectedCls);
        }

        item.removeCls([info.headerCls, info.footerCls, info.firstCls, info.lastCls]);
        this.doUpdateListItem(item, index, info);
    },

    doUpdateListItem: function(item, index, info) {
        var record = info.store.getAt(index),
            headerIndices = this.headerIndices,
            footerIndices = this.footerIndices,
            headerItem = item.getHeader(),
            scrollDockItems = this.scrollDockItems,
            updatedItems = this.updatedItems,
            ln, i, scrollDockItem;

        if (!record) {
            item.setRecord(null);
            item.translate(0, -10000);
            item.$position = -10000;
            item.$hidden = true;
            return;
        }
        item.$hidden = false;

        if (item.isFirst && scrollDockItems.top.length) {
            for (i = 0, ln = scrollDockItems.top.length; i < ln; i++) {
                scrollDockItem = scrollDockItems.top[i];
                scrollDockItem.addCls(Ext.baseCSSPrefix + 'list-scrolldock-hidden');
                item.remove(scrollDockItem, false);
            }
            item.isFirst = false;
        }

        if (item.isLast && scrollDockItems.bottom.length) {
            for (i = 0, ln = scrollDockItems.bottom.length; i < ln; i++) {
                scrollDockItem = scrollDockItems.bottom[i];
                scrollDockItem.addCls(Ext.baseCSSPrefix + 'list-scrolldock-hidden');
                item.remove(scrollDockItem, false);
            }
            item.isLast = false;
        }

        if (item.getRecord) {
            if (item.$dataIndex !== index) {
                item.$dataIndex = index;
                this.fireEvent('itemindexchange', this, record, index, item);
            }
            if (item.getRecord() === record) {
                item.updateRecord(record);
            } else {
                item.setRecord(record);
            }
        }

        if (this.isSelected(record)) {
            item.addCls(info.selectedCls);
        }
        else {
            item.removeCls(info.selectedCls);
        }

        item.removeCls([info.headerCls, info.footerCls, info.firstCls, info.lastCls]);

        if (info.grouped) {
            if (headerIndices[index]) {
                item.addCls(info.headerCls);
                headerItem.setHtml(info.store.getGroupString(record));
                headerItem.show();
                headerItem.element.setVisibility(true);
            }
            else {
                headerItem.hide();
            }

            if (footerIndices[index]) {
                item.addCls(info.footerCls);
            }
        }

        if (index === 0) {
            item.isFirst = true;
            item.addCls(info.firstCls);

            if (!info.grouped) {
                item.addCls(info.headerCls);
            }

            for (i = 0, ln = scrollDockItems.top.length; i < ln; i++) {
                scrollDockItem = scrollDockItems.top[i];
                item.insert(0, scrollDockItem);
                scrollDockItem.removeCls(Ext.baseCSSPrefix + 'list-scrolldock-hidden');
            }
        }

        if (index === info.store.getCount() - 1) {
            item.isLast = true;
            item.addCls(info.lastCls);

            if (!info.grouped) {
                item.addCls(info.footerCls);
            }

            for (i = 0, ln = scrollDockItems.bottom.length; i < ln; i++) {
                scrollDockItem = scrollDockItems.bottom[i];
                item.insert(0, scrollDockItem);
                scrollDockItem.removeCls(Ext.baseCSSPrefix + 'list-scrolldock-hidden');
            }
        }

        updatedItems.push(item);
    },

    updateItemHeights: function() {
        var updatedItems = this.updatedItems,
            ln = updatedItems.length,
            itemMap = this.getItemMap(),
            scroller = this.container.getScrollable().getScroller(),
            minimumHeight = itemMap.getMinimumHeight(),
            headerIndices = this.headerIndices,
            headerMap = this.headerMap,
            translatable = scroller.getTranslatable(),
            itemIndex, i, item, height;

        if (!this.getInfinite()) {
            this.updatedItems.length = 0;
            return;
        }

        for (i = 0; i < ln; i++) {
            item = updatedItems[i];
            itemIndex = item.$dataIndex;

            // itemIndex may not be set yet if the store is still being loaded
            if (itemIndex !== null) {
                height = item.element.getFirstChild().getHeight();
                height = Math.max(height, minimumHeight);

                if (headerIndices && !this.headerHeight && headerIndices[itemIndex]) {
                    this.headerHeight = parseInt(item.getHeader().element.getHeight(), 10);
                }

                itemMap.setItemHeight(itemIndex, height);
                item.$height = height;
            }
        }

        itemMap.update();
        height = itemMap.getTotalHeight();

        headerMap.length = 0;
        for (i in headerIndices) {
            headerMap.push(itemMap.map[i]);
        }

        if (height != scroller.givenSize) {
            scroller.getElement().setHeight(height);
            scroller.setSize(height);
            scroller.refreshMaxPosition();
            scroller.fireEvent('refresh', scroller);

            if (translatable.isAnimating) {
                translatable.activeEasingY.setMinMomentumValue(-scroller.getMaxPosition().y);
            }
        }

        this.updatedItems.length = 0;
    },

    /*
     * @private
     * This is to fix the variable heights again since the item height might have changed after the update
     */
    refreshScroller: function() {
        var me = this,
            scroller = me.container.getScrollable().getScroller();

        if (me.isPainted() && me.getInfinite()) {
            scroller.scrollTo(0, scroller.position.y + 1);
            scroller.scrollTo(0, scroller.position.y - 1);
        }
    },

    /**
     * Returns an item at the specified index.
     * @param {Number} index Index of the item.
     * @return {Ext.dom.Element/Ext.dataview.component.DataItem} item Item at the specified index.
     */
    getItemAt: function(index) {
        var listItems = this.listItems,
            ln = listItems.length,
            i, listItem;

        for (i = 0; i < ln; i++) {
            listItem = listItems[i];
            if (listItem.$dataIndex === index) {
                return listItem;
            }
        }
    },

    /**
     * Returns an index for the specified item.
     * @param {Number} item The item to locate.
     * @return {Number} Index for the specified item.
     */
    getItemIndex: function(item) {
        return item.$dataIndex;
    },

    /**
     * Returns an array of the current items in the DataView.
     * @return {Ext.dom.Element[]/Ext.dataview.component.DataItem[]} Array of Items.
     */
    getViewItems: function() {
        return this.listItems;
    },

    doRefresh: function() {
        var me = this,
            store = me.getStore(),
            scrollable = me.container.getScrollable(),
            scroller = scrollable && scrollable.getScroller(),
            storeCount = store.getCount();

        if (me.getInfinite()) {
            me.getItemMap().populate(storeCount, this.topItemPosition);
        }

        if (me.getGrouped()) {
            me.findGroupHeaderIndices();
        }

        // This will refresh the items on the screen with the new data
        if ((!me.getInfinite() && store.getCount()) || me.listItems.length) {
            if (me.getScrollToTopOnRefresh()) {
                me.topItemIndex = 0;
                me.topItemPosition = 0;
                scroller.position.y = 0;
            }

            me.setItemsCount(me.listItems.length);
            me.refreshScroller();
        }

        // No items, hide all the items from the collection.
        if (storeCount < 1) {
            me.onStoreClear();
            return;
        } else {
            me.hideEmptyText();
        }
    },

    findGroupHeaderIndices: function() {
        var me = this,
            store = me.getStore(),
            storeLn = store.getCount(),
            groups = store.getGroups(),
            groupLn = groups.length,
            headerIndices = me.headerIndices = {},
            footerIndices = me.footerIndices = {},
            i, previousIndex, firstGroupedRecord, storeIndex;

        me.groups = groups;

        for (i = 0; i < groupLn; i++) {
            firstGroupedRecord = groups[i].children[0];
            storeIndex = store.indexOf(firstGroupedRecord);
            headerIndices[storeIndex] = true;

            previousIndex = storeIndex - 1;
            if (previousIndex) {
                footerIndices[previousIndex] = true;
            }
        }

        footerIndices[storeLn - 1] = true;

        return headerIndices;
    },

    // Handling adds and removes like this is fine for now. It should not perform much slower then a dedicated solution
    onStoreAdd: function() {
        this.doRefresh();
    },

    onStoreRemove: function() {
        this.doRefresh();
    },

    onStoreUpdate: function(store, record, newIndex, oldIndex) {
        var me = this,
            infinite = me.getInfinite(),
            item;

        oldIndex = (oldIndex === undefined) ? newIndex : oldIndex;

        if (infinite && oldIndex !== newIndex) {
            // Just refreshing the list here saves a lot of code and shouldnt be much slower
            me.doRefresh();
        }
        else {
            if (newIndex >= me.topItemIndex && newIndex < me.topItemIndex + me.listItems.length) {
                item = me.getItemAt(newIndex);
                me.doUpdateListItem(item, newIndex, me.getListItemInfo());

                // After we update a List item, we have to update its item height and refresh the scroller.
                if (me.getInfinite() && me.getRefreshHeightOnUpdate()) {
                    me.updatedItems.push(item);
                    me.refreshScroller();
                }
            }
        }
    },

    onStoreClear: function() {
        if (this.headerTranslate) {
            this.headerTranslate.translate(0, -10000);
        }
        this.showEmptyText();
    },

    onIndex: function(indexBar, index) {
        var me = this,
            key = index.toLowerCase(),
            store = me.getStore(),
            groups = store.getGroups(),
            ln = groups.length,
            scrollable = me.container.getScrollable(),
            scroller, group, i, closest, id;

        if (scrollable) {
            scroller = scrollable.getScroller();
        }
        else {
            return;
        }

        for (i = 0; i < ln; i++) {
            group = groups[i];
            id = group.name.toLowerCase();
            if (id == key || id > key) {
                closest = group;
                break;
            }
            else {
                closest = group;
            }
        }

        if (scrollable && closest) {
            index = store.indexOf(closest.children[0]);

            //stop the scroller from scrolling
            scroller.stopAnimation();

            //make sure the new offsetTop is not out of bounds for the scroller
            var containerSize = scroller.getContainerSize().y,
                size = scroller.getSize().y,
                maxOffset = size - containerSize,
                offsetTop = me.getItemMap().map[index] || (!me.getInfinite() && me.listItems[index].renderElement.dom.offsetTop),
                offset = (offsetTop > maxOffset) ? maxOffset : offsetTop;

            console.log(offsetTop);

            scroller.scrollTo(0, offset);

            // This is kind of hacky, but since there might be variable heights we have to render the frame
            // twice. First to update all the content, then to read the heights and translate items accordingly
            if (this.getInfinite() && this.updatedItems.length > 0) {
                this.refreshScroller();
            }
        }
    },

    applyOnItemDisclosure: function(config) {
        if (Ext.isFunction(config)) {
            return {
                scope: this,
                handler: config
            };
        }
        return config;
    },

    handleItemDisclosure: function(e) {
        var me = this,
            item = Ext.getCmp(Ext.get(e.getTarget()).up('.x-list-item').id),
            index = item.$dataIndex,
            record = me.getStore().getAt(index);

        me.fireAction('disclose', [me, record, item, index, e], 'doDisclose');
    },

    doDisclose: function(me, record, item, index, e) {
        var onItemDisclosure = me.getOnItemDisclosure();

        if (onItemDisclosure && onItemDisclosure.handler) {
            onItemDisclosure.handler.call(onItemDisclosure.scope || me, record, item, index, e);
        }
    },

    updateItemCls: function(newCls, oldCls) {
        var items = this.listItems,
            ln = items.length,
            i, item;

        for (i = 0; i < ln; i++) {
            item = items[i];
            item.removeCls(oldCls);
            item.addCls(newCls);
        }
    },

    onItemTouchStart: function(e) {
        this.container.innerElement.on({
            touchmove: 'onItemTouchMove',
            delegate: '.' + Ext.baseCSSPrefix + 'list-item-body',
            single: true,
            scope: this
        });
        this.callParent(this.parseEvent(e));
    },

    onItemTouchMove: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemTouchEnd: function(e) {
        this.container.innerElement.un({
            touchmove: 'onItemTouchMove',
            delegate: '.' + Ext.baseCSSPrefix + 'list-item-body',
            scope: this
        });
        this.callParent(this.parseEvent(e));
    },

    onItemTap: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemTapHold: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemSingleTap: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemDoubleTap: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemSwipe: function(e) {
        this.callParent(this.parseEvent(e));
    },

    parseEvent: function(e) {
        var me = this,
            target = Ext.fly(e.getTarget()).findParent('.' + Ext.baseCSSPrefix + 'list-item', 8),
            item = Ext.getCmp(target.id);

        return [me, item, item.$dataIndex, e];
    },

    onItemAdd: function(item) {
        var me = this,
            config = item.config;

        if (config.scrollDock) {
            if (config.scrollDock == 'bottom') {
                me.scrollDockItems.bottom.push(item);
            } else {
                me.scrollDockItems.top.push(item);
            }
            item.addCls(Ext.baseCSSPrefix + 'list-scrolldock-hidden');
            if (me.container) {
                me.container.add(item);
            }
        } else {
            me.callParent(arguments);
        }
    },

    destroy: function() {
        Ext.destroy(this.getIndexBar(), this.indexBarElement, this.header, this.scrollDockItems.top, this.scrollDockItems.bottom);
        if (this.intervalId) {
            cancelAnimationFrame(this.intervalId);
            delete this.intervalId;
        }
        this.callParent();
    }
});