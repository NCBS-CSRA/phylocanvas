$(function(){

	(function(){

        window.WGST.exports.mapFullscreenIdToTemplateId = {
            'collection-map': 'collection-map-fullscreen',
            'collection-data': 'collection-data-fullscreen'
        };

        window.WGST.exports.mapFullscreenIdToPanelType = {
            'collection-map': 'collection-map',
            'collection-data': 'collection-data'
        };

        window.WGST.exports.createFullscreen = function(fullscreenId, templateContext) {

            //
            // Check if fullscreen already exists
            //
            if ($('.wgst-fullscreen[data-fullscreen-id="' + fullscreenId + '"]').length > 0) {
                return;
            }

            //
            // Check if template context was passed
            //
            if (typeof templateContext === 'undefined') {
                console.error('[WGST][Error] No template context were provided.');
                return;
            }

            //
            // Get fullscreen's label
            //
            templateContext.fullscreenLabel = window.WGST.exports.getContainerLabel({
                containerName: 'fullscreen',
                containerType: templateContext.fullscreenType,
                containerId: fullscreenId
            });

            //
            // Render
            //
            var fullscreenTemplateId = window.WGST.exports.mapFullscreenIdToTemplateId[templateContext.fullscreenType];
            var fullscreenTemplateSource = $('.wgst-template[data-template-id="' + fullscreenTemplateId + '"]').html(),
                fullscreenTemplate = Handlebars.compile(fullscreenTemplateSource),
                fullscreenHtml = fullscreenTemplate(templateContext);

            $('.wgst-workspace').prepend(fullscreenHtml);

            //
            // Create hidable
            //
            window.WGST.exports.createHidable(fullscreenId, templateContext.fullscreenLabel);

        };

        window.WGST.exports.removeFullscreen = function(fullscreenId) {
            $('.wgst-fullscreen[data-fullscreen-id="' + fullscreenId + '"]').remove();

            //
            // Update hidable state
            //
            window.WGST.exports.hidableFullscreenRemoved(fullscreenId);
        };

        window.WGST.exports.showFullscreen = function(fullscreenId) {
            $('.wgst-fullscreen[data-fullscreen-id="' + fullscreenId + '"]').removeClass('hide-this invisible-this');
        
            //
            // Update hidable state
            //
            window.WGST.exports.hidableFullscreenShown(fullscreenId);
        };

        window.WGST.exports.bringFullscreenToFront = function(fullscreenId) {

            $('.wgst-fullscreen[data-fullscreen-id="' + fullscreenId + '"]').css('z-index', '9999');
        
            //
            // Update hidable state
            //
            //window.WGST.exports.hidableFullscreenShown(fullscreenId);
        };

        window.WGST.exports.bringFullscreenToBack = function(fullscreenId) {

            $('.wgst-fullscreen[data-fullscreen-id="' + fullscreenId + '"]').css('z-index', 'auto');
        
            //
            // Update hidable state
            //
            //window.WGST.exports.hidableFullscreenShown(fullscreenId);
        };

        window.WGST.exports.bringFullscreenToPanel = function(fullscreenId, panelWasCreated) {
            //
            // Check if fullscreen exists
            //
            if ($('.wgst-fullscreen[data-fullscreen-id="' + fullscreenId + '"]').length === 0) {
                return;
            }

            //
            // Create panel
            //
            var panelType = fullscreenId.split('__')[0],
                panelId = fullscreenId,
                collectionId = fullscreenId.split('__')[1],
                fullscreenType = panelType;

            console.debug('[WGST][Debug] bringFullscreenToPanel | fullscreenType: ' + fullscreenType);
            console.debug('[WGST][Debug] bringFullscreenToPanel | fullscreenId: ' + fullscreenId);
            console.debug('[WGST][Debug] bringFullscreenToPanel | panelId: ' + panelId);
            console.debug('[WGST][Debug] bringFullscreenToPanel | panelType: ' + panelType);
            console.debug('[WGST][Debug] bringFullscreenToPanel | collectionID: ' + collectionId);

            window.WGST.exports.createPanel(panelType, {
                panelId: panelId,
                panelType: panelType,
                collectionId: collectionId
            });

            //
            // Allow to move content from fullscreen to panel before you remove fullscreen
            //
            if (typeof panelWasCreated !== 'undefined') {
                panelWasCreated();
            }

            //
            // Copy panel specific content
            //

            //
            // Data fullscreen
            //
            if (fullscreenType === 'collection-data') {

                var $fullscreenContent = $('.wgst-fullscreen[data-fullscreen-id="' + fullscreenId + '"]').find('.wgst-panel-body');
                var $panel = $('.wgst-panel[data-panel-id="' + panelId + '"]');

                $panel.find('.wgst-panel-body').replaceWith($fullscreenContent.clone(true));

                $panel.find('.wgst-collection-controls').removeClass('hide-this');

//$('[data-toggle="tooltip"]').tooltip('destroy');

            //
            // Map fullscreen
            //
            } else if (fullscreenType === 'collection-map') {

                //
                // Copy map content to panel
                //
                $('.wgst-panel[data-panel-id="' + panelId + '"]')
                    .find('.wgst-panel-body-content')
                    .append(window.WGST.geo.map.canvas.getDiv());
            }

            //
            // Remove fullscreen
            //
            window.WGST.exports.removeFullscreen(fullscreenId);

            //
            // Show panel
            //
            window.WGST.exports.showPanel(panelId);
            
            //
            // Resize map
            //
            if (fullscreenType === 'collection-map') {

                google.maps.event.trigger(window.WGST.geo.map.canvas, 'resize');

            }

            //
            // Bring panel to front
            //
            window.WGST.exports.bringPanelToFront(panelId);

            //
            // Trigger Twitter Bootstrap tooltip
            //
            //$('[data-toggle="tooltip"]').tooltip();

        };

        window.WGST.exports.bringPanelToFullscreen = function(panelId, fullscreenWasCreated) {
            
            var fullscreenType = panelId.split('__')[0];
            var fullscreenId = panelId;

            console.debug('[WGST][Debug] bringPanelToFullscreen | fullscreenType: ' + fullscreenType);
            console.debug('[WGST][Debug] bringPanelToFullscreen | fullscreenId: ' + fullscreenId);
            console.debug('[WGST][Debug] bringPanelToFullscreen | panelId: ' + panelId);

            //
            // Check if fullscreen exists
            //
            if ($('.wgst-fullscreen[data-fullscreen-id="' + fullscreenId + '"]').length > 0) {
                return;
            }

            //
            // Create fullscreen
            //
            window.WGST.exports.createFullscreen(fullscreenId, {
                fullscreenType: fullscreenType,
                fullscreenId: fullscreenId
            });

            //
            // Call custom function after creating fullscreen
            //
            if (typeof panelWasCreated !== 'undefined') {
                panelWasCreated();
            }

            //
            // Copy panel specific content
            //
            var panelType = $('.wgst-panel[data-panel-id="' + panelId + '"]').attr('data-panel-type'),
                $fullscreen = $('.wgst-fullscreen[data-fullscreen-id="' + fullscreenId + '"]');

            //
            // Data panel
            //
            if (panelType === 'collection-data') {
                var $collectionDataContent = $('.wgst-panel[data-panel-id="' + panelId + '"]').find('.wgst-panel-body');
                //$fullscreen.append($collectionDataContent.clone(true));

                $collectionDataContent.clone(true).appendTo($fullscreen);

                //
                // Hide controls
                //
                $fullscreen.find('.wgst-collection-controls').addClass('hide-this');

//$('[data-toggle="tooltip"]').tooltip('destroy');

            //
            // Map panel
            //
            } else if (panelType === 'collection-map') {

                //
                // Copy map content to panel
                //
                $('.wgst-fullscreen[data-fullscreen-id="' + fullscreenId + '"]')
                    .find('.wgst-map')
                    .replaceWith(window.WGST.geo.map.canvas.getDiv());

            }

            //
            // Show fullscreen
            //
            window.WGST.exports.showFullscreen(fullscreenId);

            //
            // Resize map
            //
            if (panelType === 'collection-map') {

                google.maps.event.trigger(window.WGST.geo.map.canvas, 'resize');

            }

            //
            // Remove panel
            //
            window.WGST.exports.removePanel(panelId);

            //
            // Trigger Twitter Bootstrap tooltip
            //
            console.debug('>>>> WATCH this one: ' + $('[data-toggle="tooltip"]').length);

            //$('[data-toggle="tooltip"]').tooltip();

        };
















        var __old__bringFullscreenToPanel = function(andShowPanel, callback) {
            var activeFullscreenElement = $('.wgst-fullscreen--active'),
                fullscreenName = activeFullscreenElement.attr('data-fullscreen-name');

            activeFullscreenElement
                .removeClass('wgst-fullscreen--active')
                .removeClass('wgst-fullscreen--visible');

            if (typeof fullscreenName !== 'undefined') {
                if (andShowPanel) {
                    showPanelBodyContent(fullscreenName);
                    showPanel(fullscreenName);
                }
            }

            if (fullscreenName === 'map') {
                $('.wgst-panel[data-panel-name="' + fullscreenName + '"] .wgst-panel-body-content')
                    .html('')
                    .append(WGST.geo.map.canvas.getDiv());

                //google.maps.event.trigger(WGST.geo.map.canvas, 'resize');
            } // if

            // Remove fullscreen content
            activeFullscreenElement.html('');

            if (typeof callback === 'function') {
                callback();
            }
        };

        var __old__bringPanelToFullscreen = function(panelId, callback) {
            var panel = $('[data-panel-id="' + panelId + '"]'),
                panelName = panel.attr('data-panel-name');

            //$('.wgst-fullscreen__' + panelName)
            var fullscreen = $('[data-fullscreen-name="' + panelName + '"]')
                .addClass('wgst-fullscreen--active')
                .addClass('wgst-fullscreen--visible');

            if (panelName === 'collection') {
                fullscreen.append($('.collection-details').clone(true));
            }

            deactivatePanel(panelName); // or closePanel() ?

            if (typeof callback === 'function') {
                callback();
            }
        };

	})();

});