import { connect } from 'react-redux';
import { selectMyChannelClaims, selectClaimsByUri, selectOdyseeMembershipForUri } from 'redux/selectors/claims';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { doSetActiveChannel, doSetIncognito } from 'redux/actions/app';
import { doFetchOdyseeMembershipsById } from 'redux/actions/memberships';
import ChannelSelector from './view';

const select = (state, props) => {
  const activeChannelClaim = selectActiveChannelClaim(state);

  return {
    channels: selectMyChannelClaims(state),
    activeChannelClaim,
    incognito: selectIncognito(state),
    odyseeMembershipByUri: (uri) => selectOdyseeMembershipForUri(state, uri),
    claimsByUri: selectClaimsByUri(state),
  };
};

export default connect(select, {
  doSetActiveChannel,
  doSetIncognito,
  doFetchOdyseeMembershipsById,
})(ChannelSelector);
