odoo.define('root.widget', function (require) {
'use strict';

require('web.dom_ready');
var websiteRootData = require('website.WebsiteRoot');

var websiteRoot = new websiteRootData.WebsiteRoot(null);
return websiteRoot.attachTo(document.body).then(function () {
    return websiteRoot;
});
});

//==============================================================================

odoo.define('website.WebsiteRoot', function (require) {
'use strict';

var ajax = require('web.ajax');
var core = require('web.core');
var Dialog = require('web.Dialog');
var ServiceProviderMixin = require('web.ServiceProviderMixin');
var session = require('web.session');
var utils = require('web.utils');
var rootWidget = require('web_editor.root_widget');
var sAnimation = require('website.content.snippets.animation');
require("website.content.zoomodoo");

var _t = core._t;

var websiteRootRegistry = new rootWidget.RootWidgetRegistry();

// Load localizations outside the WebsiteRoot to not wait for DOM ready (but
// wait for them in WebsiteRoot)
function getLang() {
    var html = document.documentElement;
    return (html.getAttribute('lang') || 'en_US').replace('-', '_');
}
var lang = utils.get_cookie('frontend_lang') || getLang(); // FIXME the cookie value should maybe be in the ctx?
var localeDef = ajax.loadJS('/web/webclient/locale/' + lang.replace('-', '_'));

/**
 * Element which is designed to be unique and that will be the top-most element
 * in the widget hierarchy. So, all other widgets will be indirectly linked to
 * this Class instance. Its main role will be to retrieve RPC demands from its
 * children and handle them.
 */
var WebsiteRoot = rootWidget.RootWidget.extend(ServiceProviderMixin, {
    events: _.extend({}, rootWidget.RootWidget.prototype.events || {}, {
        'click .js_change_lang': '_onLangChangeClick',
        'click .js_publish_management .js_publish_btn': '_onPublishBtnClick',
        'submit .js_website_submit_form': '_onWebsiteFormSubmit',
        'click .js_disable_on_click': '_onDisableOnClick',
        'click .js_multi_website_switch': '_multiWebsiteSwitch',
        'click .js_multi_company_switch': '_multiCompanySwitch',
    }),
    custom_events: _.extend({}, rootWidget.RootWidget.prototype.custom_events || {}, {
        animation_start_demand: '_onAnimationStartDemand',
        animation_stop_demand: '_onAnimationStopDemand',
        context_get: '_onContextGet',
        main_object_request: '_onMainObjectRequest',
        ready_to_clean_for_save: '_onAnimationStopDemand',
    }),

    /**
     * @constructor
     */
    init: function () {
        this._super.apply(this, arguments);
        ServiceProviderMixin.init.call(this);
        this.animations = [];
    },
    /**
     * @override
     */
    willStart: function () {
        // TODO would be even greater to wait for those only if necessary
        return $.when(
            this._super.apply(this, arguments),
            session.is_bound,
            localeDef
        );
    },
    /**
     * @override
     */
    start: function () {
        var defs = [this._super.apply(this, arguments)];

        // Animations
        defs.push(this._startAnimations());

        // Compatibility lang change ?
        if (!this.$('.js_change_lang').length) {
            var $links = this.$('ul.js_language_selector li a:not([data-oe-id])');
            var m = $(_.min($links, function (l) {
                return $(l).attr('href').length;
            })).attr('href');
            $links.each(function () {
                var $link = $(this);
                var t = $link.attr('href');
                var l = (t === m) ? "default" : t.split('/')[1];
                $link.data('lang', l).addClass('js_change_lang');
            });
        }

        // Display image thumbnail
        this.$(".o_image[data-mimetype^='image']").each(function () {
            var $img = $(this);
            if (/gif|jpe|jpg|png/.test($img.data('mimetype')) && $img.data('src')) {
                $img.css('background-image', "url('" + $img.data('src') + "')");
            }
        });

        // Enable magnify on zommable img
        this.$('.zoomable img[data-zoom]').zoomOdoo();

        // Auto scroll
        if (window.location.hash.indexOf("scrollTop=") > -1) {
            this.el.scrollTop = +window.location.hash.match(/scrollTop=([0-9]+)/)[1];
        }

        // Fix for IE:
        if ($.fn.placeholder) {
            $('input, textarea').placeholder();
        }

        return $.when.apply($, defs);
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Automatically add the global context to RPC commands.
     *
     * @override
     */
    _call_service: function (ev) {
        if (ev.data.service === 'ajax' && ev.data.method === 'rpc') {
            var route = ev.data.args[0];
            if (_.str.startsWith(route, '/web/dataset/call_kw/')) {
                var params = ev.data.args[1];
                var options = ev.data.args[2];
                params.kwargs.context = _.extend({}, this._getContext(), params.kwargs.context || {});
                if (options) {
                    params.kwargs.context = _.omit(params.kwargs.context, options.noContextKeys);
                    ev.data.args[2] = _.omit(options, 'noContextKeys');
                }
                params.kwargs.context = JSON.parse(JSON.stringify(params.kwargs.context));
            }
        }
        return ServiceProviderMixin._call_service.apply(this, arguments);
    },
    /**
     * Retrieves the global context of the public environment. This is the
     * context which is automatically added to each RPC.
     *
     * @private
     * @param {Object} [context]
     * @returns {Object}
     */
    _getContext: function (context) {
        var html = document.documentElement;
        return _.extend({
            'lang': getLang(),
            'website_id': html.getAttribute('data-website-id') | 0,
        }, context || {});
    },
    /**
     * Retrieves the global context of the public environment (as
     * @see _getContext) but with extra informations that would be useless to
     * send with each RPC.
     *
     * @private
     * @param {Object} [context]
     * @returns {Object}
     */
    _getExtraContext: function (context) {
        var html = document.documentElement;
        return _.extend(this._getContext(), {
            'editable': !!(html.dataset.editable || $('[data-oe-model]').length), // temporary hack, this should be done in python
            'translatable': !!html.dataset.translatable,
            'edit_translations': !!html.dataset.edit_translations,
        }, context || {});
    },
    /**
     * As the WebsiteRoot instance is designed to be unique, the associated
     * registry has been instantiated outside of the class and is simply
     * returned here.
     *
     * @private
     * @override
     */
    _getRegistry: function () {
        return websiteRootRegistry;
    },
    /**
     * Creates an Animation instance for each DOM element which matches the
     * `selector` key of one of the registered animations
     * (@see Animation.selector).
     *
     * @private
     * @param {boolean} [editableMode=false] - true if the page is in edition mode
     * @param {jQuery} [$from]
     *        only initialize the animations whose `selector` matches the
     *        element or one of its descendant (default to the wrapwrap element)
     * @returns {Deferred}
     */
    _startAnimations: function (editableMode, $from) {
        var self = this;

        editableMode = editableMode || false;
        if ($from === undefined) {
            $from = this.$('#wrapwrap');
        }

        this._stopAnimations($from);

        var defs = _.map(sAnimation.registry, function (Animation, animationName) {
            var selector = Animation.prototype.selector || '';
            var $target = $from.find(selector).addBack(selector);

            var defs = _.map($target, function (el) {
                var animation = new Animation(self, editableMode);
                self.animations.push(animation);
                return animation.attachTo($(el));
            });
            return $.when.apply($, defs);
        });
        return $.when.apply($, defs);
    },
    /**
     * Destroys all animation instances. Especially needed before saving while
     * in edition mode for example.
     *
     * @private
     * @param {jQuery} [$from]
     *        only stop the animations linked to the given element(s) or one of
     *        its descendants
     */
    _stopAnimations: function ($from) {
        var removedAnimations = _.map(this.animations, function (animation) {
            if (!$from
             || $from.filter(animation.el).length
             || $from.find(animation.el).length) {
                animation.destroy();
                return animation;
            }
            return null;
        });
        this.animations = _.difference(this.animations, removedAnimations);
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Called when the root is notified that the animations have to be
     * (re)started.
     *
     * @private
     * @param {OdooEvent} ev
     */
    _onAnimationStartDemand: function (ev) {
        this._startAnimations(ev.data.editableMode, ev.data.$target)
            .done(ev.data.onSuccess)
            .fail(ev.data.onFailure);
    },
    /**
     * Called when the root is notified that the animations have to be
     * stopped.
     *
     * @private
     * @param {OdooEvent} ev
     */
    _onAnimationStopDemand: function (ev) {
        this._stopAnimations(ev.data.$target);
    },
    /**
     * Called when someone asked for the global public context.
     *
     * @private
     * @param {OdooEvent} ev
     */
    _onContextGet: function (ev) {
        if (ev.data.extra) {
            ev.data.callback(this._getExtraContext(ev.data.context));
        } else {
            ev.data.callback(this._getContext(ev.data.context));
        }
    },
    /**
     * @todo review
     * @private
     */
    _onLangChangeClick: function (ev) {
        ev.preventDefault();

        var $target = $(ev.target);
        // retrieve the hash before the redirect
        var redirect = {
            lang: $target.data('lang'),
            url: encodeURIComponent($target.attr('href').replace(/[&?]edit_translations[^&?]+/, '')),
            hash: encodeURIComponent(window.location.hash)
        };
        window.location.href = _.str.sprintf("/website/lang/%(lang)s?r=%(url)s%(hash)s", redirect);
    },
    /**
     * Checks information about the page main object.
     *
     * @private
     * @param {OdooEvent} ev
     */
    _onMainObjectRequest: function (ev) {
        var repr = $('html').data('main-object');
        var m = repr.match(/(.+)\((\d+),(.*)\)/);
        ev.data.callback({
            model: m[1],
            id: m[2] | 0,
        });
    },
    /**
     * @todo review
     * @private
     */
    _onPublishBtnClick: function (ev) {
        ev.preventDefault();

        var self = this;
        var $data = $(ev.currentTarget).parents(".js_publish_management:first");
        this._rpc({
            route: $data.data('controller') || '/website/publish',
            params: {
                id: +$data.data('id'),
                object: $data.data('object'),
            },
        })
        .done(function (result) {
            $data.toggleClass("css_unpublished css_published");
            $data.find('input').prop("checked", result);
            $data.parents("[data-publish]").attr("data-publish", +result ? 'on' : 'off');
        })
        .fail(function (err, data) {
            return new Dialog(self, {
                title: data.data ? data.data.arguments[0] : "",
                $content: $('<div/>', {
                    html: (data.data ? data.data.arguments[1] : data.statusText)
                        + '<br/>'
                        + _.str.sprintf(
                            _t('It might be possible to edit the relevant items or fix the issue in <a href="%s">the classic Odoo interface</a>'),
                            '/web#return_label=Website&model=' + $data.data('object') + '&id=' + $data.data('id')
                        ),
                }),
            }).open();
        });
    },
    /**
     * @todo review
     * @private
     */
    _onWebsiteFormSubmit: function (ev) {
        var $buttons = $(ev.currentTarget).find('button[type="submit"], a.a-submit');
        _.each($buttons, function (btn) {
            var $btn = $(btn);
            $btn.attr('data-loading-text', '<i class="fa fa-spinner fa-spin"></i> ' + $(btn).text());
            $btn.button('loading');
        });
    },
    /**
     * Called when the root is notified that the button should be
     * disabled after the first click.
     *
     * @private
     * @param {Event} ev
     */
    _onDisableOnClick: function (ev) {
        $(ev.currentTarget).addClass('disabled');
    },

    /**
     * Called when clicking on the multi-website switcher.
     *
     * @param {OdooEvent} ev
     */
    _multiWebsiteSwitch: function (ev) {
        var website_id_to_switch_to = ev.currentTarget.getAttribute('website-id');

        // need to force in each case, even if domain is set
        // Website 1: localhost; Website 2: 0.0.0.0; website 3: -
        // when you switch 3 <--> 1, you need to force the website

        var website_domain = ev.currentTarget.getAttribute('domain');
        var url = $.param.querystring(window.location.href, {'fw': website_id_to_switch_to});
        if (website_domain && window.location.hostname !== website_domain) {
            // if domain unchanged, this line will do a nop while we need to refresh
            // the page to load the new forced website.
            url = new URL(url);
            url.hostname = website_domain;
        }
        window.location.href = url;
    },

    _multiCompanySwitch: function (ev) {
        var company_id_to_switch_to = ev.currentTarget.getAttribute('company-id');
        this._rpc({model: 'res.users',
            method: 'write',
            args: [odoo.session_info.user_id, {'company_id': parseInt(company_id_to_switch_to, 10)}],
        }).then(function () {
            window.location.reload(true);
        });
    },
});

return {
    WebsiteRoot: WebsiteRoot,
    websiteRootRegistry: websiteRootRegistry,
};
});
