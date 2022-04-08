/* eslint-disable no-console */
// @flow
import React from 'react';
import Page from 'component/page';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import Button from 'component/button';
import { useHistory } from 'react-router';
import * as PAGES from 'constants/pages';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { FormField } from 'component/common/form';
import { Lbryio } from 'lbryinc';
import { getStripeEnvironment } from 'util/stripe';
import moment from 'moment';
import { formatLbryUrlForWeb } from 'util/url';
import { URL } from 'config';
import { getThumbnailFromClaim } from 'util/claim';
import CreateTiersTab from 'component/creatorMemberships/createTiersTab';
import CreatorMembershipsTab from 'component/creatorMemberships/creatorMembershipsTab';

console.log(CreatorMembershipsTab);

let stripeEnvironment = getStripeEnvironment();

const TAB_QUERY = 'tab';

const TABS = {
  MY_MEMBERSHIPS: 'my_memberships',
  CREATE_TIERS: 'create_tiers',
  MY_SUPPORTERS: 'my_supporters',
  MY_PLEDGES: 'my_pledges',
};

const isDev = process.env.NODE_ENV !== 'production';

let log = (input) => {};
if (isDev) log = console.log;

type Props = {
  openModal: (string, {}) => void,
  activeChannelClaim: ?ChannelClaim,
};

const MembershipsPage = (props: Props) => {
  const {
    openModal,
    activeChannelClaim,
    doToast,
    doResolveClaimIds,
    claimsById,
  } = props;

  const {
    location: { search },
    push,
  } = useHistory();

  const [myMemberships, setMyMemberships] = React.useState([]);

  React.useEffect(() => {
    (async function() {
      const response = await Lbryio.call(
        'membership',
        'mine',
        {
          environment: stripeEnvironment,
        },
        'post'
      );

      let pledges = [];

      let channelIdsToResolve = [];

      for (const membership of response) {
        const receivedMembership = {
          channelName: membership.Membership.channel_name,
          tierName: membership.MembershipDetails.name,
          currency: membership.Subscription.plan.currency.toUpperCase(),
          supportAmount: membership.Subscription.plan.amount, // in cents or 1/100th EUR
          period: membership.Subscription.plan.interval,
          channelId: membership.MembershipDetails.channel_id,
        };

        console.log(receivedMembership);
        pledges.push(receivedMembership);
        channelIdsToResolve.push(membership.MembershipDetails.channel_id);
      }

      await doResolveClaimIds(channelIdsToResolve);

      console.log('running here');

      // add the full url from the claim
      pledges = pledges.map(function(pledge) {
        const fullClaim = claimsById[pledge.channelId];
        console.log(fullClaim);
        if (fullClaim.short_url) {
          pledge.url = formatLbryUrlForWeb(fullClaim.short_url);
        }
        pledge.thumbnail = getThumbnailFromClaim(fullClaim);
        return pledge;
      });

      setMyMemberships(pledges);
    })();
  }, []);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // TODO: replace with API call
  const yourSupporters = [{
    channelName: '@test35234',
    tierName: 'Community MVP',
    supportAmountPerMonth: '20',
    currency: 'USD',
    monthsOfSupport: 2,
  }];

  // TODO: replace with API call
  const yourPledges = myMemberships;

  const urlParams = new URLSearchParams(search);

  // if tiers are saved, then go to balance, otherwise go to tiers
  const currentView = urlParams.get(TAB_QUERY) || TABS.MY_MEMBERSHIPS;

  // based on query param or default, update value which will determine which tab to show
  let tabIndex;
  switch (currentView) {
    case TABS.MY_MEMBERSHIPS:
      tabIndex = 0;
      break;
    case TABS.CREATE_TIERS:
      tabIndex = 1;
      break;
    case TABS.MY_SUPPORTERS:
      tabIndex = 2;
      // if already have a bank account, go to tab 2, otherwise tab 3
      // haveAlreadyConfirmedBankAccount ? tabIndex = 2 : tabIndex = 3;
      break;
    case TABS.MY_PLEDGES:
      tabIndex = 3;
      // haveAlreadyConfirmedBankAccount ? tabIndex = 3 : tabIndex = 2;

      // haveAlreadyConfirmedBankAccount ? tabIndex = 2 : tabIndex = 3;
      break;
    default:
      tabIndex = 0;
      break;
  }

  // change the url based on the tab index value
  function onTabChange(newTabIndex) {
    let url = `/$/${PAGES.CREATOR_MEMBERSHIPS}?`;

    if (newTabIndex === 0) {
      url += `${TAB_QUERY}=${TABS.MY_MEMBERSHIPS}`;
    } else if (newTabIndex === 1) {
      url += `${TAB_QUERY}=${TABS.CREATE_TIERS}`;
    } else if (newTabIndex === 2) {
      url += `${TAB_QUERY}=${TABS.MY_SUPPORTERS}`;
    } else if (newTabIndex === 3) {
      url += `${TAB_QUERY}=${TABS.MY_PLEDGES}`;
    }
    push(url);
  }



  return (
    <>
      <Page className="premium-wrapper">
        <Tabs onChange={onTabChange} index={tabIndex}>
          <TabList className="tabs__list--collection-edit-page">
            <Tab>{__('My Memberships')}</Tab>
            <Tab>{__('Create Tiers')}</Tab>
            <Tab>{__('My Supporters')}</Tab>
            <Tab>{__('My Pledges')}</Tab>
          </TabList>
          <TabPanels>
            {/* My Memberships panel */}
            <TabPanel>
              <CreatorMembershipsTab />
            </TabPanel>
            <TabPanel>
              <CreateTiersTab />
            </TabPanel>
            {/** Your Supporters **/}
            <TabPanel>
              <table className="table table--transactions">
                <thead>
                  <tr>
                    <th className="date-header">Supporter Channel Name</th>
                    <th className="channelName-header">Membership Tier</th>
                    <th className="location-header">Support Amount</th>
                    <th className="channelName-header">Total Supporting Time</th>
                    <th className="amount-header">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {yourSupporters.map((supporter, i) => (
                      <>
                        <td><span dir="auto" className="button__label">@test35234</span></td>
                        <td>Community MVP</td>
                        <td>$20 USD / Month</td>
                        <td>2 Months</td>
                        <td><span dir="auto" className="button__label">See Details</span></td>
                      </>
                    ))}
                  </tr>
                </tbody>
              </table>

              {/*<h1 style={{ marginTop: '10px' }}> Here's some info about your supporters </h1>*/}

              {/* <h1 style={{ marginTop: '10px' }}> You can find some creators to support on the membership page here </h1> */}
            </TabPanel>
            {/** your pledges tab **/}
            <TabPanel>
              { myMemberships.length > 0 && (
                <table className="table table--transactions">
                  <thead>
                  <tr>
                    <th className="date-header">Channel You're Supporting</th>
                    <th className="channelName-header">Membership Tier</th>
                    <th className="channelName-header">Total Supporting Time</th>
                    <th className="location-header">Support Amount</th>
                    <th className="amount-header">Details</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    {myMemberships.map((pledge, i) => (
                      <>
                        <td>
                          <Button button="link" navigate={pledge.url + '?view=membership'}>
                            <img src={pledge.thumbnail} style={{ maxHeight: '70px', marginRight: '13px' }}/>
                            <span dir="auto" className="button__label">{pledge.channelName}</span>
                          </Button>
                        </td>
                        <td>{pledge.tierName}</td>
                        <td>{pledge.channelName}</td>
                        <td>${pledge.supportAmount / 100} {pledge.currency} / {capitalizeFirstLetter(pledge.period)}</td>
                        <td><span dir="auto" className="button__label"><Button button="primary" label={__('See Details')} navigate={pledge.url + '?view=membership'} /></span></td>
                      </>
                    ))}
                  </tr>
                  </tbody>
                </table>
              )}

              { yourPledges.length === 0 && (
                <>
                  <h1 style={{ marginTop: '10px' }}> You are not currently supporting any creators </h1>

                  <h1 style={{ marginTop: '10px' }}> When you do join a membership you will be able to see it here </h1>

                  {/* <h1 style={{ marginTop: '10px' }}> You can find some creators to support on the membership page here </h1> */}
                </>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Page>
    </>
  );
};

export default MembershipsPage;
