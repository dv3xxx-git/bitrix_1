this.BX = this.BX || {};
this.BX.Landing = this.BX.Landing || {};
this.BX.Landing.UI = this.BX.Landing.UI || {};
(function (exports,main_core,landing_ui_card_basecard,landing_loc) {
	'use strict';

	function _templateObject6() {
	  var data = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<span class=\"ui-link ui-link-secondary ui-link-dashed landing-ui-card-message-close-link\" onclick=\"", "\">\n\t\t\t\t\t", "\n\t\t\t\t</span>\n\t\t\t"]);

	  _templateObject6 = function _templateObject6() {
	    return data;
	  };

	  return data;
	}

	function _templateObject5() {
	  var data = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"landing-ui-card-message-actions\">\n\t\t\t\t\t", "\n\t\t\t\t</div>\n\t\t\t"]);

	  _templateObject5 = function _templateObject5() {
	    return data;
	  };

	  return data;
	}

	function _templateObject4() {
	  var data = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div \n\t\t\t\t\tclass=\"landing-ui-card-message-close-button\" \n\t\t\t\t\tonclick=\"", "\"\n\t\t\t\t\ttitle=\"", "\"\n\t\t\t\t></div>\n\t\t\t"]);

	  _templateObject4 = function _templateObject4() {
	    return data;
	  };

	  return data;
	}

	function _templateObject3() {
	  var data = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"landing-ui-card-message-description\">", "</div>\n\t\t\t"]);

	  _templateObject3 = function _templateObject3() {
	    return data;
	  };

	  return data;
	}

	function _templateObject2() {
	  var data = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"landing-ui-card-message-title\">", "</div>\n\t\t\t"]);

	  _templateObject2 = function _templateObject2() {
	    return data;
	  };

	  return data;
	}

	function _templateObject() {
	  var data = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"landing-ui-card-message-icon\" style=\"background-image: url(", ")\"></div>\n\t\t\t"]);

	  _templateObject = function _templateObject() {
	    return data;
	  };

	  return data;
	}
	var MessageCard = /*#__PURE__*/function (_BaseCard) {
	  babelHelpers.inherits(MessageCard, _BaseCard);

	  function MessageCard(options) {
	    var _this;

	    babelHelpers.classCallCheck(this, MessageCard);
	    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(MessageCard).call(this, options));

	    _this.setEventNamespace('BX.Landing.UI.Card.MessageCard');

	    main_core.Dom.addClass(_this.getLayout(), 'landing-ui-card-message');
	    _this.onCloseClick = _this.onCloseClick.bind(babelHelpers.assertThisInitialized(_this));

	    if (_this.options.angle === false) {
	      main_core.Dom.addClass(_this.getLayout(), 'landing-ui-card-message-without-angle');
	    }

	    if (main_core.Type.isStringFilled(_this.options.icon)) {
	      main_core.Dom.append(_this.getIcon(), _this.getHeader());
	    }

	    main_core.Dom.append(_this.getTitle(), _this.getHeader());
	    main_core.Dom.append(_this.getDescription(), _this.getBody());

	    if (_this.options.closeable !== false) {
	      main_core.Dom.append(_this.getCloseButton(), _this.getLayout());
	    }

	    if (_this.options.hideActions !== true) {
	      main_core.Dom.append(_this.getActionsContainer(), _this.getLayout());
	    }

	    if (_this.isAllowRestoreState()) {
	      var state = MessageCard.cache.get(_this.options.id, {
	        shown: true
	      });

	      if (state.shown) {
	        _this.show();
	      } else {
	        _this.hide();
	      }
	    }

	    return _this;
	  }

	  babelHelpers.createClass(MessageCard, [{
	    key: "isAllowRestoreState",
	    value: function isAllowRestoreState() {
	      return this.options.restoreState && this.options.id;
	    }
	  }, {
	    key: "getIcon",
	    value: function getIcon() {
	      var _this2 = this;

	      return this.cache.remember('icon', function () {
	        return main_core.Tag.render(_templateObject(), _this2.options.icon);
	      });
	    }
	  }, {
	    key: "getTitle",
	    value: function getTitle() {
	      var _this3 = this;

	      return this.cache.remember('title', function () {
	        return main_core.Tag.render(_templateObject2(), _this3.options.header);
	      });
	    }
	  }, {
	    key: "getDescription",
	    value: function getDescription() {
	      var _this4 = this;

	      return this.cache.remember('description', function () {
	        return main_core.Tag.render(_templateObject3(), _this4.options.description);
	      });
	    }
	  }, {
	    key: "getCloseButton",
	    value: function getCloseButton() {
	      var _this5 = this;

	      return this.cache.remember('closeButton', function () {
	        return main_core.Tag.render(_templateObject4(), _this5.onCloseClick, landing_loc.Loc.getMessage('LANDING_MESSAGE_CARD_HIDE'));
	      });
	    }
	  }, {
	    key: "onCloseClick",
	    value: function onCloseClick(event) {
	      event.preventDefault();
	      this.hide();
	      this.emit('onClose');
	      MessageCard.cache.set(this.options.id, {
	        shown: false
	      });
	    }
	  }, {
	    key: "getActionsContainer",
	    value: function getActionsContainer() {
	      var _this6 = this;

	      return this.cache.remember('actionsContainer', function () {
	        return main_core.Tag.render(_templateObject5(), _this6.getCloseLink());
	      });
	    }
	  }, {
	    key: "getCloseLink",
	    value: function getCloseLink() {
	      var _this7 = this;

	      return this.cache.remember('closeLink', function () {
	        return main_core.Tag.render(_templateObject6(), _this7.onCloseClick, landing_loc.Loc.getMessage('LANDING_MESSAGE_CARD_HIDE'));
	      });
	    }
	  }, {
	    key: "onClick",
	    value: function onClick() {
	      this.onClickHandler(this);
	      this.emit('onClick');
	    }
	  }]);
	  return MessageCard;
	}(landing_ui_card_basecard.BaseCard);
	babelHelpers.defineProperty(MessageCard, "cache", new main_core.Cache.MemoryCache());

	exports.MessageCard = MessageCard;

}((this.BX.Landing.UI.Card = this.BX.Landing.UI.Card || {}),BX,BX.Landing.UI.Card,BX.Landing));
//# sourceMappingURL=messagecard.bundle.js.map
