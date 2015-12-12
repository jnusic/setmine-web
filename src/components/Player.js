import React from 'react';
import {generateSound, togglePlay} from '../services/playerService';

import PlayerControl from './PlayerControl';
import PlayerSeek from './PlayerSeek';
import PlayerSetInfo from './PlayerSetInfo';
import PlayerTracklist from './PlayerTracklist';
import PlayerShare from './PlayerShare';

var playingClass = 'fa center fa-pause play-button';
var pausedClass = 'fa center fa-play play-button';

var Player = React.createClass({

	componentDidMount: function() {
		var {push, appState} = this.props;
		var sound = appState.get('sound');

		if(sound != null) {
			push({
				type: 'SHALLOW_MERGE',
				data: {
					playerHidden: false
				}
			});
		}
	},

	componentWillReceiveProps: function(nextProps) {
		var {push, appState} = this.props;

		if(nextProps.appState.get('currentSet') != appState.get('currentSet')) {
			var starttime = nextProps.appState.get('currentSet').starttime;

			generateSound(starttime, nextProps.appState, push)
			.then(function(smObj) {
				
				//play a new set
				push({
					type: 'SHALLOW_MERGE',
					data: {
						sound: smObj,
						playing: true,
						playerHidden: false
					}
				});

				// Log Mixpanel event
				var selectedSet = nextProps.appState.get('currentSet');
				var setName = selectedSet.artist+' - '+selectedSet.event;

				mixpanel.track("Set Play", {
					"set_id": selectedSet.id,
					"set_name": setName,
					"set_artist": selectedSet.artist,
					"set_event": selectedSet.event
				});

				// mixpanel user tracking
				mixpanel.people.increment("play_count");
				mixpanel.people.append("sets_played_ids", setProperties.set_id);
				mixpanel.people.append("sets_played_names", setProperties.set_name);
				mixpanel.people.append("sets_played_artists", setProperties.set_artist);
				mixpanel.people.append("sets_played_events", setProperties.set_event);
			});
		} 
	},

	togglePlay: function() {
		var sound = this.props.appState.get('sound');
		togglePlay(sound);
	},

	render: function() {
		var push = this.props.push;
		var appState = this.props.appState;
		var currentSet = appState.get('currentSet');
		var playerHidden = appState.get('playerHidden');

		var props = {
			appState: appState,
			push: push
		};

		var playerClass = playerHidden? 'flex-row hidden' : 'flex-row';

		return (
			<div className={playerClass} id='Player'>
				<PlayerControl appState={appState} push={push} />
				<div className='flex-column flex'>
					<PlayerSeek appState={appState} push={push} />
					<div className='flex flex-row'>
						<PlayerSetInfo appState={appState} push={push} />
						<PlayerTracklist {...props} />
						<PlayerShare appState={appState} push={push} />
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Player;