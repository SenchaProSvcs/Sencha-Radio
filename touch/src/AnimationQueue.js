(function() {
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        ln = vendors.length,
        i, vendor;

    for (i = 0; i < ln && !window.requestAnimationFrame; ++i) {
        vendor = vendors[i];
        window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

(function(global) {

Ext.define('Ext.AnimationQueue', {
    singleton: true,

    constructor: function() {
        var bind = Ext.Function.bind;

        this.queue = [];
        this.taskQueue = [];
        this.runningQueue = [];
        this.idleQueue = [];
        this.isRunning = false;
        this.isIdle = true;

        this.run = bind(this.run, this);
        this.whenIdle = bind(this.whenIdle, this);
        this.processIdleQueueItem = bind(this.processIdleQueueItem, this);
        this.processTaskQueueItem = bind(this.processTaskQueueItem, this);
    },

    /**
     *
     * @param fn
     * @param [scope]
     * @param [args]
     */
    start: function(fn, scope, args) {
        this.queue.push(arguments);

        if (!this.isRunning) {
            if (this.hasOwnProperty('idleTimer')) {
                clearTimeout(this.idleTimer);
                delete this.idleTimer;
            }

            if (this.hasOwnProperty('idleQueueTimer')) {
                clearTimeout(this.idleQueueTimer);
                delete this.idleQueueTimer;
            }

            this.isIdle = false;
            this.isRunning = true;
            //<debug>
            this.startCountTime = Date.now();
            this.count = 0;
            //</debug>
            this.doStart();
        }
    },

    run: function() {
        if (!this.isRunning) {
            return;
        }

        var queue = this.runningQueue,
            i, ln;

        queue.push.apply(queue, this.queue);

        for (i = 0, ln = queue.length; i < ln; i++) {
            this.invoke(queue[i]);
        }

        queue.length = 0;

        //<debug>
        var now = Date.now(),
            startCountTime = this.startCountTime,
            elapse = now - startCountTime,
            count = ++this.count;

        if (elapse >= 200) {
            this.onFpsChanged(count * 1000 / elapse, count, elapse);
            this.startCountTime = now;
            this.count = 0;
        }
        //</debug>

        this.doIterate();
    },

    //<debug>
    onFpsChanged: Ext.emptyFn,

    onStop: Ext.emptyFn,
    //</debug>

    doStart: function() {
        this.animationFrameId = requestAnimationFrame(this.run);
    },

    doIterate: function() {
        this.animationFrameId = requestAnimationFrame(this.run);
    },

    doStop: function() {
        cancelAnimationFrame(this.animationFrameId);
    },

    /**
     *
     * @param fn
     * @param [scope]
     * @param [args]
     */
    stop: function(fn, scope, args) {
        if (!this.isRunning) {
            return;
        }

        var queue = this.queue,
            ln = queue.length,
            i, item;

        for (i = 0; i < ln; i++) {
            item = queue[i];
            if (item[0] === fn && item[1] === scope && item[2] === args) {
                queue.splice(i, 1);
                i--;
                ln--;
            }
        }

        if (ln === 0) {
            this.doStop();
            //<debug>
            this.onStop();
            //</debug>
            this.isRunning = false;

            this.idleTimer = setTimeout(this.whenIdle, 100);
        }
    },

    onIdle: function(fn, scope, args) {
        var listeners = this.idleQueue,
            i, ln, listener;

        for (i = 0, ln = listeners.length; i < ln; i++) {
            listener = listeners[i];
            if (fn === listener[0] && scope === listener[1] && args === listener[2]) {
                return;
            }
        }

        listeners.push(arguments);

        if (this.isIdle) {
            this.processIdleQueue();
        }
    },

    unIdle: function(fn, scope, args) {
        var listeners = this.idleQueue,
            i, ln, listener;

        for (i = 0, ln = listeners.length; i < ln; i++) {
            listener = listeners[i];
            if (fn === listener[0] && scope === listener[1] && args === listener[2]) {
                listeners.splice(i, 1);
                return true;
            }
        }

        return false;
    },

    queueTask: function(fn, scope, args) {
        this.taskQueue.push(arguments);
        this.processTaskQueue();
    },

    dequeueTask: function(fn, scope, args) {
        var listeners = this.taskQueue,
            i, ln, listener;

        for (i = 0, ln = listeners.length; i < ln; i++) {
            listener = listeners[i];
            if (fn === listener[0] && scope === listener[1] && args === listener[2]) {
                listeners.splice(i, 1);
                i--;
                ln--;
            }
        }
    },

    invoke: function(listener) {
        var fn = listener[0],
            scope = listener[1],
            args = listener[2];

        fn = (typeof fn == 'string' ? scope[fn] : fn);

        if (Ext.isArray(args)) {
            fn.apply(scope, args);
        }
        else {
            fn.call(scope, args);
        }
    },

    whenIdle: function() {
        this.isIdle = true;
        this.processIdleQueue();
    },

    processIdleQueue: function() {
        if (!this.hasOwnProperty('idleQueueTimer')) {
            this.idleQueueTimer = setTimeout(this.processIdleQueueItem, 1);
        }
    },

    processIdleQueueItem: function() {
        delete this.idleQueueTimer;

        if (!this.isIdle) {
            return;
        }

        var listeners = this.idleQueue,
            listener;

        if (listeners.length > 0) {
            listener = listeners.shift();
            this.invoke(listener);
            this.processIdleQueue();
        }
    },

    processTaskQueue: function() {
        if (!this.hasOwnProperty('taskQueueTimer')) {
            this.taskQueueTimer = setTimeout(this.processTaskQueueItem, 15);
        }
    },

    processTaskQueueItem: function() {
        delete this.taskQueueTimer;

        var listeners = this.taskQueue,
            listener;

        if (listeners.length > 0) {
            listener = listeners.shift();
            this.invoke(listener);
            this.processTaskQueue();
        }
    }
});

})(this);
