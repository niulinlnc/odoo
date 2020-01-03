odoo.define('website_livechat.livechat_request', function (require) {
"use strict";

var utils = require('web.utils');
var session = require('web.session');
var LivechatButton = require('im_livechat.im_livechat').LivechatButton;


LivechatButton.include({

    /**
     * @override
     * Check if a chat request is opened for this visitor
     * if yes, replace the session cookie and start the conversation immediately.
     * Do this before calling super to have everything ready before executing existing start logic.
     * This is used for chat request mechanism, when an operator send a chat request
     * from backend to a website visitor.
     */
    willStart: function () {
        if (this.options.chat_request_session) {
            utils.set_cookie('im_livechat_session', JSON.stringify(this.options.chat_request_session), 60*60);
        }
        return this._super();
    },

    /**
     * @override
     * Called when the visitor closes the livechat chatter
     * (no matter the way : close, send feedback, ..)
     * this will deactivate the mail_channel, clean the chat request if any
     * and allow the operators to send the visitor a new chat request
     */
    _closeChat: function () {
        var self = this;
        var cookie = utils.get_cookie('im_livechat_session');
        if (cookie) {
            var channel = JSON.parse(cookie);
            var ready = session.rpc('/im_livechat/visitor_leave_session', {uuid: channel.uuid});
            ready.then(self._super());
        }
        else {
            this._super();
        }
    },
});

return {
    LivechatButton: LivechatButton,
};

});
